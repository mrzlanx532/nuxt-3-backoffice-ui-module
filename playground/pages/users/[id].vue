<script setup lang="ts">
import { useRoute, usePage } from '#imports'

import Detail from '#backoffice-ui/components/Detail.vue'
import Button from '#backoffice-ui/components/Button.vue'
import UserForm from '~/modals/users/UserForm.vue'
import Badge from '#backoffice-ui/components/Browser/ColumnComponents/Badge.vue'

const route = useRoute()

const {
  item,

  onClickEdit,
  onClickDelete,
  onItemUpdated,

  SSRLoadDetail
} = usePage()

const infoSection = {
  title: 'Инфо',
  rows: [
    {
      title: 'ID',
      name: 'id'
    },
    {
      title: 'Имя',
      name: 'name'
    },
    {
      title: 'E-mail',
      name: 'email'
    },
    {
      title: 'Телефон',
      name: 'phone',
    },
    {
      title: 'О себе',
      name: 'about',
    },
  ]
}

const companySection = {
  title: 'Компания',
  rows: [
    {
      title: 'Название',
      name: 'company_name'
    },
    {
      title: 'Направление работы компании',
      name: 'company_business_type_id',
      toFormat: (item: any) => {
        return item?.company_business_type?.name_ru
      }
    },
    {
      title: 'Должность',
      name: 'job_title'
    },
    {
      title: 'Адрес',
      name: 'company_address'
    },
    {
      title: 'Индекс',
      name: 'company_index'
    },
    {
      title: 'Страна',
      name: 'company_country',
      toFormat: (item: any) => {
        return item?.company_country?.name_ru;
      }
    },
    {
      title: 'Город',
      name: 'company_city'
    },
    {
      title: 'Сайт компании',
      name: 'company_url'
    },
    {
      title: 'Добавлен',
      name: 'created_at',
      preset: { name: 'timestampToFormatPreset' }
    },
    {
      title: 'Изменен',
      name: 'updated_at',
      preset: { name: 'timestampToFormatPreset' }
    },
  ]
}

const subscriptionSection = {
  title: 'Подписка',
  rows: [
    {
      title: 'Тип',
      name: 'subscription_type',
      component: Badge,
      toFormat(item: IItem) {

        const mapper: Record<string, string> = {
          NONE: '--default',
          ONLY_MUSIC: '--success',
          ONLY_SOUNDS: '--success',
          MUSIC_AND_SOUNDS: '--success'
        }

        return {
          title: item?.subscription_type?.title,
          class: mapper[item?.subscription_type?.id]
        }
      },
    },
    {
      name: 'subscription_till',
      title: 'Дата окончания подписки',
      toFormat(item) {
        if (!item.subscription_till) {
          return '-'
        }

        return item?.subscription_till
      }
    },
  ]
}

const subscriptionExclusiveSection = {
  title: 'Подписка на эксклюзивные треки',
  rows: [
    {
      name: 'condition',
      title: 'Условия',
      class: 6,
      toFormat(item) {
        return 'Активна только при действующей подписке на музыку';
      }
    },
    {
      name: 'subscription_till_for_exclusive_tracks',
      title: 'Дата окончания подписки',
      class: 6,
      toFormat(item) {
        if (!item.subscription_till_for_exclusive_tracks) {
          return '-'
        }

        return item?.subscription_till_for_exclusive_tracks
      }
    },
  ]
}

const sections = ref([
  infoSection,
  companySection,
  subscriptionSection,
  subscriptionExclusiveSection
])

await SSRLoadDetail(item, 'users/detail', route.params.id)
</script>

<template>
  <Detail
      :sections="sections"
      :item="item"
      back-link="/users"
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
        })" :class="['--small --outline-primary']">Изменить</Button>
        <Button @click="onClickDelete({
          deleteURL: 'users/delete',
          notificationMessage: 'Пользователь удален'
        })" :class="['--small --outline-danger']">Удалить</Button>
      </div>
    </template>
  </Detail>
</template>
