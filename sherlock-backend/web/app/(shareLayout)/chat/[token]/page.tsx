'use client'
import React, { useEffect } from 'react'
import { changeLanguage } from '@/i18n-config/i18next-config'
import ChatWithHistoryWrap from '@/app/components/base/chat/chat-with-history'
import AuthenticatedLayout from '../../components/authenticated-layout'

const Chat = () => {
  useEffect(() => {
    changeLanguage('en-US');
  }, []);

  return (
    <AuthenticatedLayout>
      <ChatWithHistoryWrap />
    </AuthenticatedLayout>
  )
}

export default React.memo(Chat)
