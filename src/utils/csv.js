// CSV helpers for exporting and importing drink history.
export function exportHistoryCsv(history) {
  const header = 'timestamp'
  const lines = history.map((iso) => iso)
  return [header, ...lines].join('\n')
}

export function parseHistoryCsv(csvText) {
  const lines = csvText.split(/\r?\n/).map((line) => line.trim())
  const dataLines = lines.filter((line) => line && line.toLowerCase() !== 'timestamp')

  return dataLines
    .map((line) => new Date(line))
    .filter((date) => !Number.isNaN(date.getTime()))
    .map((date) => date.toISOString())
}
