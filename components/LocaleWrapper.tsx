'use client'

import { LocaleProvider } from '@/contexts/LocaleContext'
import LanguagePicker from './LanguagePicker'

export default function LocaleWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <LanguagePicker />
      {children}
    </LocaleProvider>
  )
}
