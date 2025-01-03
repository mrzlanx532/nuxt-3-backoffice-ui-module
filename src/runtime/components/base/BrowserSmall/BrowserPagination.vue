<script setup lang="ts">
const emit = defineEmits(['changePage'])

import BrowserPagination from '~/components/Base/Browser/BrowserPagination.vue'

const props = withDefaults(defineProps<{
  total?: number,
  page?: number,
}>(), {
  total: 0,
  page: 1
})

const onChangePage = (page: number): void => {
  emit('changePage', page)
}
</script>

<template>
  <div class="browser-small__paginator">
    <div class="browser-small__total">
      Всего: {{props.total}}
    </div>
    <BrowserPagination
        @change-page="onChangePage"
        :page="props.page"
        :per-page="10"
        :total="props.total"
        style="margin-top: 10px;"
    />
  </div>
</template>
