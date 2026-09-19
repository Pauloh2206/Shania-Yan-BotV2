import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);
const TEMP_FOLDER = path.join(process.cwd(), 'temp_downloads');
const COOKIES_FILE = path.resolve(process.cwd(), 'youtube-cookies.txt');

if (!fs.existsSync(TEMP_FOLDER)) {
    fs.mkdirSync(TEMP_FOLDER, { recursive: true });
}

function fixCookiesFormat(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let lines = content.split(/\r?\n/);
        let fixedLines = lines.map(line => {
            if (!line.trim() || line.startsWith('#')) return line;
            return line.replace(/\s+/g, '\t');
        });
        let newContent = fixedLines.join('\n');
        if (!newContent.startsWith('# Netscape HTTP Cookie File')) {
            newContent = '# Netscape HTTP Cookie File\n' + newContent;
        }
        fs.writeFileSync(filePath, newContent, 'utf8');
    } catch (e) {
        console.error('[Utilitário de Vídeo] Erro ao formatar cookies:', e.message);
    }
}

function shellQuote(value) {
    return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

export async function downloadYoutubeMp4_Fast(videoUrl) {
    const timestamp = Date.now();
    const fileName = path.join(TEMP_FOLDER, `${timestamp}_fast.mp4`);
    const cookiesParam = fs.existsSync(COOKIES_FILE)
        ? (() => { fixCookiesFormat(COOKIES_FILE); return `--cookies ${shellQuote(COOKIES_FILE)}`; })()
        : '';
    const commonArgs = [
        cookiesParam,
        '--no-playlist',
        '--no-warnings',
        '--js-runtimes', shellQuote(`node:${process.execPath}`),
        '--remote-components', 'ejs:github',
        '--extractor-args', shellQuote('youtube:player_client=android_embedded,web'),
        '--merge-output-format', 'mp4',
        '--output', shellQuote(fileName),
        '--restrict-filenames'
    ].filter(Boolean).join(' ');

    const commands = [
        // Prefere vídeo até 720p + melhor áudio; evita exigir um MP4 único.
        `yt-dlp --format ${shellQuote('bv*[height<=720]+ba/b[height<=720]/best')} ${commonArgs} ${shellQuote(videoUrl)}`,
        // Fallback para vídeos que não expõem uma combinação limitada por altura.
        `yt-dlp --format ${shellQuote('bv*+ba/best')} ${commonArgs} ${shellQuote(videoUrl)}`
    ];

    let lastError;
    for (const command of commands) {
        try {
            await execPromise(command, {
                maxBuffer: 1024 * 1024 * 100,
                timeout: 120000
            });
            if (fs.existsSync(fileName) && fs.statSync(fileName).size > 0) {
                return fileName;
            }
        } catch (error) {
            lastError = error;
            console.warn('[Utilitário de Vídeo] Tentativa de formato falhou:', error.stderr || error.message);
            try { if (fs.existsSync(fileName)) fs.unlinkSync(fileName); } catch {}
        }
    }

    const detail = lastError?.stderr || lastError?.message || 'formato indisponível';
    throw new Error(`Não foi possível baixar este vídeo em MP4: ${detail}`);
}
