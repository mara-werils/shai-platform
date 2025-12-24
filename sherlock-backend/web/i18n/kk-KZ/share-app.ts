const translation = {
  common: {
    welcome: '',
    appUnavailable: 'Қосымша қолжетімсіз',
    appUnknownError: 'Қосымшаға кіру мүмкін емес',
  },
  chat: {
    newChat: 'Жаңа чат',
    pinnedTitle: 'Бекітілгендер',
    unpinnedTitle: 'Чаттар',
    newChatDefaultName: 'Жаңа әңгіме',
    resetChat: 'Сөйлесуді тазалау',
    poweredBy: 'Қуаттандырылған:',
    prompt: 'Сұрау үлгісі',
    privatePromptConfigTitle: 'Чат параметрлері',
    publicPromptConfigTitle: 'Бастапқы сұрау',
    configStatusDes: 'Бастамас бұрын чат параметрлерін өзгерте аласыз',
    configDisabled:
      'Бұл сеанста алдыңғы сеанстың параметрлері қолданылады.',
    startChat: 'Чатты бастау',
    privacyPolicyLeft: 'Өтінеміз, танысып шығыңыз ',
    privacyPolicyMiddle: 'құпиялылық саясатымен',
    privacyPolicyRight: ', қосымша әзірлеушісі ұсынған.',
    deleteConversation: {
      title: 'Сөйлесуді жою',
      content: 'Бұл сөйлесуді жойғыңыз келетініне сенімдісіз бе?',
    },
    tryToSolve: 'Мәселені шешуге тырысыңыз',
    temporarySystemIssue: 'Кешіріңіз, жүйеде уақытша ақау бар.',
    expand: 'Кеңейту',
    collapse: 'Жасыру',
    viewChatSettings: 'Чат параметрлерін көру',
    chatSettingsTitle: 'Жаңа чат параметрлері',
    newChatTip: 'Сіз қазір жаңа чаттасыз',
    chatFormTip: 'Чат басталғаннан кейін параметрлерді өзгерту мүмкін емес.',
  },
  generation: {
    tabs: {
      create: 'Бір реттік орындау',
      batch: 'Топтық орындау',
      saved: 'Сақталғандар',
    },
    savedNoData: {
      title: 'Әзірге ешқандай нәтиже сақталмаған!',
      description:
        'Мазмұн генерациялауды бастаңыз — сақталған нәтижелер осы жерде көрсетіледі.',
      startCreateContent: 'Мазмұн жасауды бастау',
    },
    title: 'ЖИ нәтижесі',
    queryTitle: 'Сұрау мазмұны',
    completionResult: 'Нәтиже',
    queryPlaceholder: 'Сұрауыңыздың мазмұнын жазыңыз...',
    run: 'Іске қосу',
    copy: 'Көшіру',
    resultTitle: 'ЖИ нәтижесі',
    noData: 'ЖИ сізге қажетті жауапты осында ұсынады.',
    csvUploadTitle: 'CSV файлын осында сүйреп әкеліңіз немесе ',
    browse: 'шолу',
    csvStructureTitle: 'CSV файлы келесі құрылымға сай болуы керек:',
    downloadTemplate: 'Үлгіні осында жүктеңіз',
    field: 'Өріс',
    batchFailed: {
      info: '{{num}} орындалу сәтсіз аяқталды',
      retry: 'Қайта көру',
      outputPlaceholder: 'Шығыс мазмұны жоқ',
    },
    errorMsg: {
      empty: 'Жүктелген файлға мазмұн енгізіңіз.',
      fileStructNotMatch: 'Жүктелген CSV құрылымға сәйкес келмейді.',
      emptyLine: '{{rowIndex}} жолы бос',
      invalidLine:
        '{{rowIndex}} жолында: {{varName}} мәні бос болмауы керек',
      moreThanMaxLengthLine:
        '{{rowIndex}} жолында: {{varName}} мәні {{maxLength}} таңбадан аспауы тиіс',
      atLeastOne: 'Файлда кемінде бір жол болуы керек.',
    },
    execution: 'ОРЫНДАУ',
    executions: '{{num}} ОРЫНДАЛУ',
  },
}

export default translation
