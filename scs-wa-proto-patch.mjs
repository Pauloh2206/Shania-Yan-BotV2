#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const expectedVersion = '6.7.24';
const protoMarker = '// SCS_NATIVE_SOUND_STICKER_RUNTIME_BEGIN';
const mediaMarker = '// SCS_NATIVE_SOUND_STICKER_MEDIA_TYPE';
const args = new Set(process.argv.slice(2));
const action = args.has('--restore') ? 'restore' : args.has('--status') ? 'status' : args.has('--apply') ? 'apply' : null;

if (!action || [...args].some(arg => !['--apply', '--restore', '--status'].includes(arg))) {
  console.error('Uso: node scs-wa-proto-patch.mjs --apply | --restore | --status');
  process.exit(2);
}

const packageRoot = process.env.SCS_BAILEYS_ROOT
  ? path.resolve(process.env.SCS_BAILEYS_ROOT)
  : path.resolve(path.dirname(require.resolve('@whiskeysockets/baileys')), '..');
const packageJsonPath = path.join(packageRoot, 'package.json');
const packageInfo = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
if (packageInfo.version !== expectedVersion) {
  throw new Error(`Este patch foi testado somente com @whiskeysockets/baileys ${expectedVersion}; encontrado ${packageInfo.version}. Nenhum arquivo foi alterado.`);
}

const protoPath = path.join(packageRoot, 'WAProto', 'index.js');
const sendPath = path.join(packageRoot, 'lib', 'Socket', 'messages-send.js');
const protoBackup = `${protoPath}.scs-original-${expectedVersion}`;
const sendBackup = `${sendPath}.scs-original-${expectedVersion}`;

if (action === 'status') {
  const [protoText, sendText] = await Promise.all([
    fs.readFile(protoPath, 'utf8'),
    fs.readFile(sendPath, 'utf8')
  ]);
  const applied = protoText.includes(protoMarker) && sendText.includes(mediaMarker);
  console.log(applied ? 'SCS patch aplicado.' : 'SCS patch não aplicado.');
  console.log(`Backup WAProto: ${await exists(protoBackup) ? 'presente' : 'ausente'}`);
  console.log(`Backup messages-send: ${await exists(sendBackup) ? 'presente' : 'ausente'}`);
  process.exit(applied ? 0 : 1);
}

if (action === 'restore') {
  if (!(await exists(protoBackup)) || !(await exists(sendBackup))) {
    throw new Error('Backups SCS não encontrados; não foi possível restaurar.');
  }
  await fs.copyFile(protoBackup, protoPath);
  await fs.copyFile(sendBackup, sendPath);
  console.log('WAProto e messages-send.js restaurados dos backups SCS. Reinicie o bot.');
  process.exit(0);
}

const [protoText, sendText] = await Promise.all([
  fs.readFile(protoPath, 'utf8'),
  fs.readFile(sendPath, 'utf8')
]);
const protoApplied = protoText.includes(protoMarker);
const mediaApplied = sendText.includes(mediaMarker);
if (protoApplied && mediaApplied) {
  console.log('SCS patch já estava aplicado. Nenhuma alteração feita.');
  process.exit(0);
}
if (protoApplied !== mediaApplied) {
  throw new Error('Foi detectada aplicação parcial do patch. Use --restore antes de tentar novamente.');
}

const mediaAnchor = 'const getMediaType = (message) => {';
if (sendText.split(mediaAnchor).length !== 2) {
  throw new Error('Não encontrei o ponto esperado de getMediaType; nenhum arquivo foi alterado.');
}

const protoExtension = String.raw`

// SCS_NATIVE_SOUND_STICKER_RUNTIME_BEGIN
// Experimental support only for encoding the reverse-engineered audio-sticker wrapper.
// Decoding unknown fields is intentionally not changed in this experiment.
if (!proto.Message || !proto.Message.StickerMessage || !proto.Message.AudioMessage || !proto.Message.FutureProofMessage) {
  throw new Error('SCS: expected WAProto types were not found');
}
if (!proto.Message.__scsAudioStickerRuntimePatch) {
  const originalMessageFromObject = proto.Message.fromObject;
  proto.Message.fromObject = function scsMessageFromObject(object) {
    if (!object || object.audioStickerMessage == null) {
      return originalMessageFromObject.call(this, object);
    }
    const base = { ...object };
    const wrapper = base.audioStickerMessage;
    delete base.audioStickerMessage;
    const message = originalMessageFromObject.call(this, base);
    message.audioStickerMessage = proto.Message.FutureProofMessage.fromObject(wrapper);
    return message;
  };

  const originalStickerFromObject = proto.Message.StickerMessage.fromObject;
  proto.Message.StickerMessage.fromObject = function scsStickerFromObject(object) {
    if (!object || object.audioMessage == null) {
      return originalStickerFromObject.call(this, object);
    }
    const base = { ...object };
    const audioMessage = base.audioMessage;
    delete base.audioMessage;
    const sticker = originalStickerFromObject.call(this, base);
    sticker.audioMessage = proto.Message.AudioMessage.fromObject(audioMessage);
    return sticker;
  };

  const originalMessageEncode = proto.Message.encode;
  proto.Message.encode = function scsMessageEncode(message, writer) {
    const wrapper = message && message.audioStickerMessage;
    const out = originalMessageEncode.call(this, message, writer);
    if (wrapper != null) {
      proto.Message.FutureProofMessage.encode(wrapper, out.uint32(1074).fork()).ldelim();
    }
    return out;
  };

  const originalStickerEncode = proto.Message.StickerMessage.encode;
  proto.Message.StickerMessage.encode = function scsStickerEncode(message, writer) {
    const audioMessage = message && message.audioMessage;
    const out = originalStickerEncode.call(this, message, writer);
    if (audioMessage != null) {
      proto.Message.AudioMessage.encode(audioMessage, out.uint32(210).fork()).ldelim();
    }
    return out;
  };

  Object.defineProperty(proto.Message, '__scsAudioStickerRuntimePatch', {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false
  });
}
// SCS_NATIVE_SOUND_STICKER_RUNTIME_END
`;

const patchedSendText = sendText.replace(
  mediaAnchor,
  `${mediaAnchor}\n        ${mediaMarker}\n        if (message?.audioStickerMessage?.message?.stickerMessage) return 'sticker';`
);

// Create backups before touching either installed Baileys file.
await backupOnce(protoPath, protoBackup);
await backupOnce(sendPath, sendBackup);
try {
  await fs.writeFile(protoPath, `${protoText}${protoExtension}`, 'utf8');
  await fs.writeFile(sendPath, patchedSendText, 'utf8');
} catch (error) {
  await fs.copyFile(protoBackup, protoPath).catch(() => {});
  await fs.copyFile(sendBackup, sendPath).catch(() => {});
  throw error;
}

console.log(`Patch SCS aplicado em @whiskeysockets/baileys ${expectedVersion}.`);
console.log('Backups .scs-original-6.7.24 criados; reinicie o bot antes do teste.');

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function backupOnce(sourcePath, backupPath) {
  if (!(await exists(backupPath))) {
    await fs.copyFile(sourcePath, backupPath);
  }
}
