'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Button from '@/app/components/base/button';
import StatusBadge from '@/app/components/base/status-badge';
import { RiDownloadLine, RiCheckboxFill, RiFileTextFill, RiListCheck2, RiErrorWarningFill, RiListUnordered, RiRestartFill } from '@remixicon/react';
import { ComplianceReport } from '@/service/shai/compliance-reports';
import styles from '../styles.module.css';
import ChevronRight from '@/app/components/base/icons/src/vender/line/arrows/ChevronRight';
import Pagination from '@/app/components/base/pagination';
import Modal from '@/app/components/base/modal';
import { Markdown } from '@/app/components/base/markdown';
import FileUploader from './FileUploader';
import { useReanalyzeSOPGap } from '@/hooks/shai/use-reanalyze-sop-gap';
import { useGapAnalysisComparison } from '@/hooks/shai/use-gap-analysis-comparison';
import MemberSelect from './MemberSelect';
import { useAssignGap } from '@/hooks/shai/use-assign-gap';
import { useAppContext } from '@/context/app-context';

interface ReportViewProps {
  report: ComplianceReport;
  onDownloadSOP?: (format: 'pdf' | 'docx') => void;
}

const ReportView: React.FC<ReportViewProps> = ({ 
  report,
  onDownloadSOP
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { assign, isAssigning } = useAssignGap();
  const { userProfile } = useAppContext();

  // Состояния пагинации
  const [regulationPage, setRegulationPage] = React.useState(0);
  const [sopPage, setSopPage] = React.useState(0);
  const [gapAnalysisPage, setGapAnalysisPage] = React.useState(0);
  const [regulationLimit, setRegulationLimit] = React.useState(10);
  const [sopLimit, setSopLimit] = React.useState(10);
  const [gapAnalysisLimit, setGapAnalysisLimit] = React.useState(10);
  const [showSopDetailModal, setShowSopDetailModal] = React.useState<{ open: boolean; fileName: string | null; content: string | null; sopData?: any }>({ open: false, fileName: null, content: null, sopData: null });
  const [modalSelectedFiles, setModalSelectedFiles] = React.useState<File[]>([]);
  
  const { reanalyze, isReanalyzing } = useReanalyzeSOPGap();
  const { comparison: gapAnalysisComparison, loading: gapAnalysisLoading } = useGapAnalysisComparison(report.generated_report_id);
  
  const [expandedGaps, setExpandedGaps] = React.useState<Set<number>>(new Set());

  // Функция для переключения состояния аккордеона
  const toggleGap = (index: number) => {
    const newExpanded = new Set(expandedGaps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedGaps(newExpanded);
  };

  const handleModalFilesChange = (files: File[]) => {
    const limitedFiles = files.slice(0, 1);
    setModalSelectedFiles(limitedFiles);
  };

  const handleReanalyzeSOP = async () => {
    if (!showSopDetailModal.sopData || modalSelectedFiles.length === 0) {
      return;
    }

    const userName = userProfile?.name || '';
    const success = await reanalyze(modalSelectedFiles, showSopDetailModal.sopData.sop_id, report.generated_report_id, userName);
    if (success) {
      setModalSelectedFiles([]);
    }
  };

  // Функция для парсинга markdown таблицы
  const parseMarkdownTable = (markdownContent: string) => {
    if (!markdownContent) return [];
    
    const lines = markdownContent.split('\n');
    const data: { field: string; value: string }[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.includes('---') || !line.startsWith('|')) {
        continue;
      }
      
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length >= 2) {
        if (cells[0].toLowerCase() === 'field' && cells[1].toLowerCase() === 'value') {
          continue;
        }
        
        data.push({
          field: cells[0].replace(/\*\*/g, '').trim(),
          value: cells[1].trim()
        });
      }
    }
    
    return data;
  };


  // Data from API
  const regulationRows = report.json_content?.RegulationCoverageGaps || [];
  const sopRows = report.json_content?.sop_specific_gaps || [];
  const executiveSummary = report.json_content?.ExecutiveSummary?.Overview || '';
  const criticalGaps = report.json_content?.ExecutiveSummary?.CriticalGaps || [];
  
  
  const kpiMetrics = report.json_content?.kpimetrics || {
    clauses: 0,
    coverage_percentage: 0,
    gaps: 0,
    sops: 0,
    sops_which_needs_corrective_actions: 0
  };
  const coveragePercentage = kpiMetrics.coverage_percentage || 0;
  const formattedCoverage = Math.round(coveragePercentage);

  // Показываем блок "Working on it..." если статус не completed
  if (report.processing_status !== 'completed') {
    return (
      <div className="reportPageClass">
        <div className="space-y-8">
          <div className='bg-white rounded-[20px] border border-gray-200 p-6'>
            <div className="py-2">
              <h2 className={`text-2xl font-bold mb-1 ${styles.textMainColor}`}>{t('complianceAi.reportView.workingOnIt')}</h2>
              <p className="text-gray-600 text-lg">{t('complianceAi.reportView.workingDescription')}</p>
              <div className="mt-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reportPageClass">
      <div className="space-y-8">
         {/* KPI Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 justify-center">

             <div className="border border-gray-200 rounded-[20px] p-4">
               <div className="flex items-center gap-3 h-full">
              <RiCheckboxFill className="h-6 w-6 text-[#0F8B06]" />
              <div>
                <div className="text-sm text-gray-500">{t('complianceAi.reportView.coverage')}</div>
                <div className="text-xl font-semibold text-gray-600">{formattedCoverage}%</div>
              </div>
            </div>
          </div>

             <div className="border border-gray-200 rounded-[20px] p-4">
               <div className="flex items-center gap-3 h-full">
              <RiFileTextFill className="h-6 w-6 text-[#454CE7]" />
              <div>
                <div className="text-sm text-gray-500">{t('complianceAi.reportView.sops')}</div>
                <div className="text-xl font-semibold text-gray-600">{kpiMetrics.sops || 0}</div>
              </div>
            </div>
          </div>

             <div className="border border-gray-200 rounded-[20px] p-4">
               <div className="flex items-center gap-3 h-full">
              <RiListCheck2 className="h-6 w-6 text-[#9B56F7]" />
              <div>
                <div className="text-sm text-gray-500">{t('complianceAi.reportView.clauses')}</div>
                <div className="text-xl font-semibold text-gray-600">{kpiMetrics.clauses || 0}</div>
              </div>
            </div>
          </div>

             <div className="border border-gray-200 rounded-[20px] p-4">
               <div className="flex items-center gap-3 h-full">
              <RiErrorWarningFill className="h-6 w-6 text-[#EF5350]" />
              <div>
                <div className="text-sm text-gray-500">{t('complianceAi.reportView.criticalMDRGaps')}</div>
                <div className="text-xl font-semibold text-gray-600">{kpiMetrics.gaps || 0}</div>
              </div>
            </div>
          </div>

             <div className="border border-gray-200 rounded-[20px] p-4">
               <div className="flex items-center gap-3 h-full">
              <RiListUnordered className="h-6 w-6 text-[#E4791A]" />
              <div>
                <div className="text-sm text-gray-500">{t('complianceAi.reportView.sopsWithCorrectiveActions')}</div>
                <div className="text-xl font-semibold text-gray-600">{kpiMetrics.sops_which_needs_corrective_actions || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-[20px] border border-gray-200 p-6">
          <h2 className={`text-xl font-semibold mb-2 ${styles.textMainColor}`}>{t('complianceAi.reportView.executiveSummary')}</h2>
          {executiveSummary ? (
            <div className={`${styles.textMainColor}`}>
              <Markdown content={executiveSummary} />
            </div>
          ) : (
            <p className={`text-gray-500 ${styles.textMainColor}`}>
              {t('complianceAi.reportView.noExecutiveSummary')}
            </p>
          )}
        </div>

        {/* Critical Gaps */}
        <div className="bg-white rounded-[20px] border border-gray-200 p-6">
          <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${styles.textMainColor}`}>
            <RiErrorWarningFill className="w-6 h-6 text-[#EF5350]" />
            {t('complianceAi.reportView.criticalGaps')}
          </h2>
          <div className="space-y-1">
            {criticalGaps.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t('complianceAi.reportView.noCriticalGaps')}</p>
            ) : (
              criticalGaps.map((gap, index) => (
                <div key={index} className="rounded-[20px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleGap(index)}
                    className={`w-full p-4 text-left transition-colors ${
                      expandedGaps.has(index) ? 'bg-[#F9FAFB]' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{gap.GapDescription}</div>
                      </div>
                      <div className="ml-4">
                        {expandedGaps.has(index) ? (
                          <ChevronRight className="w-5 h-5 text-gray-400 -rotate-90" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {expandedGaps.has(index) && (
                    <div className="bg-[#F9FAFB] border-t border-[#E7E8EA] p-4">
                      <div className="font-medium text-gray-900 mb-1">{t('complianceAi.reportView.recommendedActions')}</div>
                      <ul className="space-y-1">
                        {gap.RecommendedActions.map((action, actionIndex) => (
                          <li key={actionIndex} className="text-sm text-gray-600">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Regulation Coverage Gaps */}
        <div className="bg-white rounded-[20px] border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${styles.textMainColor}`}>{t('complianceAi.reportView.regulationCoverageGaps')}</h2>
          </div>
          <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '200px', maxWidth: '400px' }}>
                      {t('complianceAi.reportView.regulationSection')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '150px', maxWidth: '200px' }}>
                      {t('complianceAi.reportView.coverageStatus')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '200px', maxWidth: '400px' }}>
                      {t('complianceAi.reportView.gapDescription')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '150px', maxWidth: '200px' }}>
                      {t('complianceAi.reportView.impact')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {regulationRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">{t('complianceAi.reportView.noDataAvailableRegulation')}</td>
                    </tr>
                  ) : (
                    regulationRows.slice(regulationPage * regulationLimit, regulationPage * regulationLimit + regulationLimit).map((row, idx: number) => (
                      <tr className="hover:bg-gray-50" key={idx}>
                                                 <td className="px-6 py-4 whitespace-normal" style={{ minWidth: '200px', maxWidth: '400px' }}>
                           <div>
                             <div className={`text-sm font-medium ${styles.textMainColor}`}>
                               {row.RegulationSection}
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap" style={{ minWidth: '150px', maxWidth: '200px' }}>
                           <StatusBadge status={row.CoverageStatus} />
                         </td>
                         <td className="px-6 py-4 text-sm text-gray-900" style={{ minWidth: '200px', maxWidth: '400px' }}>
                           {row.GapDescription}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap" style={{ minWidth: '150px', maxWidth: '200px' }}>
                           <StatusBadge status={row.Impact} styleSecond={true} />
                         </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {regulationRows.length > 0 && (
            <div className="mt-4">
              <Pagination
                current={regulationPage}
                onChange={setRegulationPage}
                total={regulationRows.length}
                limit={regulationLimit}
                onLimitChange={(l) => { setRegulationLimit(l); setRegulationPage(0); }}
              />
            </div>
          )}
        </div>

        {/* SOP-Specific Gaps */}
        <div className="bg-white rounded-[20px] border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${styles.textMainColor}`}>{t('complianceAi.reportView.sopSpecificGaps')}</h2>
            {onDownloadSOP && (
              <Button 
                type="button" 
                variant="primary"
                onClick={() => onDownloadSOP('docx')}
              >
                <RiDownloadLine className="mr-2 h-4 w-4" />
                {t('complianceAi.reportView.exportReport')}
              </Button>
            )}
          </div>
          <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '50px', maxWidth: '100px' }}>
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '200px', maxWidth: '300px' }}>
                      {t('complianceAi.reportView.sopName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '150px', maxWidth: '250px' }}>
                      {t('complianceAi.reportView.regulationSection')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '250px', maxWidth: '500px' }}>
                      {t('complianceAi.reportView.gapDescription')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '280px', maxWidth: '420px' }}>
                      {t('complianceAi.reportView.assignedTo')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '150px', maxWidth: '200px' }}>
                      {t('complianceAi.reportView.severity')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sopRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">{t('complianceAi.reportView.noDataAvailableSOP')}</td>
                    </tr>
                  ) : (
                    sopRows.slice(sopPage * sopLimit, sopPage * sopLimit + sopLimit).map((row, idx: number) => (
                      <tr 
                        className="hover:bg-gray-50 cursor-pointer" 
                        key={idx}
                        onClick={() => setShowSopDetailModal({ open: true, fileName: row.sop_name, content: row.markdown_content, sopData: row })}
                      >
                      <td className="px-6 py-4 whitespace-normal" style={{ minWidth: '50px', maxWidth: '100px' }}>
                        <div>
                          <div className={`text-sm font-medium ${styles.textMainColor}`}>
                            {row.sop_id}
                          </div>
                        </div>
                      </td>
                                                 <td className="px-6 py-4 whitespace-normal" style={{ minWidth: '200px', maxWidth: '300px' }}>
                           <div>
                             <div className={`text-sm font-medium ${styles.textMainColor}`}>
                               {row.sop_name}
                             </div>
                           </div>
                         </td>
                                                                           <td className="px-6 py-4 whitespace-normal text-sm text-[#495464]" style={{ minWidth: '150px', maxWidth: '250px' }}>
                            <Markdown content={row.regulation_section} />
                          </td>
                          <td className="px-6 py-4 text-sm text-[#495464]" style={{ minWidth: '250px', maxWidth: '500px' }}>
                                                        <Markdown content={row.gap_description} />
                          </td>
                         <td className="px-6 py-4 whitespace-nowrap" style={{ minWidth: '160px', maxWidth: '280px' }} onClick={(e) => e.stopPropagation()}>
                             <MemberSelect
                               className="w-full"
                               disabled={isAssigning}
                               value={row.assigned_to as any}
                               placeholder={t('complianceAi.reportView.selectUser')}
                               onSelect={async (item) => {
                                const ok = await assign(item.value, row.sop_id)
                                if (ok) {
                                  (row as any).assigned_to = item.value
                                }
                              }}
                             />
                          </td>
                         <td className="px-6 py-4 whitespace-nowrap align-middle" style={{ minWidth: '150px', maxWidth: '200px', verticalAlign: 'middle' }}>
                           <div className="flex items-center gap-2 h-full">
                             <StatusBadge 
                               status={row.severity}
                               styleSecond={true} 
                             />
                             <button
                               type="button"
                               className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 ml-2"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setShowSopDetailModal({ open: true, fileName: row.sop_name, content: row.markdown_content, sopData: row });
                               }}
                               aria-label={t('complianceAi.reportView.showDetails')}
                             >
                               <ChevronRight className="w-5 h-5 text-[#495464]" />
                             </button>
                           </div>
                         </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {sopRows.length > 0 && (
            <div className="mt-4">
              <Pagination
                current={sopPage}
                onChange={setSopPage}
                total={sopRows.length}
                limit={sopLimit}
                onLimitChange={(l) => { setSopLimit(l); setSopPage(0); }}
              />
            </div>
          )}
        </div>

        {/* Gap Analysis Comparison */}
        {!gapAnalysisLoading && gapAnalysisComparison.length > 0 && (
          <div className="bg-white rounded-[20px] border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${styles.textMainColor}`}>{t('complianceAi.reportView.gapAnalysisComparison')}</h2>
          </div>
          <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '50px', maxWidth: '100px' }}>
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '200px', maxWidth: '300px' }}>
                      {t('complianceAi.reportView.oldSopName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '150px', maxWidth: '250px' }}>
                      {t('complianceAi.reportView.newSopName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '250px', maxWidth: '500px' }}>
                      {t('complianceAi.reportView.gapDescription')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '120px', maxWidth: '150px' }}>
                      {t('complianceAi.reportView.oldSeverity')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '120px', maxWidth: '150px' }}>
                      {t('complianceAi.reportView.newSeverity')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '180px', maxWidth: '240px' }}>
                      {t('complianceAi.analysisTable.createdBy')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '120px', maxWidth: '150px' }}>
                      {t('complianceAi.reportView.change')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gapAnalysisComparison.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">{t('complianceAi.reportView.noGapAnalysisData')}</td>
                    </tr>
                  ) : (
                    gapAnalysisComparison.slice(gapAnalysisPage * gapAnalysisLimit, gapAnalysisPage * gapAnalysisLimit + gapAnalysisLimit).map((row, idx: number) => (
                      <tr className="hover:bg-gray-50" key={idx}>
                        <td className="px-6 py-4 whitespace-normal" style={{ minWidth: '50px', maxWidth: '100px' }}>
                          <div>
                            <div className={`text-sm font-medium ${styles.textMainColor}`}>
                              {row.original_gap_id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-normal" style={{ minWidth: '200px', maxWidth: '300px' }}>
                          <div>
                            <div className={`text-sm font-medium break-words ${styles.textMainColor}`}>
                              {row.old_sop_name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-[#495464]" style={{ minWidth: '150px', maxWidth: '250px' }}>
                          <div className={`text-sm font-medium break-words ${styles.textMainColor}`}>
                            {row.new_sop_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#495464]" style={{ minWidth: '250px', maxWidth: '500px' }}>
                          <Markdown content={row.gap_description} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ minWidth: '120px', maxWidth: '150px' }}>
                          <StatusBadge 
                            status={row.old_severity}
                            styleSecond={true} 
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ minWidth: '120px', maxWidth: '150px' }}>
                          <StatusBadge 
                            status={row.new_severity}
                            styleSecond={true} 
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-[#495464]" style={{ minWidth: '180px', maxWidth: '240px' }}>
                          <div className={`text-sm font-medium break-words ${styles.textMainColor}`}>
                            {row.created_by}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ minWidth: '120px', maxWidth: '150px' }}>
                          <StatusBadge 
                            status={row.severity_change}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {gapAnalysisComparison.length > 0 && (
            <div className="mt-4">
              <Pagination
                current={gapAnalysisPage}
                onChange={setGapAnalysisPage}
                total={gapAnalysisComparison.length}
                limit={gapAnalysisLimit}
                onLimitChange={(l) => { setGapAnalysisLimit(l); setGapAnalysisPage(0); }}
              />
            </div>
          )}
        </div>
        )}
      </div>



      {/* Modal SOP Details */}
      <Modal
        isShow={showSopDetailModal.open}
        onClose={() => {
          setShowSopDetailModal({ open: false, fileName: null, content: null, sopData: null });
          setModalSelectedFiles([]);
        }}
        title={showSopDetailModal.fileName || ''}
        closable
        wrapperClassName="!p-0"
        className="!max-w-[1200px] w-full"
        outsidePadding="px-[3rem]"
      >
        <div className="mt-6 mb-6 border-t" style={{ borderTopColor: '#E7E8EA', borderTopWidth: 1 }} />
        <div className="mb-6 bg-white rounded-[20px] border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('complianceAi.reportView.field')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('complianceAi.reportView.value')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {showSopDetailModal.content ? (
                  parseMarkdownTable(showSopDetailModal.content).map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-[#495464] font-semibold">{item.field}</td>
                      <td className="px-6 py-4 text-[#495464]">{item.value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-gray-500">{t('complianceAi.reportView.noDataAvailable')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Re-analyze Section */}
        <div className="mt-6 mb-6 border-t" style={{ borderTopColor: '#E7E8EA', borderTopWidth: 1 }} />
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${styles.textMainColor}`}>
            {t('complianceAi.reportView.uploadNewSOP')}
          </h3>
          <FileUploader
            title={t('complianceAi.fileUploader.dragAndDrop')}
            onFilesChange={handleModalFilesChange}
            selectedFiles={modalSelectedFiles}
            existingFiles={[]}
          />
          
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="primary"
              onClick={handleReanalyzeSOP}
              disabled={modalSelectedFiles.length === 0 || isReanalyzing}
            >
              {isReanalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('complianceAi.reportView.reAnalyzing')}
                </>
              ) : (
                <>
                  <RiRestartFill className="mr-2 h-4 w-4" />
                  {t('complianceAi.reportView.reAnalyzeSOP')}
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportView; 
