const translation = {
  // Navigation
  navigation: {
    analysis: 'Талдау',
    storage: 'Сақтау',
  },
  
  // Main page
  mainPage: {
    title: 'Барлық құжаттар',
    description: 'Сақталған барлық файлдар мен құжаттарға шолу',
    uploadDocument: 'Құжат жүктеу',
    standards: 'Стандарттар',
    sops: 'SOP құжаттары',
  },
  
  // Analysis page
  analysisPage: {
    title: 'GAP талдау есептері',
    description: 'Барлық есептеріңізді қарап, басқарыңыз. Жаңа талдау бастаңыз немесе бар есептердің барысын қадағалаңыз',
    newAnalysis: 'Жаңа талдау',
    filter: 'Сүзгілеу',
    noReportsFound: 'GAP талдау есептері табылмады',
  },
  
  // Analysis table
  analysisTable: {
    reportName: 'Есеп атауы',
    createdDate: 'Құрылған күні',
    createdBy: 'Құрған',
    status: 'Мәртебе',
    actions: 'Әрекеттер',
    view: 'Қарау',
    rename: 'Атын өзгерту',
    delete: 'Жою',
    userName: 'Пайдаланушы аты',
  },
  
  // New analysis page
  newAnalysisPage: {
    title: 'GAP талдауы',
    step1: {
      title: 'Стандартты таңдау',
      uploadTitle: 'Стандарт жүктеу',
      dragAndDrop: 'Стандарт файлдарын сүйреп апарыңыз немесе',
      acceptedTypes: 'Қолдайды: DOC, DOCX, PDF. Әрқайсысы 100MB дейін',
      nextStep: 'Келесі қадам',
      noStandardsAvailable: 'Стандарттар жоқ. Алдымен стандарттарды жүктеңіз.',
      loadingStandards: 'Стандарттар жүктелуде...',
    },
    step2: {
      title: 'SOP таңдау',
      uploadTitle: 'SOP құжаттарын жүктеу',
      dragAndDrop: 'SOP файлдарын сүйреп апарыңыз немесе',
      acceptedTypes: 'Қолдайды: DOC, DOCX, PDF. Әрқайсысы 100MB дейін',
      back: 'Артқа',
      startAnalysis: 'Талдауды бастау',
      creatingAnalysis: 'Талдау жасалуда...',
      noSOPsAvailable: 'SOP құжаттары жоқ. Алдымен оларды жүктеңіз.',
      loadingSOPs: 'SOP құжаттары жүктелуде...',
    },
    step3: {
      title: 'Есеп',
      assessmentDate: 'Бағалау күні:',
    },
  },
  
  // Standards table
  standardsTable: {
    fileName: 'Файл атауы',
    uploadedDate: 'Жүктелген күні',
    createdBy: 'Құрастырушы',
    actions: 'Әрекеттер',
    download: 'Жүктеу',
    delete: 'Жою',
    noStandardsFound: 'Стандарт құжаттары табылмады',
    userName: 'Пайдаланушы аты',
  },
  
  // SOPs table
  sopsTable: {
    reportName: 'Есеп атауы',
    uploadedDate: 'Жүктелген күні',
    createdBy: 'Құрастырушы',
    version: 'НҰСҚА',
    actions: 'Әрекеттер',
    download: 'Жүктеу',
    delete: 'Жою',
    noSOPsFound: 'SOP құжаттары табылмады',
    userName: 'Пайдаланушы аты',
  },
  
  // File uploader
  fileUploader: {
    dragAndDrop: 'Файлдарды сүйреп апарыңыз немесе',
    browse: 'Шолу',
    description: '',
    acceptedTypes: 'Қолдайды: DOC, DOCX, PDF. Әрқайсысы 100MB дейін',
    selectedFiles: 'Таңдалған файлдар:',
    duplicateWarning: 'Қайталанған файл табылды. Егер оны жоймасаңыз, жаңа нұсқа ретінде сақталады',
    removeFile: 'Файлды жою',
  },
  
  // Upload modal
  uploadModal: {
    uploadStandard: 'Стандарт жүктеу',
    uploadSOP: 'SOP жүктеу',
    cancel: 'Бас тарту',
    save: 'Сақтау',
    uploading: 'Жүктелуде...',
    standardsUploaded: 'Стандарттар сәтті жүктелді!',
    sopsUploaded: 'SOP құжаттары сәтті жүктелді!',
    uploadStandardsError: 'Стандарттарды жүктеу кезінде қате пайда болды',
    uploadSOPsError: 'SOP жүктеу кезінде қате пайда болды',
  },
  
  // Standard select
  standardSelect: {
    placeholder: 'Таңдау',
    searchPlaceholder: 'Стандарттарды іздеу...',
    noStandardsFound: 'Стандарттар табылмады',
    noStandardsAvailable: 'Стандарттар қолжетімсіз',
  },
  
  // SOP select
  sopSelect: {
    placeholder: 'SOP таңдау',
    searchPlaceholder: 'SOP іздеу...',
    noSOPsFound: 'SOP табылмады',
    noSOPsAvailable: 'SOP жоқ',
    name: 'Атауы',
    createdBy: 'Құрастырушы',
    version: 'Нұсқасы',
  },
  
  // Report view
  reportView: {
    workingOnIt: 'Өңделуде...',
    workingDescription: 'Бұл біраз уақыт алуы мүмкін. Есеп өңделіп жатқанда, осы бетте қалуыңызға немесе басты бетке оралуыңызға болады.',
    
    // KPI Metrics
    coverage: 'Қамту деңгейі',
    sops: 'SOP құжаттары',
    clauses: 'Тармақтар',
    criticalMDRGaps: 'Маңызды MDR алшақтықтар',
    sopsWithCorrectiveActions: 'Түзету әрекеттері бар SOP құжаттары',
    
    // Sections
    executiveSummary: 'Қысқаша шолу',
    noExecutiveSummary: 'Қысқаша шолу жоқ.',
    criticalGaps: 'Маңызды алшақтықтар',
    noCriticalGaps: 'Маңызды алшақтықтар табылмады.',
    recommendedActions: 'Ұсынылған әрекеттер:',
    regulationCoverageGaps: 'Реттеу қамту алшақтықтары',
    sopSpecificGaps: 'SOP бойынша нақты алшақтықтар',
    exportReport: 'Есепті экспорттау',
    downloadPDF: 'PDF жүктеу',
    downloadDOCX: 'DOCX жүктеу',
    
    // Table headers
    regulationSection: 'Реттеу бөлімі',
    coverageStatus: 'Қамту күйі',
    gapDescription: 'Алшақтық  сипаттамасы',
    impact: 'Әсері',
    sopName: 'SOP атауы',
    severity: 'Маңыздылық деңгейі',
    oldSeverity: 'Ескі маңыздылық',
    newSeverity: 'Жаңа маңыздылық',
    change: 'Өзгеріс',
    oldSopName: 'Бұрынғы SOP атауы',
    newSopName: 'Жаңа SOP атауы',
    
    // Data
    noDataAvailable: 'Деректер жоқ',
    noDataAvailableRegulation: 'Реттеу қамту олқылықтарына арналған деректер жоқ.',
    noDataAvailableSOP: 'SOP бойынша деректер жоқ.',
    
    // Modal
    field: 'Өріс',
    value: 'Мән',
    uploadNewSOP: 'Жаңартылған SOP жүктеу',
    reAnalyzeSOP: 'SOP қайта талдау',
    reAnalyzing: 'Қайта талдануда...',
    reAnalyzeSuccess: 'SOP қайта талдауы сәтті басталды!',
    reAnalyzeError: 'SOP қайта талдауын бастау сәтсіз аяқталды',
  },
  
  // Report page
  reportPage: {
    loading: 'Жүктелуде...',
    reportNotFound: 'Есеп табылмады',
    reportNotFoundDescription: 'Сіз іздеп отырған есеп жоқ немесе жойылған.',
    assessmentDate: 'Бағалау күні:',
    exportReport: 'Есепті экспорттау',
  },
  
  // Status badges
  status: {
    completed: 'Аяқталды',
    processing: 'Өңделуде',
    failed: 'Сәтсіз',
    pending: 'Күтілуде',
  },
  
  // Common actions
  actions: {
    cancel: 'Бас тарту',
    confirm: 'Растау',
    save: 'Сақтау',
    delete: 'Жою',
    edit: 'Өңдеу',
    view: 'Қарау',
    download: 'Жүктеу',
    upload: 'Жүктеу',
    back: 'Артқа',
    next: 'Келесі',
    previous: 'Алдыңғы',
    close: 'Жабу',
    open: 'Ашу',
    select: 'Таңдау',
    clear: 'Тазалау',
    search: 'Іздеу',
    filter: 'Сүзгілеу',
    sort: 'Сұрыптау',
    refresh: 'Жаңарту',
    loading: 'Жүктелуде...',
  },
  
  // Messages
  messages: {
    analysisStarted: 'Талдау сәтті басталды!',
    analysisFailed: 'Талдауды бастау сәтсіз аяқталды',
    reportDeleted: 'Есеп сәтті жойылды',
    reportRenamed: 'Есеп атауы сәтті өзгертілді',
    standardDeleted: 'Стандарт сәтті жойылды',
    standardDownloaded: 'Стандарт сәтті жүктелді',
    sopDeleted: 'SOP сәтті жойылды',
    sopDownloaded: 'SOP сәтті жүктелді',
    uploadSuccess: 'Жүктеу сәтті аяқталды',
    uploadFailed: 'Жүктеу сәтсіз аяқталды',
    deleteConfirm: 'Бұл элементті жойғыңыз келетініне сенімдісіз бе?',
    renameConfirm: 'Жаңа атауды енгізіңіз:',
  },
  
  // Validation
  validation: {
    required: 'Бұл өріс міндетті',
    invalidFormat: 'Қате формат',
    fileTooLarge: '"{{fileName}}" файлының өлшемі тым үлкен. Ең үлкен рұқсат етілген өлшемм — {{maxSize}}',
    fileTypeNotSupported: 'Бұл файл түрі қолдау таппайды',
    maxFileSize: 'Ең үлкен файл өлшемі — 100MB',
  },
}

export default translation
