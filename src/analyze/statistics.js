import { AnalyzePhrase, AnalyzeWord } from './item'

function isAsciiOnly(str) {
  return /^[\x00-\x7F]*$/.test(str)
}

export default class HotKeywordAnalyzeStatistics {
  _sheets = {}
  _phrases = null

  constructor() {}

  get digests() {
    return Object.keys(this._sheets)
  }

  get sheets() {
    return Object.values(this._sheets)
  }

  get dataArray() {
    return this.sheets.flatMap((sheet) => (sheet.enabled ? sheet.dataArray : []))
  }

  get phrases() {
    if (this._phrases) {
      return this._phrases
    }
    this._phrases = this.dataArray.reduce((acc, data) => {
      const phraseKey = data['kw']
      const phrase = (acc[phraseKey] ??= new AnalyzePhrase(phraseKey))
      phrase.increase(data)
      return acc
    }, {})
    return this._phrases
  }

  resetPhrases() {
    this._phrases = null
  }

  get words() {
    return Object.values(this.phrases).reduce((acc, phrase) => {
      if (!phrase.enabled) {
        return acc
      }
      phrase.words.map((word) => {
        const w = (acc[word] ??= new AnalyzeWord(word))
        w?.increase(phrase.wordWeight)
      })
      return acc
    }, {})
  }

  add(sheet) {
    this._sheets[sheet.digest] ??= sheet
    this.resetPhrases()
  }

  remove(digest) {
    delete this._sheets[digest]
    this.resetPhrases()
  }
}
