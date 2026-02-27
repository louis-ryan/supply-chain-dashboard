/**
 * Converts an array of objects to a CSV string and triggers a browser download.
 * @param rows - The data rows to export
 * @param filename - The downloaded file name (without extension)
 */
export function exportCsv<T extends Record<string, unknown>>(rows: T[], filename: string): void {
  if (rows.length === 0) return

  const headers = Object.keys(rows[0])
  const escape = (val: unknown): string => {
    const s = val == null ? '' : String(val)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }

  const csv = [
    headers.join(','),
    ...rows.map(row => headers.map(h => escape(row[h])).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
