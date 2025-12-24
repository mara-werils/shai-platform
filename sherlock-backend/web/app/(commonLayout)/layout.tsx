import React from 'react'
import type { ReactNode } from 'react'
import SwrInitializer from '@/app/components/swr-initializer'
import { AppContextProvider } from '@/context/app-context'
import HeaderWrapper from '@/app/components/header/header-wrapper'
import Header from '@/app/components/header'
import { EventEmitterContextProvider } from '@/context/event-emitter'
import { ProviderContextProvider } from '@/context/provider-context'
import { ModalContextProvider } from '@/context/modal-context'
import GotoAnything from '@/app/components/goto-anything'
import Zendesk from '@/app/components/base/zendesk'
import ReadmePanel from '@/app/components/plugins/readme-panel'
import Splash from '../components/splash'
import ThemeChecker from '@/app/components/theme-checker'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SwrInitializer>
        <AppContextProvider>
          <ThemeChecker />
          <EventEmitterContextProvider>
            <ProviderContextProvider>
              <ModalContextProvider>
                <HeaderWrapper>
                  <Header />
                </HeaderWrapper>
                {children}
                <ReadmePanel />
                <GotoAnything />
                <Splash />
              </ModalContextProvider>
            </ProviderContextProvider>
          </EventEmitterContextProvider>
        </AppContextProvider>
        <Zendesk />
      </SwrInitializer>
    </>
  )
}
export default Layout
