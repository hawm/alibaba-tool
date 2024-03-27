<style scoped>
thead {
  position: sticky;
  top: 0;
  background-color: lightgray;
}
table {
  display: block;
  min-height: 300px;
  max-height: 300px;
  overflow-y: auto;
  table-layout: fixed;
}

.order {
  width: 50px;
}
.content {
  width: 400px;
}
.weight {
  width: 100px;
}
.enabled {
  width: 100px;
}

.filter-textarea {
  min-width: 100%;
  max-width: 100%;
  min-height: 50px;
}
</style>

<template>
  <div class="container">
    <h2>Phrases</h2>
    <StatisticsTable
      :filter="phraseFilter"
      filterDescription="Filter phrase include word, separated by space."
      :items="sortedPhrases"
    />

    <h2>Words</h2>
    <StatisticsTable
      :filter="wordFilter"
      filterDescription="Filter words excally equal, separated by space."
      :items="sortedWords"
    />

    <h2>Top Keywords</h2>
    <p>{{ topKeywords }}</p>
    <p>Total: {{ topKeywords.split(/\s/).length }} words, {{ topKeywords.length }} characters</p>
  </div>
</template>

<script setup>
import HotKeywordAnalyzeStatistics from '@/analyze/statistics'
import { computed, reactive, ref, watch } from 'vue'
import StatisticsTable from './StatisticsTable.vue'

const props = defineProps({
  statistics: {
    type: HotKeywordAnalyzeStatistics,
    required: true
  }
})

function sortByWeights(items) {
  return Object.values(items).sort((a, b) => b.weight - a.weight)
}

const phraseFilter = reactive([])
const wordFilter = reactive(['for', 'of', 'with'])

props.statistics.phraseFilter = phraseFilter
props.statistics.wordFilter = wordFilter

watch(phraseFilter, () => {
  props.statistics.phraseFilter = phraseFilter
})

watch(wordFilter, () => {
  props.statistics.wordFilter = wordFilter
})

const sortedPhrases = computed(() => sortByWeights(props.statistics.phrases))
const sortedWords = computed(() => sortByWeights(props.statistics.words))

const topKeywordsLength = 384

const topKeywords = computed(() => {
  let ret = ''
  for (const word of sortedWords.value) {
    if (ret.length + word.key.length > topKeywordsLength) {
      break
    }
    if (!word.enabled) {
      continue
    }
    ret += ` ${word.key}`
  }
  return ret.trim()
})
</script>
