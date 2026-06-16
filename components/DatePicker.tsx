'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_SHORT = ['Mo','Tu','We','Th','Fr','Sa','Su']

interface DatePickerProps {
  value?: Date | null
  onChange?: (d: Date) => void
  startDate?: Date | null
  endDate?: Date | null
  onRangeChange?: (start: Date | null, end: Date | null) => void
  min?: Date
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function firstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export default function DatePicker({ value, onChange, startDate, endDate, onRangeChange, min }: DatePickerProps) {
  const today = new Date()
  const initDate = value ?? startDate ?? today
  const [viewYear, setViewYear] = useState(initDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initDate.getMonth())
  const [mode, setMode] = useState<'single' | 'range'>('single')
  const [pickingEnd, setPickingEnd] = useState(false)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const count = daysInMonth(viewYear, viewMonth)
  const offset = firstWeekday(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const handleDayClick = (date: Date) => {
    if (mode === 'single') {
      onChange?.(date)
      return
    }
    // Range mode
    if (!pickingEnd || !startDate) {
      onRangeChange?.(date, null)
      setPickingEnd(true)
    } else {
      const s = stripTime(startDate)
      const d = stripTime(date)
      if (d < s) {
        // Before start → set as new start
        onRangeChange?.(date, null)
        setPickingEnd(true)
      } else if (isSameDay(d, s)) {
        // Same as start → reset
        onRangeChange?.(null, null)
        setPickingEnd(false)
      } else {
        onRangeChange?.(startDate, date)
        setPickingEnd(false)
      }
      setHoverDate(null)
    }
  }

  const switchMode = (m: 'single' | 'range') => {
    setMode(m)
    setPickingEnd(false)
    setHoverDate(null)
    if (m === 'single') {
      onRangeChange?.(null, null)
    } else {
      onChange?.(today)
    }
  }

  const inRange = (date: Date) => {
    if (!startDate || !endDate) return false
    const d = stripTime(date)
    return d > stripTime(startDate) && d < stripTime(endDate)
  }

  const isPreview = (date: Date) => {
    if (!startDate || endDate || !hoverDate || !pickingEnd) return false
    const d = stripTime(date)
    const s = stripTime(startDate)
    const h = stripTime(hoverDate)
    if (h <= s) return false
    return d > s && d < h
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="bg-surface-2 border border-white/10 rounded p-4 select-none">
      {/* Mode toggle */}
      <div className="flex border border-white/10 rounded overflow-hidden mb-4">
        {(['single', 'range'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={[
              'flex-1 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors duration-200',
              mode === m ? 'bg-primary/10 text-primary' : 'text-muted hover:text-primary/70',
            ].join(' ')}
          >
            {m === 'single' ? 'Single date' : 'Date range'}
          </button>
        ))}
      </div>

      {/* Month / year navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary transition-colors duration-150"
          aria-label="Previous month"
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <span className="font-mono text-[12px] tracking-[0.22em] uppercase text-primary">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary transition-colors duration-150"
          aria-label="Next month"
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {DAYS_SHORT.map(d => (
          <div key={d} className="font-mono text-[10px] tracking-[0.12em] text-muted/50 text-center py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: count }).map((_, i) => {
          const day = i + 1
          const date = new Date(viewYear, viewMonth, day)
          const disabled = min ? stripTime(date) < stripTime(min) : false
          const isTod = isSameDay(date, today)

          // State flags
          const isSingleSelected = mode === 'single' && value ? isSameDay(date, value) : false
          const isStart = mode === 'range' && startDate ? isSameDay(date, startDate) : false
          const isEnd = mode === 'range' && endDate ? isSameDay(date, endDate) : false
          const isIn = mode === 'range' && inRange(date)
          const isPrev = mode === 'range' && isPreview(date)
          const selected = isSingleSelected || isStart || isEnd

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && handleDayClick(date)}
              onMouseEnter={() => mode === 'range' && pickingEnd && !disabled && setHoverDate(date)}
              onMouseLeave={() => mode === 'range' && setHoverDate(null)}
              className={[
                'font-mono text-[12px] py-1.5 text-center relative transition-colors duration-100',
                selected
                  ? 'bg-accent text-bg font-bold rounded-sm'
                  : (isIn || isPrev)
                    ? 'bg-accent/15 text-primary rounded-none'
                    : !disabled
                      ? 'text-primary hover:bg-white/8 cursor-pointer rounded-sm'
                      : 'text-muted/25 cursor-not-allowed',
              ].join(' ')}
              aria-label={date.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              aria-pressed={selected}
            >
              {day}
              {isTod && !selected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected date display */}
      <div className="mt-4 pt-3 border-t border-white/5 min-h-[28px]">
        {mode === 'single' && value && (
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted text-center">
            {formatDate(value)}
          </p>
        )}
        {mode === 'range' && (startDate || endDate) && (
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted text-center">
            {startDate ? formatDate(startDate) : '—'}
            {' → '}
            {endDate ? formatDate(endDate) : (pickingEnd ? 'Select end date' : '—')}
          </p>
        )}
        {mode === 'range' && !startDate && (
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted/50 text-center">
            Select start date
          </p>
        )}
      </div>
    </div>
  )
}
