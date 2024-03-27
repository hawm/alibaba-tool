<template>
  <div>
    <input
      type="file"
      ref="fileInputRef"
      style="display: none"
      :accept="props.acceptedTypes"
      multiple
      @change="handleFileChange"
    />
    <button @click="openFileSelector">Add Files</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInputRef = ref(null)

const props = defineProps({
  addFiles: {
    type: Function,
    required: true
  },

  acceptedTypes: {
    type: Array,
    default: () => []
  }
})

function openFileSelector() {
  fileInputRef.value.click()
}

function handleFileChange(event) {
  const files = Array.from(event.target.files)
  if (files.length === 0) return
  if (props.acceptedTypes.length > 0) {
    // Filter files based on accepted types
    const filteredFiles = files.filter((file) => {
      const fileType = file.type || ''
      const fileName = file.name || ''
      return props.acceptedTypes.some((type) => {
        return fileType.startsWith(type) || fileName.endsWith(type)
      })
    })
    props.addFiles(filteredFiles)
  } else {
    // If no specific types are accepted, add all files
    props.addFiles(files)
  }
  event.target.value = '' // Clear the file input
}
</script>
