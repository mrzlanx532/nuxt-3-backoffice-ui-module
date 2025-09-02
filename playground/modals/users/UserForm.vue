<script setup lang="ts">
import { onMounted } from 'vue'
import moment from 'moment'
import { type IUseFormDefaultProps } from '#backoffice-ui/types'

const props = defineProps<IUseFormDefaultProps>()

const emit = defineEmits([
  'modal:resolve',
  'modal:close'
])

const {
  initFormWithTabs,
  input,
  select,
  inputFile,
  checkbox,
  textArea,
  date,
  switcher,
  fillComponents
} = useForm()

const InfoTab = {
  title: 'Инфо',
  formData: [
    input({
      name: 'first_name',
      label: 'Имя',
    }),
    input({
      name: 'last_name',
      label: 'Фамилия',
    }),
    input({
      name: 'email',
      label: 'E-mail',
    }),
    input({
      name: 'phone',
      label: 'Телефон',
      componentData: {
        mask: '+7 (###) ###-##-##'
      }
    }),
    input({
      name: 'password',
      label: 'Пароль',
      hide: !!props.data.id,
      componentData: {
        type: 'password',
      }
    }),
    input({
      name: 'password_confirmation',
      label: 'Подтверждение пароля',
      hide: !!props.data.id,
      componentData: {
        type: 'password'
      }
    }),
    select({
      name: 'locale_id',
      label: 'Язык',
      class: '--full',
    }),
    textArea({
      name: 'about',
      label: 'О себе',
      class: '--full'
    }),
    inputFile({
      name: 'picture',
      label: 'Фотография',
      class: '--full',
      componentData: {
        allowedTypes: ['jpg', 'jpeg', 'png'],
        maxSizeMB: 20
      }
    }),
    checkbox({
      name: 'is_checked',
      hide: !!props.data.id,
      label: 'Согласен с условиями пользовательского соглашения',
      class: '--full'
    })
  ]
}

const CompanyTab = {
  title: 'Компания',
  formClass: '--3x3',
  formData: [
    input({
      name: 'company_name',
      label: 'Название компании',
      class: '--full'
    }),
    select({
      name: 'company_business_type_id',
      label: 'Направление работы компании',
      class: '--full'
    }),
    input({
      name: 'job_title',
      label: 'Должность',
      class: '--full'
    }),
    input({
      name: 'company_url',
      label: 'Сайт компании',
      class: '--full'
    }),
    input({
      name: 'company_address',
      label: 'Адрес',
      class: '--full'
    }),
    input({
      name: 'company_index',
      label: 'Индекс',
      class: '--left'
    }),
    select({
      name: 'company_country_id',
      label: 'Страна',
      class: '--middle'
    }),
    input({
      name: 'company_city',
      label: 'Город',
      class: '--right'
    })
  ]
}

const SubscriptionTab = {
  title: 'Подписка',
  formData: [
    select({
      section: 'Подписка',
      name: 'subscription_type_id',
      label: 'Тип подписки',
      onUpdate(value, findFormDataItemByName) {
        const item = findFormDataItemByName('subscription_labels')

        item.hide = !(['ONLY_MUSIC', 'MUSIC_AND_SOUNDS'].includes(value))

        findFormDataItemByName('subscription_labels').section = item.hide ? undefined : 'Подписка на лейблы'
      },
    }),
    date({
      name: 'subscription_till',
      label: 'Дата истечения',
      componentData: {
        format: 'DD.MM.yyyy'
      }
    }),
    date({
      section: 'Подписка на эксклюзивные треки',
      name: 'subscription_till_for_exclusive_tracks',
      label: 'Дата истечения',
      class: '--full',
      componentData: {
        format: 'DD.MM.yyyy'
      },
    }),
    switcher({
      name: 'remove',
      label: 'Отключить подписку на эксклюзивные треки',
      class: '--full',
      onUpdate(value, findFormDataItemByName) {
        const item = findFormDataItemByName('subscription_till_for_exclusive_tracks')

        item.componentData.disabled = value

        if (value) {
          formDataValues.subscription_till_for_exclusive_tracks = null
        }
      }
    }),
    select({
      name: 'subscription_labels',
      label: 'Лейблы',
      class: '--full',
      hide: true,
      componentData: {
        isMultiple: true,
      }
    })
  ]
}

const {
  tabsWithFormData,
  formDataValues,
  errors,

  getFormComponent,
  findFormDataItemByName
} = initFormWithTabs(
    'users/create',
    'users/update',
    [
      InfoTab,
      CompanyTab,
      SubscriptionTab
    ],
)

const setDefaultForCreate = () => {
  formDataValues.subscription_type_id = 'NONE'
  formDataValues.remove = true

  const subscriptionTillForExclusiveTracksFormItem = findFormDataItemByName('subscription_till_for_exclusive_tracks')

  subscriptionTillForExclusiveTracksFormItem.componentData.disabled = true
}

const setDefaultForUpdate = () => {

  if (!formDataValues.subscription_till_for_exclusive_tracks) {
    formDataValues.remove = true
    findFormDataItemByName('subscription_till_for_exclusive_tracks').componentData.disabled = true
  }

  const subscriptionLabelsFormItem = findFormDataItemByName('subscription_labels')

  if (['ONLY_MUSIC', 'MUSIC_AND_SOUNDS'].includes(formDataValues.subscription_type_id)) {
    subscriptionLabelsFormItem.section = 'Подписка на лейблы'
    subscriptionLabelsFormItem.hide = false
  } else {
    subscriptionLabelsFormItem.section = undefined
    subscriptionLabelsFormItem.hide = true
  }
}

const FormComponent = getFormComponent(emit, props, tabsWithFormData, errors)

onMounted(() => {
  fillComponents(props, tabsWithFormData, formDataValues, {
    locales: {
      to: 'locale_id',
    },
    company_countries: {
      to: 'company_country_id',
      fn(country) {
        return {
          id: country.id,
          title: country.name_ru,
        }
      }
    },
    subscription_types: {
      to: 'subscription_type_id',
    },
    labels: {
      to: 'subscription_labels',
      fn: (label) => {
        return {
          id: label.id,
          title: label.name_ru,
        }
      }
    },
    company_business_types: {
      to: 'company_business_type_id',
      fn: (companyBusinessType) => {
        return {
          id: companyBusinessType.id,
          title: companyBusinessType.name_en,
        }
      },
    }
  }, {
    subscription_labels: {
      fn: (labels) => {
        return labels.map((label: any) => label.id)
      }
    },
    subscription_till: {
      fn: (subscriptionTill) => {
        return subscriptionTill ? moment(subscriptionTill, 'X').format('DD.MM.yyyy') : undefined
      }
    },
    subscription_till_for_exclusive_tracks: {
      fn: (subscriptionTillForExclusiveTracks) => {
        return subscriptionTillForExclusiveTracks ? moment(subscriptionTillForExclusiveTracks, 'X').format('DD.MM.yyyy') : null
      }
    }
  })

  props.data.id ? setDefaultForUpdate() : setDefaultForCreate()
})
</script>

<template>
  <FormComponent/>
</template>
