import { loadFirstSheet } from './utils'
import * as XLSX from 'xlsx'

export default class HotKeywordAnalyzeSheet {
  static isHotKeywordSheet(sheet) {
    return sheet?.['A1']?.['v'] == 'hot search keywords'
  }

  static async loadHotkeywordSheet(file) {
    const sheet = await loadFirstSheet(file)
    if (!this.isHotKeywordSheet(sheet)) {
      return false
    }
    return sheet
  }

  static async loadHotkeywordSheetData(sheet) {
    const data = XLSX.utils.sheet_to_json(sheet, {
      header: [
        'kw', // keyword
        'si', // search index
        'sii', // search index increase
        'cr', // click rate
        'cri', // click rate increase
        'ssi', // seller scale inedx
        'ssii' // seller scale index increase
      ],
      range: 6 // offset
    })
    return data
  }

  // vue proxy wiil not work with private member
  _digest
  _file
  _dataArray = []
  _isHotKeywordSheet = false
  _enabled = true

  constructor(digest, file) {
    this._digest = digest
    this._file = file
  }

  get enabled() {
    return this._enabled
  }

  set enabled(val) {
    this._enabled = val
  }

  get digest() {
    return this._digest
  }

  get filename() {
    return this._file.name
  }

  get isHotKeywordSheet() {
    return this._isHotKeywordSheet
  }

  async load() {
    const sheet = await this.constructor.loadHotkeywordSheet(this._file)

    this._isHotKeywordSheet = !!sheet

    if (!this._isHotKeywordSheet) {
      return false
    }

    this._dataArray = await this.constructor.loadHotkeywordSheetData(sheet)

    if (!this._dataArray) {
      return false
    }

    return true
  }

  get dataArray() {
    return this._dataArray
  }
}
