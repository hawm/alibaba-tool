import * as XLSX from 'xlsx'

export async function loadWorkbook(file) {
  return XLSX.read(await file.arrayBuffer())
}

export async function loadFirstSheet(file) {
  const workbook = await loadWorkbook(file)
  return workbook.Sheets[workbook.SheetNames[0]]
}

export function NormalizeCellNumber(cellDataString) {
  // number regex rule
  const rule = /^(-?\d+\.?\d*)(%)?$/
  const match = rule.exec(cellDataString)
  if (!match) {
    return 0
  }
  if (match[2]) {
    // percentage
    return Number(match[1]) / 100
  }
  return Number(match[1])
}
