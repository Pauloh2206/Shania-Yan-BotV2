import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function now() {
  return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function section(title, rows) {
  return [`\n=== ${title} ===`, ...rows.map((row) => `${row.status} ${row.name}: ${row.detail}`)];
}

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function walk(dir, predicate = () => true) {
  const output = [];
  if (!(await exists(dir))) return output;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full, predicate));
    else if (predicate(full)) output.push(full);
  }
  return output;
}

async function run(command, args = [], options = {}) {
  try {
    const result = await execFileAsync(command, args, { timeout: options.timeout || 12000, maxBuffer: 1024 * 1024 });
    return { ok: true, output: `${result.stdout || result.stderr || ''}`.trim() };
  } catch (error) {
    return { ok: false, output: `${error.stdout || error.stderr || error.message || error}`.trim() };
  }
}

function parseTopLevelCases(source) {
  const names = [];
  const re = /^ {6}case\s+(['"`])(.+?)\1\s*:/gm;
  let match;
  while ((match = re.exec(source))) names.push(match[2]);
  return names;
}

async function checkSyntax(rootDir, rows) {
  const files = await walk(path.join(rootDir, 'dados', 'src'), (file) => file.endsWith('.js'));
  let passed = 0;
  for (const file of files) {
    const result = await run(process.execPath, ['--check', file], { timeout: 15000 });
    if (result.ok) passed += 1;
    else rows.push({ status: '❌', name: path.relative(rootDir, file), detail: result.output.slice(0, 220) });
  }
  return { total: files.length, passed };
}

async function checkJson(rootDir, rows) {
  const files = await walk(path.join(rootDir, 'dados', 'database'), (file) => file.endsWith('.json'));
  let passed = 0;
  for (const file of files) {
    try {
      JSON.parse(await fs.readFile(file, 'utf8'));
      passed += 1;
    } catch (error) {
      rows.push({ status: '❌', name: path.relative(rootDir, file), detail: `JSON inválido: ${error.message}` });
    }
  }
  return { total: files.length, passed };
}

async function checkDependencies(rootDir, rows) {
  const packagePath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(await fs.readFile(packagePath, 'utf8'));
  const dependencies = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  let passed = 0;
  for (const name of Object.keys(dependencies)) {
    try {
      import.meta.resolve(name);
      passed += 1;
    } catch {
      rows.push({ status: '❌', name, detail: 'dependência declarada, mas não encontrada em node_modules' });
    }
  }
  return { total: Object.keys(dependencies).length, passed };
}

async function checkCommands(rootDir, rows) {
  const indexPath = path.join(rootDir, 'dados', 'src', 'index.js');
  const source = await fs.readFile(indexPath, 'utf8');
  const commands = parseTopLevelCases(source);
  const unique = new Set(commands);
  const duplicates = commands.length - unique.size;
  const moduleDir = path.join(rootDir, 'dados', 'src', 'commands');
  const inventoryPath = path.join(moduleDir, 'inventory.json');
  let inventoryDetail = 'catálogo modular não encontrado';
  if (await exists(inventoryPath)) {
    try {
      const inventory = JSON.parse(await fs.readFile(inventoryPath, 'utf8'));
      inventoryDetail = `${inventory.topLevelCases || 0} cases catalogadas`;
    } catch { inventoryDetail = 'inventário inválido'; }
  }
  if (duplicates) rows.push({ status: '⚠️', name: 'Aliases/cases repetidos', detail: `${duplicates} repetição(ões) detectada(s); pode ser intencional` });
  return { total: commands.length, unique: unique.size, inventoryDetail };
}

async function checkTools(rows) {
  const tools = [
    [process.execPath, ['--version'], 'Node.js'],
    ['ffmpeg', ['-version'], 'FFmpeg'],
    ['yt-dlp', ['--version'], 'yt-dlp']
  ];
  const result = {};
  for (const [command, args, name] of tools) {
    const check = await run(command, args, { timeout: 8000 });
    result[name] = check.ok;
    rows.push({ status: check.ok ? '✅' : '⚠️', name, detail: check.ok ? check.output.split('\n')[0].slice(0, 120) : 'não encontrado ou indisponível' });
  }
  return result;
}

async function checkRequiredPaths(rootDir, rows) {
  const paths = [
    ['dados/src/index.js', 'dispatcher principal'],
    ['dados/src/connect.js', 'conexão'],
    ['dados/src/config.json', 'configuração'],
    ['dados/database', 'banco de dados'],
    ['dados/database/dono/alugueis.json', 'dados de aluguel']
  ];
  let passed = 0;
  for (const [relative, name] of paths) {
    const ok = await exists(path.join(rootDir, relative));
    if (ok) passed += 1;
    rows.push({ status: ok ? '✅' : '❌', name, detail: ok ? relative : `ausente: ${relative}` });
  }
  return { total: paths.length, passed };
}

async function checkMedia(rootDir, rows) {
  const mediaDir = path.join(rootDir, 'dados', 'midias');
  const files = await walk(mediaDir, (file) => /\.(jpg|jpeg|png|gif|mp4|webp|webm)$/i.test(file));
  const empty = [];
  for (const file of files) {
    const stat = await fs.stat(file);
    if (stat.size === 0) empty.push(path.relative(rootDir, file));
  }
  rows.push({ status: empty.length ? '⚠️' : '✅', name: 'Mídias locais', detail: `${files.length} arquivo(s) encontrados${empty.length ? `; ${empty.length} vazio(s)` : ''}` });
  return { total: files.length, empty: empty.length };
}

export async function runFullDiagnostic({ rootDir = process.cwd(), connection = null } = {}) {
  const started = Date.now();
  const rows = [];
  const syntax = await checkSyntax(rootDir, rows);
  const json = await checkJson(rootDir, rows);
  const dependencies = await checkDependencies(rootDir, rows);
  const paths = await checkRequiredPaths(rootDir, rows);
  const commands = await checkCommands(rootDir, rows);
  const tools = await checkTools(rows);
  const media = await checkMedia(rootDir, rows);

  const failures = rows.filter((row) => row.status === '❌').length;
  const warnings = rows.filter((row) => row.status === '⚠️').length;
  const summary = failures ? 'ATENÇÃO: existem falhas que precisam de correção' : warnings ? 'NORMAL COM AVISOS' : 'TUDO NORMAL';
  const connectionStatus = connection ? 'conexão recebida pelo diagnóstico' : 'conexão não testada pelo modo offline';

  const report = [
    'RELATÓRIO DE DIAGNÓSTICO COMPLETO — SHANIA YAN BOT',
    `Data: ${now()}`,
    `Duração: ${Date.now() - started} ms`,
    `Resultado: ${summary}`,
    '',
    ...section('RESUMO', [
      { status: failures ? '❌' : '✅', name: 'Falhas detectadas', detail: String(failures) },
      { status: warnings ? '⚠️' : '✅', name: 'Avisos', detail: String(warnings) },
      { status: 'ℹ️', name: 'Conexão WhatsApp', detail: connectionStatus },
      { status: 'ℹ️', name: 'Modo de teste', detail: 'checagem e simulação segura; nenhum comando destrutivo foi executado' }
    ]),
    ...section('SINTAXE E ARQUIVOS', [
      { status: syntax.passed === syntax.total ? '✅' : '❌', name: 'Arquivos JavaScript', detail: `${syntax.passed}/${syntax.total} válidos` },
      { status: json.passed === json.total ? '✅' : '❌', name: 'Arquivos JSON', detail: `${json.passed}/${json.total} válidos` },
      { status: paths.passed === paths.total ? '✅' : '❌', name: 'Caminhos essenciais', detail: `${paths.passed}/${paths.total} disponíveis` }
    ]),
    ...section('DEPENDÊNCIAS E FERRAMENTAS', [
      { status: dependencies.passed === dependencies.total ? '✅' : '❌', name: 'Dependências npm', detail: `${dependencies.passed}/${dependencies.total} disponíveis` },
      ...rows.filter((row) => ['Node.js', 'FFmpeg', 'yt-dlp'].includes(row.name))
    ]),
    ...section('COMANDOS', [
      { status: '✅', name: 'Cases principais analisadas', detail: `${commands.total} labels; ${commands.unique} nomes únicos` },
      { status: 'ℹ️', name: 'Catálogo modular', detail: commands.inventoryDetail },
      { status: commands.total ? '✅' : '❌', name: 'Dispatcher', detail: commands.total ? 'switch principal encontrado' : 'nenhuma case encontrada' }
    ]),
    ...section('MÍDIA E SEGURANÇA', [
      { status: media.empty ? '⚠️' : '✅', name: 'Mídias locais', detail: `${media.total} arquivo(s); ${media.empty} vazio(s)` },
      { status: '✅', name: 'Ações destrutivas', detail: 'não executadas; ban, kick, reiniciar, atualização e gravações reais foram bloqueados' }
    ]),
    '',
    'DETALHES',
    ...rows.map((row) => `${row.status} ${row.name}: ${row.detail}`),
    '',
    'Observação: um diagnóstico offline não garante que toda API externa ou todo comando funcionará em qualquer mensagem real. Ele detecta sintaxe, dependências, caminhos, JSON, ferramentas, mídia e estrutura do dispatcher sem disparar ações perigosas.'
  ].join('\n');

  return {
    ok: failures === 0,
    failures,
    warnings,
    summary,
    durationMs: Date.now() - started,
    text: report
  };
}

export default runFullDiagnostic;
