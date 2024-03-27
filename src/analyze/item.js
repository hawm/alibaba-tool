import { NormalizeCellNumber } from './utils'

class AnalyzeItem {
  _enabled = true
  _content = ''
  _weight = 0

  constructor(content) {
    this._content = content
  }

  get key() {
    return this._content
  }

  get weight() {
    return this._weight
  }

  get enabled() {
    return this._enabled
  }

  set enabled(val) {
    this._enabled = val
  }

  toggle() {
    this._enabled = !this._enabled
  }
}

export class AnalyzePhrase extends AnalyzeItem {
  increase(data) {
    const phrase = data['kw']
    if (phrase != this._content) {
      return
    }
    const si = NormalizeCellNumber(data['si'])
    let ssi = NormalizeCellNumber(data['ssi'])
    if (ssi == 0) {
      ssi = 1
    }
    this._weight += (si / ssi) * si
  }

  get words() {
    return this._content.split(' ')
  }

  get wordWeight() {
    return this.weight / this.words.length
  }
}

export class AnalyzeWord extends AnalyzeItem {
  increase(weight) {
    this._weight += weight
  }
}
