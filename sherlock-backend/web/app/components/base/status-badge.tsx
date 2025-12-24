import React from 'react';

// Универсальный маппинг статусов к категориям
const STATUS_CATEGORY_MAP: Record<string, 'completed' | 'processing' | 'draft' | 'failed'> = {
  // Критичные/ошибки
  'failed': 'failed',
  'high': 'failed',
  'no coverage': 'failed',
  'hight impact': 'failed',
  'critical': 'failed',
  'major': 'failed',
  'inactive': 'failed',
  'none': 'failed',
  'high impact': 'failed',
  'increased': 'failed',
  // В процессе/major
  'processing': 'processing',
  'in progress': 'processing',
  'partial coverage': 'processing',
  'medium impact': 'processing',
  'moderate': 'processing',
  'medium high': 'processing',
  'medium': 'processing',
  'partial': 'processing',
  'low impact': 'processing',
  'in_progress': 'processing',
  // Завершено
  'completed': 'completed',
  'full coverage': 'completed',
  'compliant': 'completed',
  'active': 'completed',
  'minor': 'completed',
  'low': 'completed',
  'reduced': 'completed',
  // Черновик/минимальный
  'draft': 'draft',
  'no change': 'draft',
};

export interface StatusBadgeProps {
  status: string;
  className?: string;
  styleSecond?: boolean;
  label?: string; // кастомный текст
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', styleSecond = false, label }) => {
  // Категория для цвета
  const category = STATUS_CATEGORY_MAP[status.toLowerCase()] || status.toLowerCase();

  const getStatusColor = (cat: string) => {
    switch (cat) {
      case 'completed':
        return 'text-[#0F8B06]';
      case 'processing':
        return 'text-[#E4791A]';
      case 'draft':
        return 'text-[#495464]';
      case 'failed':
        return 'text-[#DC2626]';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusSecondStyle = (cat: string) => {
    switch (cat) {
      case 'completed':
        return 'bg-[#F5FCF4] border border-[#0F8B06] text-[#0F8B06]';
      case 'processing':
        return 'bg-[#FFF9F2] border border-[#E4791A] text-[#E4791A]';
      case 'draft':
        return 'bg-[#F3F4F6] border border-[#495464] text-[#495464]';
      case 'failed':
        return 'bg-[#FFF7F7] border border-[#E6312D] text-[#E6312D]';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string, label?: string) => {
    if (label) return label;
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'draft':
        return 'Draft';
      case 'failed':
        return 'Failed';
      default:
        // Если статус не стандартный, вернуть как есть (с большой буквы)
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span
      className={
        styleSecond
          ? `text-sm font-medium w-full block text-center rounded-xl px-2 py-1.5 ${getStatusSecondStyle(category)} ${className}`
          : `text-sm font-medium ${getStatusColor(category)} ${className}`
      }
    >
      {getStatusText(status, label)}
    </span>
  );
};

export default StatusBadge; 
