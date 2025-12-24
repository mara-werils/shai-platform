const translation = {
  // Navigation
  navigation: {
    analysis: 'Анализ',
    storage: 'Хранилище',
  },
  
  // Main page
  mainPage: {
    title: 'Все документы',
    description: 'Обзор всех файлов или документов',
    uploadDocument: 'Загрузить документ',
    standards: 'Стандарты',
    sops: 'ВНД',
  },
  
  // Analysis page
  analysisPage: {
    title: 'Отчеты по анализу несоответствий',
    description: 'Просматривайте и управляйте всеми вашими отчётами. Начните новый анализ или отслеживайте прогресс существующих',
    newAnalysis: 'Новый анализ',
    filter: 'Фильтр',
    noReportsFound: 'Отчёты анализа не найдены',
  },
  
  // Analysis table
  analysisTable: {
    reportName: 'Название отчёта',
    createdDate: 'Дата создания',
    createdBy: 'Создано',
    status: 'Статус',
    actions: 'Действия',
    view: 'Просмотр',
    rename: 'Переименовать',
    delete: 'Удалить',
    userName: 'Имя пользователя',
  },
  
  // New analysis page
  newAnalysisPage: {
    title: 'GAP-анализ',
    step1: {
      title: 'Выберите стандарт',
      uploadTitle: 'Загрузить стандарт',
      dragAndDrop: 'Перетащите файлы стандарта или',
      acceptedTypes: 'Поддерживает: DOC, DOCX, PDF. Макс 100MB каждый',
      nextStep: 'Следующий шаг',
      noStandardsAvailable: 'Нет доступных стандартов. Пожалуйста, загрузите стандарты.',
      loadingStandards: 'Загружаем стандарты...',
      guidelineTypeTitle: 'Тип стандарта',
    },
    step2: {
      title: 'Выберите ВНД',
      uploadTitle: 'Загрузить ВНД',
      dragAndDrop: 'Перетащите файлы ВНД или',
      acceptedTypes: 'Поддерживает: DOC, DOCX, PDF. Макс 100MB каждый',
      back: 'Назад',
      startAnalysis: 'Начать анализ',
      creatingAnalysis: 'Создание анализа...',
      noSOPsAvailable: 'Нет доступных ВНД. Пожалуйста, загрузите ВНД.',
      loadingSOPs: 'Загружаем ВНД...',
    },
    step3: {
      title: 'Отчёт',
      assessmentDate: 'Дата оценки:',
    },
  },
  
  // Standards table
  standardsTable: {
    fileName: 'Имя файла',
    uploadedDate: 'Дата загрузки',
    createdBy: 'Загружено',
    actions: 'Действия',
    download: 'Скачать',
    delete: 'Удалить',
    noStandardsFound: 'Документы стандартов не найдены',
    userName: 'Имя пользователя',
  },
  
  // SOPs table
  sopsTable: {
    reportName: 'Название отчёта',
    uploadedDate: 'Дата загрузки',
    createdBy: 'Загружено',
    version: 'Версия',
    actions: 'Действия',
    download: 'Скачать',
    delete: 'Удалить',
    noSOPsFound: 'Документы ВНД не найдены',
    userName: 'Имя пользователя',
  },
  
  // File uploader
  fileUploader: {
    dragAndDrop: 'Перетащите файлы или',
    browse: 'Обзор',
    description: '',
    acceptedTypes: 'Поддерживает: DOC, DOCX, PDF. Макс 100MB каждый',
    selectedFiles: 'Выбранные файлы:',
    duplicateWarning: 'Обнаружен дубликат. Этот файл будет сохранён как новая версия, если вы его не удалите',
    removeFile: 'Удалить файл',
  },
  
  // Upload modal
  uploadModal: {
    uploadStandard: 'Загрузить стандарт',
    uploadSOP: 'Загрузить ВНД',
    cancel: 'Отмена',
    save: 'Сохранить',
    uploading: 'Загрузка...',
    standardsUploaded: 'Стандарты успешно загружены!',
    sopsUploaded: 'ВНД успешно загружены!',
    uploadStandardsError: 'Ошибка при загрузке стандартов',
    uploadSOPsError: 'Ошибка при загрузке ВНД',
  },
  
  // Standard select
  standardSelect: {
    placeholder: 'Выбрать',
    searchPlaceholder: 'Поиск стандартов...',
    noStandardsFound: 'Стандарты не найдены',
    noStandardsAvailable: 'Нет доступных стандартов',
  },
  
  // SOP select
  sopSelect: {
    placeholder: 'Выберите ВНД',
    searchPlaceholder: 'Поиск ВНД...',
    noSOPsFound: 'ВНД не найдены',
    noSOPsAvailable: 'Нет доступных ВНД',
    name: 'Название',
    createdBy: 'Создано',
    version: 'Версия',
  },
  
  // Guideline type select
  guidelineTypeSelect: {
    placeholder: 'Выберите тип',
  },
  
  // Member select
  memberSelect: {
    noUsersFound: 'Пользователей не найдено',
  },
  
  // Report view
  reportView: {
    workingOnIt: 'Обрабатываем...',
    workingDescription: 'Это может занять некоторое время. Вы можете остаться здесь или вернуться на главную страницу, пока мы обрабатываем ваш отчёт.',
    
    // KPI Metrics
    coverage: 'Охват',
    sops: 'ВНД',
    clauses: 'Разделы',
    criticalMDRGaps: 'Критические несоответствия',
    sopsWithCorrectiveActions: 'ВНД с корректирующими действиями',
    
    // Sections
    executiveSummary: 'Краткое резюме',
    noExecutiveSummary: 'Резюме недоступно.',
    criticalGaps: 'Критические несоответствия',
    noCriticalGaps: 'Критические несоответствия отсутствуют.',
    recommendedActions: 'Рекомендуемые действия:',
    regulationCoverageGaps: 'Несоответствия в покрытии нормативов',
    sopSpecificGaps: 'Несоответствия по ВНД',
    exportReport: 'Экспорт отчёта',
    downloadPDF: 'Скачать PDF',
    downloadDOCX: 'Скачать DOCX',
    gapAnalysisComparison: 'Сравнение GAP-анализа',
    assignedTo: 'Назначено',
    selectUser: 'Выбрать пользователя',
    noGapAnalysisData: 'Данные отсутствуют',
    
    // Table headers
    regulationSection: 'Раздел норматива',
    coverageStatus: 'Статус охвата',
    gapDescription: 'Описание несоответствия',
    impact: 'Влияние',
    sopName: 'Название ВНД',
    severity: 'Степень серьёзности',
    oldSeverity: 'Старая степень серьезности',
    newSeverity: 'Новая степень серьезности',
    change: 'Изменение',
    oldSopName: 'Старое название ВНД',
    newSopName: 'Новое название ВНД',
    
    // Data
    noDataAvailable: 'Нет доступных данных',
    noDataAvailableRegulation: 'Нет данных по охвату нормативов.',
    noDataAvailableSOP: 'Нет данных по несоответствиям ВНД.',
    
    // Modal
    field: 'Поле',
    value: 'Значение',
    uploadNewSOP: 'Загрузить обновлённые ВНД',
    reAnalyzeSOP: 'Повторно проанализировать ВНД',
    reAnalyzing: 'Повторный анализ...',
    reAnalyzeSuccess: 'Повторный анализ ВНД успешно запущен!',
    reAnalyzeError: 'Не удалось запустить повторный анализ',
    assignedSuccess: 'Назначено успешно',
    assignedFailed: 'Не удалось назначить',
    showDetails: 'Показать детали',
  },
  
  // Report page
  reportPage: {
    loading: 'Загрузка...',
    reportNotFound: 'Отчёт не найден',
    reportNotFoundDescription: 'Отчёт не существует или удалён.',
    assessmentDate: 'Дата оценки:',
    exportReport: 'Экспорт отчёта',
    exportSummary: 'Экспортировать резюме',
    reportFallback: 'Отчет',
  },
  
  // Status badges
  status: {
    completed: 'Завершено',
    processing: 'Обработка',
    failed: 'Ошибка',
    pending: 'В ожидании',
  },
  
  // Common actions
  actions: {
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Редактировать',
    view: 'Просмотр',
    download: 'Скачать',
    upload: 'Загрузить',
    back: 'Назад',
    next: 'Далее',
    previous: 'Предыдущий',
    close: 'Закрыть',
    open: 'Открыть',
    select: 'Выбрать',
    clear: 'Очистить',
    search: 'Поиск',
    filter: 'Фильтр',
    sort: 'Сортировка',
    refresh: 'Обновить',
    loading: 'Загрузка...',
  },
  
  // Messages
  messages: {
    analysisStarted: 'Анализ успешно начат!',
    analysisFailed: 'Не удалось начать анализ',
    reportDeleted: 'Отчёт успешно удалён',
    reportRenamed: 'Отчёт успешно переименован',
    standardDeleted: 'Стандарт успешно удалён',
    standardDownloaded: 'Стандарт успешно скачан',
    sopDeleted: 'ВНД успешно удалён',
    sopDownloaded: 'ВНД успешно скачан',
    uploadSuccess: 'Файлы успешно загружены',
    uploadFailed: 'Ошибка загрузки',
    deleteConfirm: 'Вы уверены, что хотите удалить этот элемент?',
    renameConfirm: 'Введите новое название:',
  },
  
  // Validation
  validation: {
    required: 'Это поле обязательно',
    invalidFormat: 'Неверный формат',
    fileTooLarge: 'Файл "{{fileName}}" слишком большой. Максимальный размер — {{maxSize}}',
    fileTypeNotSupported: 'Тип файла не поддерживается',
    maxFileSize: 'Максимальный размер файла — 100MB',
  },
}

export default translation
