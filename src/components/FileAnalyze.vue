<style scoped>
thead {
  position: sticky;
  top: 0;
  background-color: lightgray;
}
table {
  display: block;
  max-height: 300px;
  overflow-y: auto;
}

.order {
  width: 50px;
}
.filename {
  width: 400px;
}
.enabled {
  width: 100px;
}
.action {
  width: 100px;
}
</style>

<template>
  <h2>Files</h2>
  <slot :addFiles :acceptedTypes></slot>

  <table v-if="statistics.sheets.length > 0">
    <colgroup>
      <col span="1" class="order" />
      <col span="1" class="filename" />
      <col span="1" class="enabled" />
      <col span="1" class="action" />
    </colgroup>
    <thead>
      <tr>
        <th>No.</th>
        <th>File Name</th>
        <th>Enabled</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(sheet, index) in statistics.sheets" :key="sheet.digest">
        <td>{{ index + 1 }}</td>
        <td>{{ sheet.filename }}</td>
        <td><input type="checkbox" v-model="sheet.enabled" /></td>
        <td>
          <button
            @click="
              () => {
                statistics.remove(sheet.digest)
              }
            "
          >
            Remove
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <FileAnalyzeStatistics :statistics />
</template>

<script setup>
import { reactive, watch } from 'vue'
import { digestFile } from '@/utils/digest'
import HotKeywordAnalyzeSheet from '@/analyze/sheet'
import HotKeywordAnalyzeStatistics from '@/analyze/statistics'
import FileAnalyzeStatistics from './FileAnalyzeStatistics.vue'

const statistics = reactive(new HotKeywordAnalyzeStatistics())

async function addFiles(fileArray) {
  const failedFiles = []
  const duplicatedFiles = []

  for (const file of fileArray) {
    const digest = await digestFile(file)
    if (statistics.digests.includes(digest)) {
      duplicatedFiles.push(file.name)
      continue
    }
    const sheet = new HotKeywordAnalyzeSheet(digest, file)
    await sheet.load()

    if (!sheet.isHotKeywordSheet) {
      failedFiles.push(file.name)
    } else {
      statistics.add(sheet)
    }
  }

  if (failedFiles.length > 0) {
    alert('Ignore not hot keyword sheet files: \n' + failedFiles.join(', '))
  }
  if (duplicatedFiles.length > 0) {
    alert('Ignore duplicated files: \n' + duplicatedFiles.join(', '))
  }
}

watch(
  () => statistics.sheets.map((sheet) => sheet.enabled),
  () => {
    statistics.resetPhrases()
  }
)

const acceptedTypes = ['.xlsx', '.xls']
</script>
