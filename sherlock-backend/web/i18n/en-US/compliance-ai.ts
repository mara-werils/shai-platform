const translation = {
  // Navigation
  navigation: {
    analysis: 'Analysis',
    storage: 'Storage',
  },
  
  // Main page
  mainPage: {
    title: 'All documents',
    description: 'Overview of stored files and documents',
    uploadDocument: 'Upload document',
    standards: 'Standards',
    sops: 'SOPs',
  },
  
  // Analysis page
  analysisPage: {
    title: 'GAP Analysis Reports',
    description: 'View and manage all your reports. Start a new analysis or track the progress of existing reports',
    newAnalysis: 'New analysis',
    filter: 'Filter',
    noReportsFound: 'No analysis reports found',
  },
  
  // Analysis table
  analysisTable: {
    reportName: 'Report Name',
    createdDate: 'Created Date',
    createdBy: 'Created by',
    status: 'Status',
    actions: 'Actions',
    view: 'View',
    rename: 'Rename',
    delete: 'Delete',
    userName: 'User Name',
  },
  
  // New analysis page
  newAnalysisPage: {
    title: 'GAP Analysis',
    step1: {
      title: 'Select Standard',
      uploadTitle: 'Upload Standard',
      dragAndDrop: 'Drag and drop standard files, or',
      acceptedTypes: 'Supports: DOC, DOCX, PDF. Max 100MB each',
      nextStep: 'Next Step',
      noStandardsAvailable: 'No standards available. Please upload standards first.',
      loadingStandards: 'Loading standards...',
      guidelineTypeTitle: 'Guideline Type',
    },
    step2: {
      title: 'Select SOPs',
      uploadTitle: 'Upload SOPs',
      dragAndDrop: 'Drag and drop SOP files, or',
      acceptedTypes: 'Supports: DOC, DOCX, PDF. Max 100MB each',
      back: 'Back',
      startAnalysis: 'Start Analysis',
      creatingAnalysis: 'Creating Analysis...',
      noSOPsAvailable: 'No SOPs available. Please upload SOPs first.',
      loadingSOPs: 'Loading SOPs...',
    },
    step3: {
      title: 'Report',
      assessmentDate: 'Assessment date:',
    },
  },
  
  // Standards table
  standardsTable: {
    fileName: 'File Name',
    uploadedDate: 'Uploaded Date',
    createdBy: 'Created by',
    actions: 'Actions',
    download: 'Download',
    delete: 'Delete',
    noStandardsFound: 'No standards documents found',
    userName: 'User Name',
  },
  
  // SOPs table
  sopsTable: {
    reportName: 'Report Name',
    uploadedDate: 'Uploaded Date',
    createdBy: 'Created by',
    version: 'VERSION',
    actions: 'Actions',
    download: 'Download',
    delete: 'Delete',
    noSOPsFound: 'No SOPs documents found',
    userName: 'User Name',
  },
  
  // File uploader
  fileUploader: {
    dragAndDrop: 'Drag and drop files, or',
    browse: 'Browse',
    description: '',
    acceptedTypes: 'Supports: DOC, DOCX, PDF. Max 100MB each',
    selectedFiles: 'Selected files:',
    duplicateWarning: 'Duplicate detected. This file will be saved as a new version unless you remove it',
    removeFile: 'Remove file',
  },
  
  // Upload modal
  uploadModal: {
    uploadStandard: 'Upload Standard',
    uploadSOP: 'Upload SOP',
    cancel: 'Cancel',
    save: 'Save',
    uploading: 'Uploading...',
    standardsUploaded: 'Standards successfully uploaded!',
    sopsUploaded: 'SOPs successfully uploaded!',
    uploadStandardsError: 'Error uploading standards',
    uploadSOPsError: 'Error uploading SOPs',
  },
  
  // Standard select
  standardSelect: {
    placeholder: 'Select',
    searchPlaceholder: 'Search standards...',
    noStandardsFound: 'No standards found',
    noStandardsAvailable: 'No standards available',
  },
  
  // SOP select
  sopSelect: {
    placeholder: 'Select SOPs',
    searchPlaceholder: 'Search SOPs...',
    noSOPsFound: 'No SOPs found',
    noSOPsAvailable: 'No SOPs available',
    name: 'Name',
    createdBy: 'Created by',
    version: 'Version',
  },
  
  // Guideline type select
  guidelineTypeSelect: {
    placeholder: 'Select type',
  },
  
  // Member select
  memberSelect: {
    noUsersFound: 'No users found',
  },
  
  // Report view
  reportView: {
    workingOnIt: 'Working on it...',
    workingDescription: 'This may take take some time. You can stay here or return to the home screen while we process your report.',
    
    // KPI Metrics
    coverage: 'Coverage',
    sops: 'SOPs',
    clauses: 'Clauses',
    criticalMDRGaps: 'Critical Gaps',
    sopsWithCorrectiveActions: 'SOPs with Corrective Actions',
    
    // Sections
    executiveSummary: 'Executive Summary',
    noExecutiveSummary: 'No executive summary available.',
    criticalGaps: 'Critical Gaps',
    noCriticalGaps: 'No critical gaps available.',
    recommendedActions: 'Recommended actions:',
    regulationCoverageGaps: 'Regulation Coverage Gaps',
    sopSpecificGaps: 'SOP-Specific Gaps',
    exportReport: 'Export report',
    downloadPDF: 'Download PDF',
    downloadDOCX: 'Download DOCX',
    gapAnalysisComparison: 'Gap Analysis Comparison',
    assignedTo: 'Assigned to',
    selectUser: 'Select user',
    noGapAnalysisData: 'No gap analysis data available',
    
    // Table headers
    regulationSection: 'Regulation section',
    coverageStatus: 'Coverage status',
    gapDescription: 'Gap description',
    impact: 'Impact',
    sopName: 'SOP name',
    severity: 'Severity',
    oldSeverity: 'Old Severity',
    newSeverity: 'New Severity',
    change: 'Change',
    oldSopName: 'Old SOP name',
    newSopName: 'New SOP name',
    
    // Data
    noDataAvailable: 'No data available',
    noDataAvailableRegulation: 'No data available for Regulation Coverage Gaps.',
    noDataAvailableSOP: 'No data available for SOP-Specific Gaps.',
    
    // Modal
    field: '',
    value: 'Description',
    uploadNewSOP: 'Upload revised SOPs',
    reAnalyzeSOP: 'Re-analyze SOP',
    reAnalyzing: 'Re-analyzing...',
    reAnalyzeSuccess: 'SOP re-analysis started successfully!',
    reAnalyzeError: 'Failed to start SOP re-analysis',
    assignedSuccess: 'Assigned successfully',
    assignedFailed: 'Failed to assign',
    showDetails: 'Show details',
  },
  
  // Report page
  reportPage: {
    loading: 'Loading...',
    reportNotFound: 'Report Not Found',
    reportNotFoundDescription: "The report you're looking for doesn't exist or has been deleted.",
    assessmentDate: 'Assessment date:',
    exportReport: 'Export report',
    exportSummary: 'Export summary',
    reportFallback: 'Report',
  },
  
  // Status badges
  status: {
    completed: 'Completed',
    processing: 'Processing',
    failed: 'Failed',
    pending: 'Pending',
  },
  
  // Common actions
  actions: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    open: 'Open',
    select: 'Select',
    clear: 'Clear',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    loading: 'Loading...',
  },
  
  // Messages
  messages: {
    analysisStarted: 'Analysis started successfully!',
    analysisFailed: 'Failed to start analysis',
    reportDeleted: 'Report deleted successfully',
    reportRenamed: 'Report renamed successfully',
    standardDeleted: 'Standard deleted successfully',
    standardDownloaded: 'Standard downloaded successfully',
    sopDeleted: 'SOP deleted successfully',
    sopDownloaded: 'SOP downloaded successfully',
    uploadSuccess: 'Upload successful',
    uploadFailed: 'Upload failed',
    deleteConfirm: 'Are you sure you want to delete this item?',
    renameConfirm: 'Enter new name:',
  },
  
  // Validation
  validation: {
    required: 'This field is required',
    invalidFormat: 'Invalid format',
    fileTooLarge: 'File "{{fileName}}" is too large. Maximum size is {{maxSize}}',
    fileTypeNotSupported: 'File type not supported',
    maxFileSize: 'Maximum file size is 100MB',
  },
}

export default translation
