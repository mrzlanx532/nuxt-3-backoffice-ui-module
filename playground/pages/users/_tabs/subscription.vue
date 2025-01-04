<script setup lang="ts">
import Section from '../../../../src/runtime/components/base/Section.vue'
import FlexTable from '../../../../src/runtime/components/base/FlexTable/FlexTable.vue';
import type { PropType } from 'vue'

type IItem = {[key: string]: any}

defineProps({
  item: {
    type: Object as PropType<IItem>,
    required: false
  }
})

const detailConfigSubscription = ref([
  {
    name: 'subscription_type',
    title: 'Тип',
    class: 6,
    toFormat(item: IItem) {
      return item?.subscription_type?.title;
    }
  },
  {
    name: 'subscription_till',
    title: 'Дата окончания подписки',
    class: 6,
    toFormat(item: IItem) {
      if (!item.subscription_till) {
        return '-'
      }

      return item?.subscription_till
    }
  },
])

const detailConfigSubscriptionExclusiveTracks = ref([
  {
    name: 'condition',
    title: 'Условия',
    class: 6,
    toFormat(item: IItem) {
      return 'Активна только при действующей подписке на музыку';
    }
  },
  {
    name: 'subscription_till_for_exclusive_tracks',
    title: 'Дата окончания подписки',
    class: 6,
    toFormat(item: IItem) {
      if (!item.subscription_till_for_exclusive_tracks) {
        return '-'
      }

      return item?.subscription_till_for_exclusive_tracks
    }
  },
])
</script>

<template>
  <div class="section__group">
    <Section>
      <template v-slot:header>
        Подписка
      </template>
      <template v-slot:content>
        <FlexTable :config="detailConfigSubscription" :item="item"/>
      </template>
    </Section>
    <Section>
      <template v-slot:header>
        Подписка на эксклюзивные треки
      </template>
      <template v-slot:content>
        <FlexTable :config="detailConfigSubscriptionExclusiveTracks" :item="item"/>
      </template>
    </Section>
  </div>
</template>
