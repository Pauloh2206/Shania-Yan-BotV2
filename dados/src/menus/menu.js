export default async function menu(prefix = '.', botName = 'Shania Yan', userName = 'Usuário') {
  return `🌸 *${botName.toUpperCase()}*

╭─ *MENU PRINCIPAL*
│
│ 🎮 Diversão
│    ${prefix}menubn
│
│ 🧰 Utilidades
│    ${prefix}ferramentas
│
│ 🎵 Downloads
│    ${prefix}menudown
│
│ 🤖 Inteligência
│    ${prefix}menuia
│
│ 🖼️ Figurinhas
│    ${prefix}menufig
│
│ 👥 Grupos
│    ${prefix}menumemb
│
│ ⚔️ RPG
│    ${prefix}menurpg
│
│ 💎 VIP
│    ${prefix}menuvip
│
│ 👑 Dono
│    ${prefix}menudono
╰──────────────

_Use ${prefix}menu + categoria_`;
}
