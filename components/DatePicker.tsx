'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_SHORT = ['Mo','Tu','We','Th','Fr','Sa','Su']

interface DatePickerProps {
  value: Date | null
  onChange: (d: Date) => void
  min?: Date
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function firstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1 // Monday = 0
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

export default function DatePicker({ value, onChange, min }: DatePickerProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth())

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

  return (
    <div className="bg-surface-2 border border-white/10 rounded p-4 select-none">
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
        {/* Empty cells before first day */}
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}

        {Array.from({ length: count }).map((_, i) => {
          const day = i + 1
          const date = new Date(viewYear, viewMonth, day)
          const selected = value ? isSameDay(date, value) : false
          const isToday = isSameDay(date, today)
          const disabled = min ? date < min : false

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => onChange(date)}
              className={[
                'font-mono text-[12px] py-1.5 text-center rounded-sm transition-colors duration-150 relative',
                selected
                  ? 'bg-accent text-bg font-bold'
                  : !disabled
                    ? 'text-primary hover:bg-white/8 cursor-pointer'
                    : 'text-muted/25 cursor-not-allowed',
              ].join(' ')}
              aria-label={date.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              aria-pressed={selected}
            >
              {day}
              {/* Today indicator */}
              {isToday && !selected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected date display */}
      {value && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted text-center">
            {value.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      )}
    </div>
  )
}
