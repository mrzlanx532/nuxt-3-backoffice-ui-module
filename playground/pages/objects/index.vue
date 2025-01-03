<script setup lang="ts">
import { definePageMeta } from '#imports'
import Button from '../../../src/runtime/components/base/Button.vue'
import Browser from '../../../src/runtime/components/base/Browser/Browser.vue'
import Picture from '../../../src/runtime/components/base/Browser/ColumnComponents/Picture.vue'
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
      {{ item ? item.id : undefined }}
    </template>
  </Browser>
</template>
