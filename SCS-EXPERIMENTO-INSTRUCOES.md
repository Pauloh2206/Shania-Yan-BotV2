# Experimento SCS — ativação automática

Esta atualização acrescenta a case `scs` e aplica o patch experimental do WAProto automaticamente quando o bot inicia pelo fluxo normal (`npm start` ou `npm run dev`). O patch é executado por `start.js` antes de iniciar `connect.js`, portanto antes de carregar o Baileys. Não é necessário executar `scs-wa-proto-patch.mjs --apply` manualmente.

## Arquivos e caminhos

- `dados/src/index.js`: case `scs`; as outras cases foram mantidas.
- `dados/src/.scripts/start.js`: executa o patcher automaticamente antes de iniciar o processo do bot.
- `scs-wa-proto-patch.mjs`: patch reversível do Baileys 6.7.24. Fica na pasta principal do projeto, ao lado de `package.json`.

## Instalação

1. Pare o bot e faça cópias dos seus arquivos atuais `dados/src/index.js` e `dados/src/.scripts/start.js`.
2. Coloque os arquivos atualizados nos mesmos caminhos indicados acima e o `scs-wa-proto-patch.mjs` na pasta principal.
3. Inicie o bot normalmente com `npm start` (ou `npm run dev`). O terminal deve mostrar que o patch SCS foi preparado antes do Baileys. Se houver erro no patch, o bot continua iniciando; somente `scs` ficará indisponível.
4. Responda a um vídeo que tenha áudio com `scs`. O teste aceita vídeos de até 25 MB e usa os primeiros 10 segundos. Ele gera WebP animado 512×512 e áudio Opus mono, e tenta enviar ambos dentro de uma única mensagem.

O FFmpeg do Termux precisa incluir os encoders `libwebp` e `libopus`, e o comando `ffprobe` precisa estar disponível. Se o vídeo não tiver áudio, o comando avisará e não enviará a figurinha.

## Verificar ou reverter

Para conferir o estado do patch, use na pasta principal:

```sh
node scs-wa-proto-patch.mjs --status
```

Para reverter completamente, pare o bot, restaure suas cópias originais de `dados/src/index.js` e `dados/src/.scripts/start.js`, e então execute:

```sh
node scs-wa-proto-patch.mjs --restore
```

A restauração do código de `start.js` impede que o patch seja reaplicado na próxima inicialização. Como alternativa temporária, defina `SCS_DISABLE_PROTO_PATCH=1` no ambiente do bot antes de iniciá-lo.

## Limites conhecidos

A mensagem é experimental e baseada em captura/engenharia reversa; não há garantia de que o servidor ou o cliente WhatsApp aceite ou exiba o formato. A validação local confirmou a serialização do caminho protobuf observado e a preparação WebP/Opus, mas ainda é necessário testar com uma conta WhatsApp real. O patch habilita somente codificação e conversão de objetos; não altera a decodificação de figurinha sonora recebida.
