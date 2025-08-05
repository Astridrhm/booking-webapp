export const TimeSlot: string[] = (() => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
})();

export const SplitTime = (time: string): number => {
  if (!time) return 0;

  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return 0;

  return hour * 60 + minute;
};

export const FormatTime = (time: Date): string => {
  return new Date(time).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace('.', ':')
}

export const formatDateForQuery = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0];
};

export const getSelectedDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formatted = `${year}-${month}-${day}`;
  return formatted;
}

export const getCurrentTimeSlot = (): string => {
  const now = new Date()
  const hour = now.getHours()
  const minutes = now.getMinutes()
  const interval = 15
  const roundedMinutes = Math.floor(minutes / interval) * interval
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(hour)}:${pad(roundedMinutes)}`
}

