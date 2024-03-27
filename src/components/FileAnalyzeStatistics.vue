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
    <label>
      <input type="checkbox" v-model="wordNumberOnlyFilter" />Filter number only words
    </label>
    <label>
      <input type="checkbox" v-model="wordOneCharFilter" />Filter single character words
    </label>
    <label> <input type="checkbox" v-model="wordAsciiFilter" />Filter non-ascii only words </label>

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

// phrase
const phraseFilter = reactive([])
const sortedPhrases = computed(() => {
  return sortByWeights(props.statistics.phrases).map((phrase) => {
    if (phraseFilter.some((word) => phrase.words.includes(word))) {
      phrase.enabled = false
    }
    return phrase
  })
})

// word
function isAsciiOnly(str) {
  return /^[\x00-\x7F]*$/.test(str)
}

function isNumberOnly(str) {
  return /^\d+$/.test(str)
}

function isOneCharOnly(str) {
  return str.length == 1
}

const wordFilter = reactive(['for', 'of', 'with'])
const wordNumberOnlyFilter = ref(true)
const wordOneCharFilter = ref(true)
const wordAsciiFilter = ref(true)

const sortedWords = computed(() => {
  return sortByWeights(props.statistics.words).map((word) => {
    if (
      wordFilter.includes(word.key) ||
      (wordNumberOnlyFilter.value && isNumberOnly(word.key)) ||
      (wordOneCharFilter.value && isOneCharOnly(word.key)) ||
      (wordAsciiFilter.value && !isAsciiOnly(word.key))
    ) {
      word.enabled = false
    }
    return word
  })
})

// TODO: create new statistics filter object to do the filter jobs

// top
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
