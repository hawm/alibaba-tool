// stores/files.js
import { defineStore } from 'pinia'
import { digestFile } from '@/utils/digest'

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: {}
  }),
  actions: {
    addFiles(files) {
      files.forEach((f) => {
        digestFile(f).then((digest) => {
          this.files[digest] ??= f
        })
      })
    },
    removeFile(digest) {
      return delete this.files[digest]
    }
  },
  getters: {
    all: (state) => state.files
  }
})
