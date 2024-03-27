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
  <div>
    <p>
      {{ filterDescription }}
      <a href="#" @click.prevent="() => (filterRef = defaultFilter)">Reset</a>
    </p>
    <textarea class="filter-textarea" v-model="filterRef"></textarea>
  </div>
  <table>
    <colgroup>
      <col span="1" class="order" />
      <col span="1" class="content" />
      <col span="1" class="weight" />
      <col span="1" class="enabled" />
    </colgroup>
    <thead>
      <th>No.</th>
      <th>Content</th>
      <th>Weight</th>
      <th>Enabled</th>
    </thead>
    <tbody>
      <template v-for="(item, index) in items">
        <tr v-if="item.weight > 0">
          <td>{{ index + 1 }}</td>
          <td>{{ item.key }}</td>
          <td>{{ item.weight.toFixed(2) }}</td>
          <td>
            <input type="checkbox" v-model="item.enabled" :id="item.key" />
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  filter: {
    type: Array,
    default: () => []
  },
  filterDescription: {
    type: String
  },
  items: {
    type: Array,
    required: true
  }
})

const defaultFilter = props.filter.join(' ')
const filterRef = ref(defaultFilter)

watch(filterRef, () => {
  props.filter.length = 0
  props.filter.push(...filterRef.value.split(/\s+/))
})
</script>
