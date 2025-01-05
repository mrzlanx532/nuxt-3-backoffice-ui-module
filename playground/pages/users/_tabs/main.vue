<script setup lang="ts">
import Section from '#backoffice-ui/components/Section.vue'
import FlexTable from '#backoffice-ui/components/FlexTable.vue';

type IItem = {[key: string]: any}

const props = defineProps({
  item: {
    type: Object,
    required: false
  }
})

const detailConfigInfo = ref([
  {
    name: 'name',
    title: 'Имя',
    class: 12
  },
  {
    name: 'email',
    title: 'E-mail',
    class: 6
  },
  {
    name: 'phone',
    title: 'Телефон',
    class: 6,
  },
  {
    name: 'about',
    title: 'О себе',
    class: 12,
  },
])

const detailConfigCompany = ref([
  {
    name: 'company_name',
    title: 'Компания',
    class: 12
  },
  {
    name: 'company_business_type',
    title: 'Направление работы компании',
    class: 6,
    toFormat(item: IItem) {
      return item?.company_business_type?.name_ru
    }
  },
  {
    name: 'job_title',
    title: 'Должность',
    class: 6,
  },
  {
    name: 'company_address',
    title: 'Адрес',
    class: 6,
  },
  {
    name: 'company_index',
    title: 'Индекс',
    class: 6,
  },
  {
    name: 'company_country',
    title: 'Страна',
    class: 6,
    toFormat(item: IItem) {
      return item?.company_country?.name_ru;
    }
  },
  {
    name: 'company_city',
    title: 'Город',
    class: 6,
  },
  {
    name: 'about',
    title: 'Сайт компании',
    class: 12,
  },
  {
    name: 'created_at',
    title: 'Добавлен',
    class: 6,
    preset: {
      name: 'timestampToFormatPreset',
    }
  },
  {
    name: 'updated_at',
    title: 'Изменен',
    class: 6,
    preset: {
      name: 'timestampToFormatPreset',
    }
  },
])
</script>

<template>
  <div class="section__group" v-if="item">
    <Section>
      <template v-slot:header>
        Инфо
      </template>
      <template v-slot:content>
        <FlexTable :config="detailConfigInfo" :item="item"/>
      </template>
    </Section>
    <Section>
      <template v-slot:header>
        Компания
      </template>
      <template v-slot:content>
        <FlexTable :config="detailConfigCompany" :item="item"/>
      </template>
    </Section>
  </div>
</template>
