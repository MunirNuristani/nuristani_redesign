"use client"
import React, {useState, useEffect} from 'react'
import { ThemeProvider } from '@mui/material'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { createCustomTheme } from './theme'
import { useAppContext } from '@/context/AppContext'


type Props = {
  children: React.ReactNode
}

const CustomThemeProvider = (props: Props) => {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [isRtl, setIsRtl] = useState(false);
  const { children } = props
  const { state } = useAppContext()
  const { language } = state
  
  useEffect(() => {
    setIsRtl(language !== "en");
  },[language])

  useEffect(() => {
    setDirection(isRtl ? "rtl" : "ltr");
  }, [isRtl]);
  
  
  // Create cache for RTL
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  })
  
  const cacheLtr = createCache({
    key: 'muiltr',
    stylisPlugins: [prefixer],
  })
  
  const theme = createCustomTheme(direction)
  
  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  )
}

export default CustomThemeProvider