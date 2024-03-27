<script setup>
import FileAnalyze from './components/FileAnalyze.vue'
import FileSelector from './components/FileSelector.vue'
</script>
<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>

<template>
  <div class="container">
    <h1>Alibaba.com Hot Keyword Analyze</h1>
    <FileAnalyze>
      <template v-slot="{ addFiles, acceptedTypes }">
        <FileSelector :addFiles :acceptedTypes />
      </template>
    </FileAnalyze>
  </div>
</template>
