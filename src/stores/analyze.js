import { defineStore } from 'pinia'
import HotKeywordSheetAnalyze from '@/analyze/hot-keyword-sheet-analyze'
import { digestFile } from '@/utils/digest'

export const useAnalyzeStore = defineStore('hot-keyword-file-analyze', {
  state: () => ({
    files: {}
  }),

  actions: {
    add(digest, analyze) {},

    remove(digest) {
      delete this.files[digest]
    }
  },

  getters: {
    all: (state) => state.files
  }
})
