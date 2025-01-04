<script setup lang="ts">
import { useRoute, usePage } from '#imports'

import Detail from '../../../src/runtime/components/base/Detail.vue'
import Button from '../../../src/runtime/components/base/Button.vue'
import UserForm from '../../modals/users/UserForm.vue'

const route = useRoute()

const {
  item,

  onClickEdit,
  onClickDelete,
  onItemUpdated,

  SSRLoadDetail
} = usePage()

const sections = ref([

])

await SSRLoadDetail(item, 'users/detail', route.params.id)
</script>

<template>
  <Detail
      :sections="sections"
      :item="item"
      back-link="users"
      entity-name="Пользователь"
      @itemUpdated="onItemUpdated"
  >
    <template #actions>
      <div class="btn__group">
        <Button @click="onClickEdit({
          formURL: 'users/form',
          modalComponent: UserForm,
          modalTitle: 'Изменение пользователя',
          notificationMessage: 'Пользователь изменен'
        })" :class="['--big --outline-primary']">Изменить</Button>
        <Button @click="onClickDelete({
          deleteURL: 'users/delete',
          notificationMessage: 'Пользователь удален'
        })" :class="['--big --outline-danger']">Удалить</Button>
      </div>
    </template>
  </Detail>
</template>
