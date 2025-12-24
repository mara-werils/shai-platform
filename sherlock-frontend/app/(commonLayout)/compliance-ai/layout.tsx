'use client'

import React from 'react';
import { useAppContext } from '@/context/app-context';
import Loading from '@/app/components/base/loading';
import { notFound } from 'next/navigation';

type ComplianceAILayoutProps = {
  children: React.ReactNode;
};

const ComplianceAILayout = ({ children }: ComplianceAILayoutProps) => {
  const { userProfile, currentWorkspace, isLoadingCurrentWorkspace } = useAppContext();

  if (!userProfile?.id || isLoadingCurrentWorkspace) {
    return <Loading type="app" />;
  }

  // Check compliance_ai access
  if (currentWorkspace?.compliance_ai_enabled === false) {
    notFound();
  }

  return (
    <div className="relative flex h-0 shrink-0 grow overflow-hidden">
      <div className="relative flex grow flex-col overflow-y-auto bg-background-body">
        {children}
      </div>
    </div>
  );
};

export default ComplianceAILayout; 