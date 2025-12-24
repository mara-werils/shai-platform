const translation = {
  common: {
    welcome: '',
    appUnavailable: 'Қосымша қолжетімсіз',
    appUnknownError: 'ҚОсымшаға кіру мүмкін емес',
  },
  chat: {
    newChat: 'Жаңа чат',
    pinnedTitle: 'Бекітілгендер',
    unpinnedTitle: 'Чаттар',
    newChatDefaultName: 'Жаңа әңгіме',
    resetChat: 'Әңгімені қалпына келтіру',
    poweredBy: 'Қуат көзі',
    prompt: 'Нұсқау',
    privatePromptConfigTitle: 'Чат параметрлері',
    publicPromptConfigTitle: 'Бастапқы сұрау',
    configStatusDes: 'Бастамас бұрын, чат параметрлерін өзгерте аласыз',
    configDisabled:
      'Бұл сеанста алдыңғы сеанстың параметрлері қолданылады.',
    startChat: 'Чатты бастау',
    privacyPolicyLeft: 'Өтінеміз, танысып шығыңыз ',
    privacyPolicyMiddle: 'құпиялылық саясатымен',
    privacyPolicyRight: ', қосымша жасаушысы ұсынған.',
    deleteConversation: {
      title: 'Сөйлесуді жою',
      content: 'Бұл сөйлесуді жойғыңыз келетініне сенімдісіз бе?',
    },
    tryToSolve: 'Шешуге тырысу',
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
      create: 'Бір реттік іске қосу',
      batch: 'Топтық іске қосу',
      saved: 'Сақталғандар',
    },
    savedNoData: {
      title: 'Сіз әлі ешқандай нәтижені сақтамадыңыз!',
      description:
        'Мазмұнды генерациялауды бастаңыз — сақталған нәтижелер осында көрсетіледі.',
      startCreateContent: 'Мазмұн жасауды бастау',
    },
    title: 'ЖИ аяқтауы',
    queryTitle: 'Сұрау мазмұны',
    completionResult: 'Нәтиже',
    queryPlaceholder: 'Сұрауыңыздың мазмұнын жазыңыз...',
    run: 'Іске қосу',
    copy: 'Көшіру',
    resultTitle: 'ЖИ нәтижесі',
    noData: 'ЖИ мұнда сізге қажет нәтижені ұсынады.',
    csvUploadTitle: 'CSV файлын осында сүйреп әкеліңіз немесе ',
    browse: 'шолу',
    csvStructureTitle: 'CSV файлы келесі құрылымға сай болуы керек:',
    downloadTemplate: 'Үлгіні осында жүктеу',
    field: 'Өріс',
    batchFailed: {
      info: '{{num}} сәтсіз орындалды',
      retry: 'Қайта көру',
      outputPlaceholder: 'Шығыс мазмұны жоқ',
    },
    errorMsg: {
      empty: 'Жүктелген файлда мазмұн жоқ. Өтінеміз, толтырыңыз.',
      fileStructNotMatch: 'Жүктелген CSV құрылымға сай емес.',
      emptyLine: '{{rowIndex}} жолы бос',
      invalidLine:
        '{{rowIndex}} жолында: {{varName}} мәні бос болмауы керек',
      moreThanMaxLengthLine:
        '{{rowIndex}} жолында: {{varName}} мәні {{maxLength}} таңбадан аспауы тиіс',
      atLeastOne: 'Файлда кемінде бір жол болуы керек.',
    },
    execution: 'ОРЫНДАУ',
    executions: '{{num}} ОРЫНДАУ',
  },
  login: {
    backToHome: 'Басты бетке оралу',
  },
}

export default translation
