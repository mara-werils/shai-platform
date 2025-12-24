const translation = {
  category: {
    extensions: 'Кеңейтулер',
    tools: 'Құралдар',
    models: 'Модельдер',
    all: 'Барлығы',
    bundles: 'Топтамалар',
    agents: 'Агент стратегиялары',
    datasources: 'Дереккөздер',
  },
  categorySingle: {
    bundle: 'Топтама',
    agent: 'Агент стратегиясы',
    model: 'Модель',
    extension: 'Кеңейтім',
    tool: 'Құрал',
    datasource: 'Дереккөзі',
  },
  list: {
    source: {
      github: 'GitHub арқылы орнату',
      marketplace: 'Marketplace арқылы орнату',
      local: 'Жергілікті пакет файлын орнату',
    },
    notFound: 'Плагиндер табылмады',
    noInstalled: 'Орнатылған плагиндер жоқ',
  },
  source: {
    github: 'GitHub сайты',
    marketplace: 'Маркетплейс',
    local: 'Жергілікті пакет файлы',
  },
  detailPanel: {
    categoryTip: {
      github: 'GitHub арқылы орнатылған',
      debugging: 'Жөндеу (debug) плагині',
      local: 'Жергілікті плагин',
      marketplace: 'Marketplace арқылы орнатылған',
    },
    operation: {
      viewDetail: 'Толығырақ көру',
      detail: 'Толық ақпарат',
      info: 'Плагин туралы ақпарат',
      remove: 'Жою',
      install: 'Орнату',
      update: 'Жаңарту',
      checkUpdate: 'Жаңартуды тексеру',
    },
    toolSelector: {
      placeholder: 'Құралды таңдаңыз...',
      auto: 'Автоматты түрде',
      title: 'Құрал қосу',
      uninstalledTitle: 'Құрал орнатылмаған',
      descriptionLabel: 'Құрал сипаттамасы',
      unsupportedTitle: 'Қолдау көрсетілмейтін әрекет',
      settings: 'ПАЙДАЛАНУШЫ БАПТАУЛАРЫ',
      unsupportedContent:
        'Орнатылған плагин нұсқасы бұл әрекетті қолдамайды.',
      empty: 'Құрал қосу үшін «+» батырмасын басыңыз. Бірнеше құрал қосуға болады.',
      uninstalledContent:
        'Бұл плагин жергілікті немесе GitHub репозиторийінен орнатылады. Алдымен орнатып, содан кейін пайдаланыңыз.',
      paramsTip2:
        '«Автоматты түрде» параметрі өшірілген кезде, әдепкі мән пайдаланылады.',
      toolLabel: 'Құрал',
      paramsTip1: 'LLM шығару параметрлерін басқарады.',
      descriptionPlaceholder:
        'Құралдың мақсатын қысқаша сипаттаңыз, мысалы, белгілі бір жердің температурасын алу.',
      params: 'ОЙ ЖҮГІРУ КОНФИГУРАЦИЯСЫ',
      unsupportedContent2: 'Нұсқаны ауыстыру үшін басыңыз.',
      uninstalledLink: 'Плагиндерді басқару',
      toolSetting: 'Құрал параметрлері',
      unsupportedMCPTool:
        'Агент стратегиясы плагинінің ағымдағы нұсқасы MCP құралдарын қолдамайды.',
    },
    configureTool: 'Құралды баптау',
    endpointsTip:
      'Бұл плагин белгілі бір функционалды мүмкіндіктерді API соңғы нүктелері арқылы ұсынады, және сіз ағымдағы жұмыс кеңістігі үшін бірнеше нүкте орната аласыз.',
    endpointDeleteTip: 'Соңғы нүктені жою',
    disabled: 'Белсенді емес',
    serviceOk: 'Қызмет қалыпты',
    configureApp: 'Қосымшаны баптау',
    endpointDeleteContent: '{{name}} нүктесін жойғыңыз келе ме?',
    strategyNum: '{{num}} {{strategy}} ҚОСЫЛҒАН',
    endpoints: 'Соңғы нүктелер',
    modelNum: '{{num}} МОДЕЛЬ ҚАМТЫЛҒАН',
    endpointDisableTip: 'Соңғы нүктені өшіру',
    configureModel: 'Модельді баптау',
    endpointModalDesc:
      'Баптаудан кейін плагиннің API нүктелері арқылы ұсынатын функцияларын пайдалануға болады.',
    endpointModalTitle: 'Соңғы нүктені баптау',
    actionNum: '{{num}} {{action}} ҚОСЫЛҒАН',
    endpointDisableContent: '{{name}} нүктесін өшіргіңіз келе ме?',
    endpointsEmpty: 'Соңғы нүкте қосу үшін «+» батырмасын басыңыз',
    switchVersion: 'Нұсқаны ауыстыру',
    endpointsDocLink: 'Құжатты қарау',
    deprecation: {
      reason: {
        businessAdjustments: 'бизнес түзетулер',
        ownershipTransferred: 'иелік ауыстырылды',
        noMaintainer: 'жетекші жоқ',
      },
      noReason:
        'Бұл плагин ескірген және енді жаңартылмайды.',
      onlyReason:
        'Бұл плагин {{deprecatedReason}} себебінен ескірген және жаңартылмайды.',
      fullMessage:
        'Бұл плагин {{deprecatedReason}} себебінен енді қолдау көрсетілмейді және жаңартылмайды. Оның орнына <CustomLink href=\'https://example.com/\'>{{-alternativePluginId}}</CustomLink> пайдаланыңыз.',
    },
  },
  debugInfo: {
    title: 'Жөндеу (debug)',
    viewDocs: 'Құжаттаманы қарау',
  },
  privilege: {
    whoCanDebug: 'Плагиндерді кім жөндей алады?',
    admins: 'Әкімшілер',
    noone: 'Ешкім',
    everyone: 'Барлығы',
    title: 'Плагин баптаулары',
    whoCanInstall: 'Плагиндерді кім орнатып, басқара алады?',
  },
  pluginInfoModal: {
    packageName: 'Пакет',
    title: 'Плагин туралы ақпарат',
    repository: 'Репозиторий',
    release: 'Шығарылым',
  },
  action: {
    deleteContentLeft: 'Жойғыңыз келе ме',
    pluginInfo: 'Плагин туралы ақпарат',
    checkForUpdates: 'Жаңартуларды тексеру',
    delete: 'Плагинді жою',
    deleteContentRight: 'плагин?',
    usedInApps: 'Бұл плагин {{num}} қосымшада қолданылады.',
  },
  installModal: {
    labels: {
      package: 'Пакет',
      version: 'Нұсқа',
      repository: 'Репозиторий',
    },
    readyToInstall: 'Келесі плагинді орнатуға дайын',
    close: 'Жабу',
    installedSuccessfully: 'Орнату сәтті аяқталды',
    dropPluginToInstall: 'Плагин пакетін орнату үшін осында сүйреңіз',
    uploadFailed: 'Жүктеу қатесі',
    cancel: 'Бас тарту',
    installFailed: 'Орнату қатесі',
    readyToInstallPackages:
      'Орнату қажет келесі плагиндер саны: {{num}}',
    installedSuccessfullyDesc: 'Плагин сәтті орнатылды.',
    installComplete: 'Орнату аяқталды',
    next: 'Келесі',
    fromTrustSource:
      'Плагиндерді тек <trustSource>сенімді дереккөздерден</trustSource> орнатыңыз.',
    install: 'Орнату',
    installPlugin: 'Плагин орнату',
    installFailedDesc: 'Плагинді орнату сәтсіз аяқталды.',
    back: 'Артқа',
    pluginLoadErrorDesc: 'Бұл плагин орнатылмайды',
    installing: 'Орнатылуда...',
    uploadingPackage: '{{packageName}} жүктелуде...',
    pluginLoadError: 'Плагин жүктеу қатесі',
    readyToInstallPackage: 'Келесі плагин орнатуға дайын',
    installWarning: 'Бұл плагинді орнатуға рұқсат жоқ.',
  },
  installFromGitHub: {
    gitHubRepo: 'GitHub репозиторийі',
    selectPackagePlaceholder: 'Пакетті таңдаңыз',
    installNote: 'Плагиндерді тек сенімді дереккөздерден орнатыңыз.',
    selectPackage: 'Пакетті таңдау',
    installedSuccessfully: 'Орнату сәтті өтті',
    selectVersion: 'Нұсқаны таңдаңыз',
    updatePlugin: 'GitHub арқылы плагинді жаңарту',
    installFailed: 'Орнату сәтсіз аяқталды',
    uploadFailed: 'Жүктеу қатесі',
    installPlugin: 'GitHub арқылы плагин орнату',
    selectVersionPlaceholder: 'Нұсқаны таңдаңыз',
  },
  upgrade: {
    close: 'Жабу',
    upgrading: 'Орнатылуда...',
    successfulTitle: 'Орнату сәтті өтті',
    title: 'Плагин орнату',
    upgrade: 'Орнату',
    usedInApps: '{{num}} қосымшада қолданылады',
    description: 'Келесі плагин орнатуға дайын',
  },
  error: {
    inValidGitHubUrl:
      'Жарамсыз GitHub сілтемесі. Төмендегі пішімде дұрыс URL енгізіңіз: https://github.com/owner/repo',
    noReleasesFound:
      'Шығарылымдар табылмады. GitHub репозиторийін немесе енгізілген URL-ді тексеріңіз.',
    fetchReleasesError:
      'Шығарылымдарды алу мүмкін емес. Кейінірек қайта байқап көріңіз.',
  },
  marketplace: {
    sortOption: {
      newlyReleased: 'Жаңа шығарылғандар',
      mostPopular: 'Ең танымалдар',
      firstReleased: 'Алғаш шығарылғандар',
      recentlyUpdated: 'Жақында жаңартылғандар',
    },
    pluginsResult: '{{num}} нәтиже табылды',
    moreFrom: 'Marketplace-тен көбірек қарау',
    noPluginFound: 'Плагин табылмады',
    sortBy: 'Сұрыптау',
    empower: 'ЖИ әзірлеу мүмкіндіктерін кеңейтіңіз',
    ShaiMarketplace: 'Shai Маркетплейсі',
    viewMore: 'Толығырақ көру',
    and: 'және',
    discover: 'Зерттеу',
    verifiedTip: 'Shai арқылы расталған',
    partnerTip: 'Shai серіктесімен расталған',
    tagline:
      'Shai маркетплейсінен қажетті модельдер, құралдар, агент стратегиялары мен кеңейтімдерді табыңыз',
  },
  detail: {
    overviewTitle: 'Шолу',
    sidebar: {
      category: 'Санат',
      version: 'Нұсқа',
      requirements: 'Талаптар',
      versionHistory: 'Нұсқалар тарихы',
    },
  },
  task: {
    installing: '{{installingLength}} плагин орнатылуда, 0 дайын.',
    installingWithError:
      '{{installingLength}} плагин орнатылуда, {{successLength}} сәтті, {{errorLength}} сәтсіз.',
    clearAll: 'Барлығын тазалау',
    installingWithSuccess:
      '{{installingLength}} плагин орнатылуда, {{successLength}} сәтті орнатылды.',
    installedError: '{{errorLength}} плагин орнатылмады',
    installError:
      '{{errorLength}} плагин орнатылмады, көру үшін басыңыз',
  },
  install: '{{num}} орнату',
  searchCategories: 'Санаттар бойынша іздеу',
  search: 'Іздеу',
  searchInMarketplace: 'Маркетплейсте іздеу',
  searchTools: 'Құралдарды іздеу...',
  allCategories: 'Барлық санаттар',
  endpointsEnabled: '{{num}} қосылған соңғы нүктелер жинағы',
  installAction: 'Орнату',
  from: 'Қайдан',
  installFrom: 'ОРНАТУ КӨЗІ',
  findMoreInMarketplace: 'Marketplace-тен көбірек білу',
  installPlugin: 'Плагин орнату',
  searchPlugins: 'Плагиндерді іздеу',
  fromMarketplace: 'Маркетплейстен',
  metadata: {
    title: 'Плагиндер',
  },
  difyVersionNotCompatible:
    'Ағымдағы Shai нұсқасы бұл плагинмен үйлесімсіз. Ең аз қажет нұсқаға дейін жаңартыңыз: {{minimalDifyVersion}}',
  requestAPlugin: 'Плагин сұрату',
  publishPlugins: 'Плагиндерді жариялау',
  auth: {
    oauthClient: 'OAuth клиенті',
    oauthClientSettings: 'OAuth клиент параметрлері',
    authorization: 'Авторизация',
    addOAuth: 'OAuth қосу',
    custom: 'Таңдамалы',
    setDefault: 'Әдепкі ету',
    authRemoved: 'Авторизация жойылды',
    setupOAuth: 'OAuth клиентін баптау',
    useApi: 'API кілтін пайдалану',
    useOAuth: 'OAuth пайдалану',
    authorizations: 'Авторизациялар',
    workspaceDefault: 'Әдепкі жұмыс кеңістігі',
    authorizationName: 'Авторизация атауы',
    default: 'Әдепкі',
    useOAuthAuth: 'OAuth авторизациясын пайдалану',
    addApi: 'API кілтін қосу',
    useApiAuth: 'API кілті арқылы авторизация баптауы',
    saveOnly: 'Тек сақтау',
    saveAndAuth: 'Сақтап, авторизациялау',
    useApiAuthDesc:
      'Тіркелгі деректерін баптағаннан кейін, жұмыс кеңістігінің барлық мүшелері бұл құралды қосымша оркестрациясында пайдалана алады.',
    clientInfo:
      'Бұл құрал жеткізушісі үшін клиенттік құпия деректер табылмады. Сондықтан қолмен баптау қажет. redirect_uri ретінде төмендегіні пайдаланыңыз:',
    unavailable: 'Қолжетімсіз',
    customCredentialUnavailable:
      'Таңдамалы тіркелгі деректері қазіргі уақытта қолжетімсіз',
    credentialUnavailable:
      'Тіркелгі деректері қолжетімсіз. Әкімшіге хабарласыңыз.',
    credentialUnavailableInButton: 'Тіркелгі деректері жоқ',
    emptyAuth: 'Аутентификацияны баптаңыз',
    connectedWorkspace: 'Байланыстырылған жұмыс кеңістігі',
  },
  deprecated: 'Ескірген',
  autoUpdate: {
    strategy: {
      disabled: {
        name: 'Өшірілген',
        description: 'Плагиндер автоматты түрде жаңартылмайды',
      },
      fixOnly: {
        name: 'Тек түзетулер',
        selectedDescription: 'Тек патч-нұсқалар үшін автожаңарту',
        description:
          'Автожаңарту тек патч-нұсқаларға қолданылады (мысалы, 1.0.1 → 1.0.2). Минорлық өзгерістер кезінде жаңарту болмайды.',
      },
      latest: {
        name: 'Соңғы нұсқа',
        selectedDescription: 'Әрдайым ең соңғы нұсқаға дейін жаңарту',
        description: 'Плагиндер әрқашан соңғы нұсқаға дейін жаңартылады',
      },
    },
    upgradeMode: {
      partial: 'Тек таңдалғандар',
      all: 'Барлығын жаңарту',
      exclude: 'Таңдалғандарды шығару',
    },
    upgradeModePlaceholder: {
      partial:
        'Автоматты жаңарту тек таңдалған плагиндерге қолданылады. Қазір плагиндер таңдалмаған, сондықтан ешқайсысы жаңартылмайды.',
      exclude:
        'Таңдалған плагиндер автоматты түрде жаңартылмайды',
    },
    operation: {
      select: 'Плагиндерді таңдау',
      clearAll: 'Барлығын тазалау',
    },
    pluginDowngradeWarning: {
      exclude: 'Автожаңартудан шығару',
      title: 'Плагин нұсқасын төмендету',
      downgrade: 'Сонда да төмендету',
      description:
        'Бұл плагин үшін автожаңарту қосулы. Нұсқаны төмендету келесі автожаңарту кезінде өзгерістердің қайта жазылуына әкелуі мүмкін.',
    },
    noPluginPlaceholder: {
      noFound: 'Плагиндер табылмады',
      noInstalled: 'Орнатылған плагиндер жоқ',
    },
    updateTimeTitle: 'Жаңарту уақыты',
    updateTime: 'Жаңарту уақыты',
    automaticUpdates: 'Автоматты жаңартулар',
    updateSettings: 'Жаңарту параметрлері',
    nextUpdateTime: 'Келесі автожаңарту: {{time}}',
    specifyPluginsToUpdate: 'Жаңартылатын плагиндерді таңдаңыз',
    excludeUpdate:
      'Келесі {{num}} плагин автоматты түрде жаңартылмайды',
    partialUPdate:
      'Тек келесі {{num}} плагин автоматты түрде жаңартылады',
    changeTimezone:
      'Уақыт белдеуін өзгерту үшін <setTimezone>Баптаулар</setTimezone> бөліміне өтіңіз',
  },
}

export default translation
