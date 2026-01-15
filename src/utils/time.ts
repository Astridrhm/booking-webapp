export const timeSlot: string[] = (() => {
  const slots: string[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, '0')
      const m = minute.toString().padStart(2, '0')
      slots.push(`${h}:${m}`)
    }
  }
  return slots
})()

export const splitTime = (time: string): number => {
  if (!time) return 0

  const [hourStr, minuteStr] = time.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)

  if (isNaN(hour) || isNaN(minute)) return 0

  return hour * 60 + minute
}

export const formatTime = (time: Date): string => {
  return new Date(time).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace('.', ':')
}

export const formatDateForQuery = (date: Date, type?: ['date', 'datetime']) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  const split = localDate.toISOString().split("T")

  if (!type) return `${split[0]}`
  
  if (type[0]) {
    return `${split[0]}`
  } else if(type[1]) {
    return `${split[0]} ${split[1]}`
  }
}

export const getSelectedDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const formatted = `${year}-${month}-${day}`
  return formatted
}

export const getCurrenttimeSlot = (): string => {
  const now = new Date()
  const hour = now.getHours()
  const minutes = now.getMinutes()
  const interval = 15
  const roundedMinutes = Math.floor(minutes / interval) * interval
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(hour)}:${pad(roundedMinutes)}`
}

