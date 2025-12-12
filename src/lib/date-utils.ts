export const MONTHS = [
  { value: '01', label: 'Январь' },
  { value: '02', label: 'Февраль' },
  { value: '03', label: 'Март' },
  { value: '04', label: 'Апрель' },
  { value: '05', label: 'Май' },
  { value: '06', label: 'Июнь' },
  { value: '07', label: 'Июль' },
  { value: '08', label: 'Август' },
  { value: '09', label: 'Сентябрь' },
  { value: '10', label: 'Октябрь' },
  { value: '11', label: 'Ноябрь' },
  { value: '12', label: 'Декабрь' }
] as const

export function generateYears(startYear: number = 1930): string[] {
  const currentYear = new Date().getFullYear()
  const years: string[] = []
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year.toString())
  }
  return years
}

export function getDaysInMonth(month: string, year: string): number {
  if (!month || month === 'not-set' || !year || year === 'not-set') {
    return 31
  }
  return new Date(parseInt(year), parseInt(month), 0).getDate()
}

interface FormatPeriodOptions {
  startMonth?: string
  startYear?: string
  endMonth?: string
  endYear?: string
  isCurrent?: boolean
}

export function formatPeriod(options: FormatPeriodOptions): string {
  const { startMonth, startYear, endMonth, endYear, isCurrent } = options

  if (!startYear || startYear === 'not-set') {
    return ''
  }

  const startMonthLabel = startMonth && startMonth !== 'not-set'
    ? MONTHS.find(m => m.value === startMonth)?.label
    : ''
  const start = startMonthLabel ? `${startMonthLabel} ${startYear}` : startYear

  if (isCurrent) {
    return `${start} - Present`
  }

  if (endYear && endYear !== 'not-set') {
    const endMonthLabel = endMonth && endMonth !== 'not-set'
      ? MONTHS.find(m => m.value === endMonth)?.label
      : ''
    const end = endMonthLabel ? `${endMonthLabel} ${endYear}` : endYear
    return `${start} - ${end}`
  }

  return start
}

export function calculateAge(birthDate: string): number | null {
  try {
    const parts = birthDate.split('-')
    if (parts.length !== 3) return null

    const year = parseInt(parts[0])
    const month = parseInt(parts[1]) - 1
    const day = parseInt(parts[2])

    if (isNaN(year) || isNaN(month) || isNaN(day)) return null

    const birth = new Date(year, month, day)
    if (isNaN(birth.getTime())) return null

    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  } catch {
    return null
  }
}

export function adjustDayForMonth(day: string, month: string, year: string): string {
  if (day === 'not-set' || month === 'not-set' || year === 'not-set') {
    return day
  }

  const maxDays = getDaysInMonth(month, year)
  const currentDay = parseInt(day)

  if (currentDay > maxDays) {
    return maxDays.toString().padStart(2, '0')
  }

  return day
}

export function formatPostDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  } catch {
    return ''
  }
}

export function generateDays(month: string = '01', year: string = '2000'): string[] {
  const maxDays = getDaysInMonth(month, year)
  const days: string[] = []
  for (let day = 1; day <= maxDays; day++) {
    days.push(day.toString().padStart(2, '0'))
  }
  return days
}

export function getMonthLabel(monthValue: string): string {
  return MONTHS.find(m => m.value === monthValue)?.label || monthValue
}

export function isValidDate(day: string, month: string, year: string): boolean {
  if (day === 'not-set' && month === 'not-set' && year === 'not-set') {
    return false
  }

  if (year !== 'not-set' && month !== 'not-set' && day !== 'not-set') {
    const maxDays = getDaysInMonth(month, year)
    const dayNum = parseInt(day)
    return dayNum >= 1 && dayNum <= maxDays
  }

  return true
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day}.${month}.${year} ${hours}:${minutes}`
  } catch {
    return ''
  }
}

export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}`
  } catch {
    return ''
  }
}
