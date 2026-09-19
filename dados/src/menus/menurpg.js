export default async function menurpg(prefix, botName = "MeuBot", userName = "Usuário", {
    header = `╭┈⊰ ⚔️ 『 *MODO RPG* 』\n┊Olá, #user#!\n╰─┈┈┈┈┈◜⚔️◞┈┈┈┈┈─╯`,
    menuTopBorder = "╭┈",
    bottomBorder = "╰─┈┈┈┈┈◜⚔️◞┈┈┈┈┈─╯",
    menuTitleIcon = "⚔️ฺꕸ▸",
    menuItemIcon = "•.̇𖥨֗✨⭟",
    separatorIcon = "⚔️",
    middleBorder = "┊",
    profileMenuTitle = "👤 PERFIL & STATUS",
    economyMenuTitle = "💰 ECONOMIA & FINANÇAS",
    activitiesMenuTitle = "🎯 ATIVIDADES DIÁRIAS",
    adventureMenuTitle = "🗺️ AVENTURA & EXPLORAÇÃO",
    combatMenuTitle = "⚔️ COMBATE & BATALHAS",
    craftingMenuTitle = "🔨 CRAFTING & EQUIPAMENTOS",
    socialMenuTitle = "💝 SOCIAL & INTERAÇÕES",
    familyMenuTitle = "👨‍👩‍👧‍👦 FAMÍLIA & ADOÇÃO",
    guildMenuTitle = "🏰 CLÃ & COMUNIDADE",
    questMenuTitle = "📜 MISSÕES & CONQUISTAS",
    petsMenuTitle = "🐾 PETS & COMPANHEIROS",
    reputationMenuTitle = "⭐ REPUTAÇÃO & FAMA",
    investmentMenuTitle = "📈 INVESTIMENTOS & BOLSA",
    gamblingMenuTitle = "🎰 CASSINO & APOSTAS",
    evolutionMenuTitle = "🌟 EVOLUÇÃO & PRESTIGE",
    eventsMenuTitle = "🎉 EVENTOS",
    premiumMenuTitle = "💎 LOJA PREMIUM",
    adminMenuTitle = "🔧 ADMIN RPG (DONO)"
} = {}) {
  const h = header.replace(/#user#/g, userName);
    return `‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
${h} 

${menuTopBorder}${separatorIcon} *${profileMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}perfilrpg
${middleBorder}${menuItemIcon}${prefix}carteira
${middleBorder}${menuItemIcon}${prefix}toprpg
${middleBorder}${menuItemIcon}${prefix}ranklevel
${middleBorder}${menuItemIcon}${prefix}inventario
${middleBorder}${menuItemIcon}${prefix}equipamentos
${bottomBorder}

${menuTopBorder}${separatorIcon} *${evolutionMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}evoluir
${middleBorder}${menuItemIcon}${prefix}streak
${middleBorder}${menuItemIcon}${prefix}reivindicar
${bottomBorder}

${menuTopBorder}${separatorIcon} *${economyMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}depositar <valor|all>
${middleBorder}${menuItemIcon}${prefix}sacar <valor|all>
${middleBorder}${menuItemIcon}${prefix}transferir @user <valor>
${middleBorder}${menuItemIcon}${prefix}pix @user <valor>
${middleBorder}${menuItemIcon}${prefix}vagas
${middleBorder}${menuItemIcon}${prefix}emprego <vaga>
${middleBorder}${menuItemIcon}${prefix}demitir
${bottomBorder}

${menuTopBorder}${separatorIcon} *${investmentMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}investir
${middleBorder}${menuItemIcon}${prefix}investir <ação> <qtd>
${middleBorder}${menuItemIcon}${prefix}vender <ação> <qtd>
${bottomBorder}

${menuTopBorder}${separatorIcon} *${gamblingMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}dados <valor>
${middleBorder}${menuItemIcon}${prefix}coinflip <cara|coroa> <valor>
${middleBorder}${menuItemIcon}${prefix}crash <valor>
${middleBorder}${menuItemIcon}${prefix}slots <valor>
${bottomBorder}

${menuTopBorder}${separatorIcon} *${activitiesMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}diario
${middleBorder}${menuItemIcon}${prefix}trabalhar
${middleBorder}${menuItemIcon}${prefix}minerar
${middleBorder}${menuItemIcon}${prefix}pescar
${middleBorder}${menuItemIcon}${prefix}caçar
${middleBorder}${menuItemIcon}${prefix}cozinhar <receita>
${bottomBorder}

${menuTopBorder}${separatorIcon} *${adventureMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}explorar
${middleBorder}${menuItemIcon}${prefix}masmorra
${middleBorder}${menuItemIcon}${prefix}chefe
${bottomBorder}

${menuTopBorder}${separatorIcon} *🏰 DUNGEONS & RAIDS*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}dungeon - Listar dungeons
${middleBorder}${menuItemIcon}${prefix}dungeon criar <tipo>
${middleBorder}${menuItemIcon}${prefix}dungeon entrar <id>
${middleBorder}${menuItemIcon}${prefix}dungeon iniciar
${middleBorder}${menuItemIcon}${prefix}dungeon sair
${bottomBorder}

${menuTopBorder}${separatorIcon} *⚔️ CLASSES & PROFISSÕES*
${middleBorder}
${bottomBorder}

${menuTopBorder}${separatorIcon} *🏠 HOUSING*
${middleBorder}
${bottomBorder}

${menuTopBorder}${separatorIcon} *🛒 MERCADO DE JOGADORES*
${middleBorder}
${bottomBorder}

${menuTopBorder}${separatorIcon} *${combatMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}duelar @user
${middleBorder}${menuItemIcon}${prefix}arena
${middleBorder}${menuItemIcon}${prefix}torneio
${middleBorder}${menuItemIcon}${prefix}assaltar @user
${middleBorder}${menuItemIcon}${prefix}crime
${bottomBorder}

${menuTopBorder}${separatorIcon} *${craftingMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}forjar <item>
${middleBorder}${menuItemIcon}${prefix}encantar
${middleBorder}${menuItemIcon}${prefix}desmontar <item>
${middleBorder}${menuItemIcon}${prefix}materiais
${bottomBorder}

${menuTopBorder}${separatorIcon} *${socialMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}casar @user
${middleBorder}${menuItemIcon}${prefix}namorar @user
${middleBorder}${menuItemIcon}${prefix}terminar
${middleBorder}${menuItemIcon}${prefix}relacionamento
${middleBorder}${menuItemIcon}${prefix}abracar @user
${middleBorder}${menuItemIcon}${prefix}beijar @user
${middleBorder}${menuItemIcon}${prefix}bater @user
${middleBorder}${menuItemIcon}${prefix}proteger @user
${bottomBorder}

${menuTopBorder}${separatorIcon} *${familyMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}familia
${middleBorder}${menuItemIcon}${prefix}adotaruser @user
${middleBorder}${menuItemIcon}${prefix}arvore
${bottomBorder}

${menuTopBorder}${separatorIcon} *${guildMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}criarcla <nome>
${middleBorder}${menuItemIcon}${prefix}cla
${middleBorder}${menuItemIcon}${prefix}convidar @user
${middleBorder}${menuItemIcon}${prefix}sair
${middleBorder}${menuItemIcon}${prefix}aceitarconvite <clanId|nome>
${middleBorder}${menuItemIcon}${prefix}recusarconvite <clanId|nome>
${middleBorder}${menuItemIcon}${prefix}expulsar @user
${middleBorder}${menuItemIcon}${prefix}rmconvite @user
${bottomBorder}

${menuTopBorder}${separatorIcon} *${questMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}missoes
${bottomBorder}

${menuTopBorder}${separatorIcon} *${petsMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}pets
${middleBorder}${menuItemIcon}${prefix}adotar <pet>
${middleBorder}${menuItemIcon}${prefix}alimentar <nº>
${middleBorder}${menuItemIcon}${prefix}treinar <nº>
${middleBorder}${menuItemIcon}${prefix}evoluir <nº>
${middleBorder}${menuItemIcon}${prefix}batalha <nº>
${middleBorder}${menuItemIcon}${prefix}renomearpet <nº> <nome>
${bottomBorder}

${menuTopBorder}${separatorIcon} *${reputationMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}reputacao
${middleBorder}${menuItemIcon}${prefix}votar @user
${bottomBorder}

${menuTopBorder}${separatorIcon} *${eventsMenuTitle}*
${middleBorder}
${bottomBorder}

${menuTopBorder}${separatorIcon} *${premiumMenuTitle}*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}propriedades
${middleBorder}${menuItemIcon}${prefix}comprarpropriedade <id>
${middleBorder}${menuItemIcon}${prefix}coletarpropriedades
${bottomBorder}

${menuTopBorder}${separatorIcon} *${adminMenuTitle}*
${middleBorder}
${bottomBorder}

${menuTopBorder}${separatorIcon} *💎 SISTEMA DE PROGRESSO DIÁRIO*
${middleBorder}
${middleBorder}${menuItemIcon}${prefix}diario
${middleBorder}${menuItemIcon}${prefix}streak 
${middleBorder}${menuItemIcon}${prefix}reivindicar
${middleBorder}${menuItemIcon}${prefix}missoes
${middleBorder}${menuItemIcon}${prefix}investir
${middleBorder}${menuItemIcon}${prefix}torneio
${middleBorder}${menuItemIcon}${prefix}evoluir
${middleBorder}${menuItemIcon}${prefix}toprpg
${middleBorder}${menuItemIcon}${prefix}ranklevel
${bottomBorder}`
}