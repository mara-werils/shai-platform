import RoutePrefixHandle from './routePrefixHandle'
import type { Viewport } from 'next'
import I18nServer from './components/i18n-server'
import BrowserInitializer from './components/browser-initializer'
import SentryInitializer from './components/sentry-initializer'
import { getLocaleOnServer } from '@/i18n-config/server'
import { TanstackQueryInitializer } from '@/context/query-client'
import { ThemeProvider } from 'next-themes'
import './styles/globals.css'
import './styles/markdown.scss'
import GlobalPublicStoreProvider from '@/context/global-public-context'
import { DatasetAttr } from '@/types/feature'
import { Instrument_Serif } from 'next/font/google'
import cn from '@/utils/classnames'
import Script from 'next/script'
import LayoutInitializer from './layout-initializer'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
}

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
})

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()

  const datasetMap: Record<DatasetAttr, string | undefined> = {
    [DatasetAttr.DATA_API_PREFIX]: process.env.NEXT_PUBLIC_API_PREFIX,
    [DatasetAttr.DATA_PUBLIC_API_PREFIX]: process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX,
    [DatasetAttr.DATA_MARKETPLACE_API_PREFIX]: process.env.NEXT_PUBLIC_MARKETPLACE_API_PREFIX,
    [DatasetAttr.DATA_MARKETPLACE_URL_PREFIX]: process.env.NEXT_PUBLIC_MARKETPLACE_URL_PREFIX,
    [DatasetAttr.DATA_SHAI_MARKETPLACE_API_PREFIX]: process.env.NEXT_PUBLIC_SHAI_MARKETPLACE_API_PREFIX,
    [DatasetAttr.DATA_SHAI_MARKETPLACE_URL_PREFIX]: process.env.NEXT_PUBLIC_SHAI_MARKETPLACE_URL_PREFIX,
    [DatasetAttr.DATA_PUBLIC_EDITION]: process.env.NEXT_PUBLIC_EDITION,
    [DatasetAttr.DATA_PUBLIC_SUPPORT_MAIL_LOGIN]: process.env.NEXT_PUBLIC_SUPPORT_MAIL_LOGIN,
    [DatasetAttr.DATA_PUBLIC_SENTRY_DSN]: process.env.NEXT_PUBLIC_SENTRY_DSN,
    [DatasetAttr.DATA_PUBLIC_MAINTENANCE_NOTICE]: process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE,
    [DatasetAttr.DATA_PUBLIC_SITE_ABOUT]: process.env.NEXT_PUBLIC_SITE_ABOUT,
    [DatasetAttr.DATA_PUBLIC_TEXT_GENERATION_TIMEOUT_MS]: process.env.NEXT_PUBLIC_TEXT_GENERATION_TIMEOUT_MS,
    [DatasetAttr.DATA_PUBLIC_MAX_TOOLS_NUM]: process.env.NEXT_PUBLIC_MAX_TOOLS_NUM,
    [DatasetAttr.DATA_PUBLIC_MAX_PARALLEL_LIMIT]: process.env.NEXT_PUBLIC_MAX_PARALLEL_LIMIT,
    [DatasetAttr.DATA_PUBLIC_TOP_K_MAX_VALUE]: process.env.NEXT_PUBLIC_TOP_K_MAX_VALUE,
    [DatasetAttr.DATA_PUBLIC_INDEXING_MAX_SEGMENTATION_TOKENS_LENGTH]: process.env.NEXT_PUBLIC_INDEXING_MAX_SEGMENTATION_TOKENS_LENGTH,
    [DatasetAttr.DATA_PUBLIC_LOOP_NODE_MAX_COUNT]: process.env.NEXT_PUBLIC_LOOP_NODE_MAX_COUNT,
    [DatasetAttr.DATA_PUBLIC_MAX_ITERATIONS_NUM]: process.env.NEXT_PUBLIC_MAX_ITERATIONS_NUM,
    [DatasetAttr.DATA_PUBLIC_MAX_TREE_DEPTH]: process.env.NEXT_PUBLIC_MAX_TREE_DEPTH,
    [DatasetAttr.DATA_PUBLIC_ALLOW_UNSAFE_DATA_SCHEME]: process.env.NEXT_PUBLIC_ALLOW_UNSAFE_DATA_SCHEME,
    [DatasetAttr.DATA_PUBLIC_ENABLE_WEBSITE_JINAREADER]: process.env.NEXT_PUBLIC_ENABLE_WEBSITE_JINAREADER,
    [DatasetAttr.DATA_PUBLIC_ENABLE_WEBSITE_FIRECRAWL]: process.env.NEXT_PUBLIC_ENABLE_WEBSITE_FIRECRAWL,
    [DatasetAttr.DATA_PUBLIC_ENABLE_WEBSITE_WATERCRAWL]: process.env.NEXT_PUBLIC_ENABLE_WEBSITE_WATERCRAWL,
    [DatasetAttr.DATA_PUBLIC_ENABLE_SINGLE_DOLLAR_LATEX]: process.env.NEXT_PUBLIC_ENABLE_SINGLE_DOLLAR_LATEX,
    [DatasetAttr.NEXT_PUBLIC_ZENDESK_WIDGET_KEY]: process.env.NEXT_PUBLIC_ZENDESK_WIDGET_KEY,
    [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_ENVIRONMENT]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_ENVIRONMENT,
    [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_VERSION]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_VERSION,
    [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_EMAIL]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_EMAIL,
    [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_WORKSPACE_ID]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_WORKSPACE_ID,
    [DatasetAttr.NEXT_PUBLIC_ZENDESK_FIELD_ID_PLAN]: process.env.NEXT_PUBLIC_ZENDESK_FIELD_ID_PLAN,
  }

  return (
    <html lang={locale ?? 'en'} className={cn('h-full', instrumentSerif.variable)} suppressHydrationWarning>
      <head>
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <meta name="theme-color" content="#1C64F2" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/*<meta name="apple-mobile-web-app-title" content="Shai" />*/}
        {/*<link rel="apple-touch-icon" href="/apple-touch-icon.png" />*/}
        {/*<link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />*/}
        {/*<link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />*/}
        {/*<meta name="msapplication-TileColor" content="#1C64F2" />*/}
        {/*<meta name="msapplication-config" content="/browserconfig.xml" />*/}

        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-T6J6SRP7LM"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T6J6SRP7LM');
          `,
          }}
        />

        {/* Yandex Metrika */}
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(100882374, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/100882374"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>

        {/* GTM Script */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W3JWMWJ5');`,
          }}
        />

        {/* Meta Pixel Code */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1545276350049550');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1545276350049550&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body
        className='color-scheme h-full select-auto'
        {...datasetMap}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W3JWMWJ5"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <LayoutInitializer />
        <ThemeProvider
          attribute='data-theme'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
          enableColorScheme={false}
        >
          <BrowserInitializer>
            <SentryInitializer>
              <TanstackQueryInitializer>
                <I18nServer>
                  <GlobalPublicStoreProvider>
                    {children}
                  </GlobalPublicStoreProvider>
                </I18nServer>
              </TanstackQueryInitializer>
            </SentryInitializer>
          </BrowserInitializer>
        </ThemeProvider>
        <RoutePrefixHandle />
      </body>
    </html>
  )
}

export default LocaleLayout
