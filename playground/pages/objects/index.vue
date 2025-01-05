<script setup lang="ts">
import { definePageMeta } from '#imports'
import Button from '#backoffice-ui/components/Button.vue'
import Browser from '#backoffice-ui/components/Browser.vue'
import Picture from '#backoffice-ui/components/Browser/ColumnComponents/Picture.vue'
import Section from '#backoffice-ui/components/Section.vue'
import FlexTable from '#backoffice-ui/components/FlexTable.vue'
import ObjectForm from '~/modals/objects/ObjectForm.vue'

definePageMeta({
  middleware: ['auth']
})

const {
  browserEl,
  item,

  onClickCreate,
  onClickEdit,
  onClickDelete,
  onItemUpdated
} = usePage()

const columns = shallowRef([
  {
    name: 'id',
    title: 'ID'
  },
  {
    name: 'example_checkbox',
    title: 'Чекбокс',
  },
  {
    name: 'example_date',
    title: 'Date',
  },
  {
    name: 'example_datetime',
    title: 'Datetime',
  },
  {
    name: 'example_editor',
    title: 'Editor',
  },
  {
    name: 'example_input',
    title: 'Input',
  },
  {
    name: 'example_input_file',
    title: 'InputFile',
    component: {
      component: Picture,
      title: 'name',
    }
  },
  {
    name: 'example_select',
    title: 'Select',
  },
  {
    name: 'example_select_wrap',
    title: 'SelectWrap',
  },
  {
    name: 'example_switcher',
    title: 'Switcher',
  },
  {
    name: 'example_textarea',
    title: 'Textarea',
  },
])

const common = ref([
  {
    name: 'example_date',
    title: 'Date',
    class: 6
  },
  {
    name: 'example_datetime',
    title: 'Datetime',
    class: 6
  },
  {
    name: 'example_select',
    title: 'Select',
    class: 6
  },
  {
    name: 'example_select_wrap',
    title: 'SelectWrap',
    class: 6
  },
])

</script>

<template>
  <Browser
    ref="browserEl"
    h1="Объекты"
    url-prefix="objects/browse"
    detail-url-prefix="objects/detail"

    detail-title-property="id"
    detail-subtitle-property="name"

    :columns="columns"

    @itemUpdated="onItemUpdated"
  >
    <template #rightSide>
      <div class="btn__group">
        <Button
          @click="onClickCreate({
              formURL: 'objects/form',
              modalComponent: ObjectForm,
              modalTitle: 'Создание объекта',
              notificationMessage: 'Объект добавлена',
            })"
          :class="['--small --primary']"
        >
          Добавить
        </Button>
      </div>
    </template>
    <template #browserDetailHeader>
      <div class="btn__group">
        <Button
          @click="onClickEdit({
              formURL: 'objects/form',
              modalComponent: ObjectForm,
              modalTitle: 'Редактирование объекта',
              notificationMessage: 'Объект изменена',
            })"
          :class="['--big --outline-primary']"
        >
          Изменить
        </Button>
        <Button
          @click="onClickDelete({
              deleteURL: 'objects/delete',
              notificationMessage: 'Объект удален'}
            )"
          :class="['--big --outline-danger']"
        >
          Удалить
        </Button>
      </div>
    </template>
    <template #browserDetailContent>
      <Section>
        <template v-slot:header>
          Общее
        </template>
        <template v-slot:content>
          <FlexTable :config="common" :item="item"/>
        </template>
      </Section>
    </template>
  </Browser>
</template>
