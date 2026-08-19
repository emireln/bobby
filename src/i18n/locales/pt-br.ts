import type en from './en'

/**
 * Idioma Português do Brasil (PT-BR).
 * Tipado como `typeof en` para garantir cobertura estrita de todas as chaves.
 */
const ptBr: typeof en = {
  app: {
    name: 'bobby',
    title: 'bobby — avatar SVG animado',
    botAria: 'Avatar bobby animado'
  },

  gallery: {
    back: 'Voltar ao reprodutor'
  },

  rail: {
    nav: 'Seções',
    customize: 'Personalizar',
    animations: 'Animações',
    settings: 'Configurações'
  },

  panel: {
    animations: 'Animações',
    shape: 'Forma',
    expression: 'Expressão',
    color: 'Cor',
    randomize: 'Aleatório',
    bubble: 'Balão de fala',
    bubble_placeholder: 'Diga algo...',
    bubble_clear: 'Limpar balão'
  },

  export: {
    action: 'Exportar como PNG',
    more: 'Outros formatos',
    png: 'Baixar PNG',
    svg: 'Baixar SVG',
    anime: 'Baixar SVG animado',
    gif: 'Baixar GIF animado',
    cycleDetail: 'O vídeo é mais leve e fluido; o GIF roda em qualquer lugar.',
    cycleFormat: 'Formato',
    cycle_mp4: 'Vídeo MP4',
    cycle_mp4_aide: 'Leve e fluido, precisa de fundo',
    cycle_gif: 'GIF animado',
    cycle_gif_aide: 'Funciona em qualquer lugar, mais pesado',
    cycleProgress: 'Exportando…',
    cycleReessayer: 'Tentar novamente',
    gifTitle: 'Baixar GIF animado',
    gifDetail:
      'A transparência no GIF é tudo ou nada: sem fundo, a borda do avatar fica um pouco serrilhada.',
    gifBackground: 'Fundo',
    fond_blanc: 'Fundo branco',
    fond_blanc_aide: 'Borda suave, para superfícies claras',
    fond_transparent: 'Fundo transparente',
    fond_transparent_aide: 'Combina com qualquer fundo, borda um pouco dura',
    gifConfirm: 'Baixar',
    copie: 'Copiar imagem',
    copieSvg: 'Copiar SVG',
    done: 'Exportado',
    copied: 'Copiado',
    failed: 'Falha ao exportar'
  },

  preview: {
    exit: 'Sair da pré-visualização',
    key: 'Esc'
  },

  timeline: {
    play: 'Iniciar reprodução',
    pause: 'Pausar reprodução',
    addAnimation: 'Adicionar uma animação',
    preview: 'Pré-visualizar',
    export: 'Exportar montagem',
    zoom: 'Zoom da trilha',
    blockAria: '{state}, {duration}',
    blockDurationAria: 'Duração de {state}, {duration}',
    blockRemoveAria: 'Remover {state}'
  },

  dialog: {
    cancel: 'Cancelar',
    nameCreateTitle: 'Novo ciclo',
    nameRenameTitle: 'Renomear ciclo',
    nameField: 'Nome do ciclo',
    nameCreate: 'Criar',
    nameRename: 'Renomear',
    removeTitle: 'Excluir "{name}"?',
    removeDetail:
      'Esta sequência será perdida, junto com sua animação. | Esta sequência será perdida, junto com suas {n} animações.',
    removeConfirm: 'Excluir'
  },

  cycles: {
    defaultName: 'Ciclo padrão',
    newName: 'Meu ciclo',
    menuNew: 'Novo ciclo',
    menuRenameAria: 'Renomear {name}',
    menuRemoveAria: 'Excluir {name}'
  },

  units: {
    seconds: '{n} s',
    secondsShort: '{n}s'
  },

  settings: {
    title: 'Configurações',
    language: 'Idioma',
    theme: 'Tema',
    theme_light: 'Claro',
    theme_dark: 'Escuro',
    theme_system: 'Sistema',
    about: 'Sobre',
    credits: 'Feito com ❤️ por {name}',
    creditsAria: 'Emir Lima Neto no GitHub, em uma nova aba',
    github: 'Ver o projeto no GitHub',
    githubAria: 'Repositório do projeto no GitHub, em uma nova aba',
    support: 'Apoie o projeto'
  },

  states: {
    idle: 'Repouso',
    thinking: 'Pensando',
    wink: 'Piscada',
    wide: 'Olhos abertos',
    alert: 'Alerta',
    notify: 'Notificação',
    exclaim: 'Exclamação',
    sleep: 'Dormindo',
    egg: 'Ovo',
    hexagon: 'Hexágono',
    play: 'Play',
    orbit: 'Órbita',
    burst: 'Explosão',
    comet: 'Cometa',
    swirl: 'Giro',
    bounce: 'Pulo',
    pulse: 'Pulso',
    spin: 'Rodopio',
    wave: 'Onda'
  },

  shapes: {
    cercle: 'Círculo',
    galet: 'Seixo',
    squircle: 'Squircle',
    capsule: 'Cápsula',
    triangle: 'Triângulo',
    hexagone: 'Hexágono',
    nuage: 'Nuvem',
    goutte: 'Gota',
    diamant: 'Diamante',
    coeur: 'Coração',
    etoile: 'Estrela',
    poire: 'Pera',
    cacahuete: 'Amendoim',
    fleur: 'Flor',
    bouclier: 'Escudo',
    octogone: 'Octógono'
  },

  colors: {
    encre: 'Nanquim',
    creme: 'Creme',
    brun: 'Marrom',
    rouge: 'Vermelho',
    orange: 'Laranja',
    ambre: 'Âmbar',
    vert: 'Verde',
    turquoise: 'Turquesa',
    bleu: 'Azul',
    violet: 'Roxo',
    rose: 'Rosa',
    gris: 'Cinza',
    menthe: 'Menta',
    corail: 'Coral',
    peche: 'Pêssego',
    lavande: 'Lavanda',
    lime: 'Lima',
    ciel: 'Celeste',
    bordeaux: 'Bordô',
    or: 'Dourado',
    sable: 'Areia',
    indigo: 'Índigo',
    prune: 'Ameixa',
    charbon: 'Carvão'
  },

  expressions: {
    neutre: 'Neutro',
    attentif: 'Atento',
    surpris: 'Surpreso',
    excite: 'Animado',
    heureux: 'Feliz',
    hilare: 'Rindo',
    colere: 'Bravo',
    triste: 'Triste',
    effraye: 'Assustado',
    mefiant: 'Desconfiado',
    confus: 'Confuso',
    curieux: 'Curioso',
    fier: 'Orgulhoso',
    timide: 'Tímido',
    blase: 'Blasé',
    somnolent: 'Sonolento',
    malicieux: 'Malicioso',
    zen: 'Zen',
    etoile: 'Deslumbrado',
    amoureux: 'Apaixonado',
    choque: 'Chocado',
    doute: 'Cético',
    reveur: 'Sonhador',
    determine: 'Determinado'
  }
}

export default ptBr
