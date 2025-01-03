<script setup lang="ts">
import { type IRow, type IMonth, type IYear, type IHour, type IMinute } from './types'
import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'
import moment, { type Moment } from 'moment'
import 'moment/dist/locale/ru'
import { maskDatetime } from './mask'
import Button from '~/components/Base/Button.vue'

moment.locale('ru')

const emit = defineEmits(['update:modelValue'])

const props = withDefaults(defineProps<{
  modelValue?: number | string | null,
  rangeIndex?: number,
  forceInverse?: boolean,
  format?: string,
  disabled?: boolean,
  errors?: string[],
  toUTC?: boolean
}>(), {
  forceInverse: false,
  format: 'X',
  disabled: false,
  toUTC: false
})

const calendarIsOpen = ref(true)
const monthsIsOpen = ref(false)
const yearsIsOpen = ref(false)
const timeIsOpen = ref(false)
const hoursIsOpen = ref(false)
const minutesIsOpen = ref(false)

const isOpen = ref(false)
const isNeedToInverse = ref(false)

const localMinutes = ref(0)
const localHours = ref(0)

const localHoursFormatted = computed(() => {
  return localHours.value > 9 ? localHours.value : '0' + localHours.value
})

const localMinutesFormatted = computed(() => {
  return localMinutes.value > 9 ? localMinutes.value : '0' + localMinutes.value
})

const startYearMoment = moment().subtract(100, 'year')
const endYearMoment = moment().add(100, 'year')

let currentDate = moment()
let currentDateStartOfDay = moment().startOf('day')
let calendarNavMoment = currentDate.clone()

let localDateMoment: Moment|null = null
const localDate: Ref<null|string> = ref(null)

const localDateUnconfirmed: Ref<string | null> = ref(null)
let localDateUnconfirmedMoment: Moment | null = null

const calendarNavMonth = ref(calendarNavMoment.format('MMMM'))
const calendarNavYear = ref(calendarNavMoment.format('YYYY'))

const months = ref([] as IMonth[])
const years = ref([] as IYear[])
const hours = ref([] as IHour[])
const minutes = ref([] as IMinute[])

const calendarNumbersRows = ref([] as IRow[][]);

const yearSelectedEl: Ref<null|HTMLElement[]> = ref(null)
const yearContainerEl: Ref<null|HTMLElement> = ref(null)
const dropdownEl: Ref<null|HTMLElement> = ref(null)

const monthDays = ref([
  'пн',
  'вт',
  'ср',
  'чт',
  'пт',
  'cб',
  'вс'
])

watch(
    () => props.modelValue,
    ((value) => {
      setLocalValues(value)
    })
)

watch(
    isOpen,
    ((value) => {
      nextTick(() => {

        if (props?.forceInverse) {
          isNeedToInverse.value = true

          return
        }

        if (value) {
          const rect = dropdownEl.value!.getBoundingClientRect()

          isNeedToInverse.value = window.innerHeight < rect.height + rect.top
          return
        }

        isNeedToInverse.value = false
      })
    })
)

const onClick = () => {
  if (props.disabled) {
    return
  }

  buildCalendar()

  isOpen.value = true
}

const onClickOutside = () => {
  isOpen.value = false

  monthsIsOpen.value = false
  yearsIsOpen.value = false
  timeIsOpen.value = false
  calendarIsOpen.value = true

  localDateUnconfirmedMoment = localDateMoment === null ? null : localDateMoment.clone()
  localDateUnconfirmed.value = localDate.value
}

const selectDate = (moment: Moment, isNeedClose: boolean = true) => {
  if (isNeedClose) {
    isOpen.value = false
  }

  moment.hours(localHours.value)
  moment.minutes(localMinutes.value)

  localDateUnconfirmedMoment = moment
  localDateUnconfirmed.value = localDateUnconfirmedMoment.format('DD.MM.YYYY HH:mm')

  buildCalendar()
}

const onClickPrev = () => {

  calendarNavMoment = calendarNavMoment.clone().subtract(1, 'months')

  calendarNavMonth.value = calendarNavMoment.format('MMMM')
  calendarNavYear.value = calendarNavMoment.format('YYYY')

  buildCalendar()
}

const onClickNext = () => {
  calendarNavMoment = calendarNavMoment.clone().add(1, 'months')

  calendarNavMonth.value = calendarNavMoment.format('MMMM')
  calendarNavYear.value = calendarNavMoment.format('YYYY')

  buildCalendar()
}

const buildNavYears = () => {

  const _years = [];

  const countOfMonth = endYearMoment.diff(startYearMoment, 'years')

  for (let i = 0; i < countOfMonth; i++) {

    const moment = startYearMoment.clone().add(i, 'year').startOf('day')

    _years.push({
          value: moment.format('YYYY'),
          moment: moment,
          isCalendarNavYear: moment.isSame(calendarNavMoment.clone().startOf('day')),
        } as IYear
    )
  }

  years.value = _years
}

const buildNavMonths = () => {
  months.value = moment()
      .localeData()
      .monthsShort()
      .map((month, index) => {

        const momentValue = moment().month(index).startOf('day')

        return {
          value: month.replace('.', ''),
          moment: momentValue,
          isCalendarNavMonth: momentValue.isSame(calendarNavMoment.clone().startOf('day'))
        } as IMonth
      })
}

const buildHours = () => {
  const _hours: IHour[] = []

  for (let i = 0; i < 24; i++) {
    _hours.push({
      value: i,
      valueFormatted: i < 10 ? '0' + i : i.toString(),
      isSelected: localHours.value === i
    })
  }

  hours.value = _hours as IHour[]
}

const buildMinutes = () => {
  const _minutes: IMinute[] = []

  for (let i = 0; i < 60; i++) {
    _minutes.push({
      value: i,
      valueFormatted: i < 10 ? '0' + i : i.toString(),
      isSelected: localMinutes.value === i
    })
  }

  minutes.value = _minutes as IMinute[]
}

const buildCalendar = () => {
  const _calendarNumbersRows = []

  const firstDayOfMonth = calendarNavMoment.clone().startOf('months')
  const numberOfWeekDay = Number(firstDayOfMonth.format('d'))
  const firstDayOfCalender = firstDayOfMonth.clone().subtract(numberOfWeekDay === 0 ? 6 : numberOfWeekDay - 1, 'days')

  for (let i = 0; i < 6; i++) {

    const numbersRow: IRow[] = []

    for (let j = 0; j < 7; j++) {

      const moment = firstDayOfCalender.clone().add(j + (i * 7), 'days')

      numbersRow.push({
        value: moment.format('D'),
        moment: moment,
        isCurrentMonth: firstDayOfMonth.format('M') === moment.format('M'),
        isSelectedValue: localDateUnconfirmedMoment !== null && localDateUnconfirmedMoment.format('DD.MM.YYYY') === moment.format('DD.MM.YYYY'),
        isToday: currentDateStartOfDay.isSame(moment)
      })
    }

    _calendarNumbersRows.push(numbersRow)
  }

  calendarNumbersRows.value = _calendarNumbersRows
}

const onClickNavMonth = () => {
  yearsIsOpen.value = false
  timeIsOpen.value = false
  calendarIsOpen.value = true
  monthsIsOpen.value = true
}

const onClickNavYear = () => {
  monthsIsOpen.value = false
  timeIsOpen.value = false
  calendarIsOpen.value = true
  yearsIsOpen.value = true

  nextTick(() => {
    yearContainerEl.value!.scrollTo({
      top: yearSelectedEl.value![0].offsetTop,
    })
  })
}

const onClickNavTime = () => {
  yearsIsOpen.value = false
  monthsIsOpen.value = false
  calendarIsOpen.value = false
  timeIsOpen.value = true
}

const onClickNavCalendar = () => {
  yearsIsOpen.value = false
  monthsIsOpen.value = false
  timeIsOpen.value = false
  hoursIsOpen.value = false
  minutesIsOpen.value = false
  calendarIsOpen.value = true
}

const onSelectMonth = (month: IMonth) => {
  calendarNavMoment = month.moment
  calendarNavMonth.value = month.moment.format('MMMM')

  buildNavMonths()
  buildCalendar()

  monthsIsOpen.value = false
}

const onSelectYear = (year: IYear) => {

  calendarNavMoment = year.moment
  calendarNavYear.value = year.moment.format('YYYY')

  buildNavYears()
  buildCalendar()

  yearsIsOpen.value = false
  monthsIsOpen.value = false
}

const onDocumentVisibilityChange = () => {
  yearsIsOpen.value = false
  monthsIsOpen.value = false
  isOpen.value = false
}

const onClickRemove = () => {
  if (props.disabled) {
    return
  }

  emit('update:modelValue', {'value': null, 'rangeIndex': props.rangeIndex})
}

onMounted(() => {
  document.addEventListener('visibilitychange', onDocumentVisibilityChange)

  buildCalendar()
  buildNavMonths()
  buildNavYears()
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onDocumentVisibilityChange)
})

const onKeydown = (e: Event) => {
  maskDatetime(e, localDate)

  if (localDate.value) {
    const localDateMoment = moment(localDate.value, 'DD.MM.YYYY HH:mm')

    if (localDate.value.length === 16 && localDateMoment.isValid()) {
      emit('update:modelValue', {
        'value': prepareValue(localDateMoment),
        'rangeIndex': props.rangeIndex
      })

      return
    }
  }

  if (!localDate.value) {
    emit('update:modelValue', {'value': null, 'rangeIndex': props.rangeIndex})
  }
}

const onKeydownEnter = () => {
  isOpen.value = !isOpen.value
}

const apply = () => {
  isOpen.value = false
  calendarIsOpen.value = true
  timeIsOpen.value = false

  emit('update:modelValue', {
    'value': prepareValue(localDateUnconfirmedMoment),
    'rangeIndex': props.rangeIndex
  })
}

const prepareValue = (value: Moment | null | undefined) => {
  if (value === null) {
    return null
  }

  if (value === undefined) {
    return undefined;
  }

  if (props.toUTC) {
    const _value = value.clone()

    return _value.subtract(value.utcOffset(), 'minutes').format(props.format)
  }

  return value.format(props.format)
}

const increaseHour = () => {
  localHours.value = localHours.value === 23 ? 0 : localHours.value + 1

  if (localDateUnconfirmedMoment) {

    localDateUnconfirmedMoment.hour(localHours.value)
    localDateUnconfirmed.value = localDateUnconfirmedMoment.format('DD.MM.YYYY HH:mm')
  }
}

const decreaseHour = () => {
  localHours.value = localHours.value === 0 ? 23 : localHours.value - 1

  if (localDateUnconfirmedMoment) {

    localDateUnconfirmedMoment.hour(localHours.value)
    localDateUnconfirmed.value = localDateUnconfirmedMoment.format('DD.MM.YYYY HH:mm')
  }
}

const increaseMinute = () => {
  localMinutes.value = localMinutes.value === 59 ? 0 : localMinutes.value + 1

  if (localDateUnconfirmedMoment) {

    localDateUnconfirmedMoment.minute(localMinutes.value)
    localDateUnconfirmed.value = localDateUnconfirmedMoment.format('DD.MM.YYYY HH:mm')
  }
}

const decreaseMinute = () => {
  localMinutes.value = localMinutes.value === 0 ? 59 : localMinutes.value - 1

  if (localDateUnconfirmedMoment) {
    localDateUnconfirmedMoment.minute(localMinutes.value)
    localDateUnconfirmed.value = localDateUnconfirmedMoment.format('DD.MM.YYYY HH:mm')
  }
}

const onClickHours = () => {
  buildHours()
  hoursIsOpen.value = true
}

const onClickMinutes = () => {
  buildMinutes()
  minutesIsOpen.value = true
}

const onClickHour = (value: number) => {
  localHours.value = value

  if (localDateUnconfirmedMoment) {
    localDateUnconfirmedMoment.hour(localHours.value)
    localDateUnconfirmed.value = localDateUnconfirmedMoment.format('DD.MM.YYYY HH:mm')
  }

  hoursIsOpen.value = false
  timeIsOpen.value = true
}

const onClickMinute = (value: number) => {
  localMinutes.value = value

  if (localDateUnconfirmedMoment) {
    localDateUnconfirmedMoment.minute(localMinutes.value)
    localDateUnconfirmed.value = localDateUnconfirmedMoment.format('DD.MM.YYYY HH:mm')
  }

  minutesIsOpen.value = false
  timeIsOpen.value = true
}

const setLocalValues = (value?: string | number | null) => {
  if (value === undefined || value === null) {
    localDateMoment = null
    localDate.value = null

    localDateUnconfirmedMoment = localDateMoment
    localDateUnconfirmed.value = null

    localHours.value = 0
    localMinutes.value = 0

    buildCalendar()

    return
  }

  localDateMoment = moment(value as moment.MomentInput, props.format)

  if (props.toUTC) {
    localDateMoment.add(localDateMoment.utcOffset(), 'minutes')
  }

  localDate.value = localDateMoment.format('DD.MM.YYYY HH:mm')

  localDateUnconfirmedMoment = localDateMoment.clone()
  localDateUnconfirmed.value = localDate.value

  localHours.value = Number(localDateMoment.format('H'))
  localMinutes.value = Number(localDateMoment.format('m'))

  calendarNavMoment = localDateMoment.clone()
  calendarNavMonth.value = localDateMoment.format('MMMM')
  calendarNavYear.value = localDateMoment.format('YYYY')

  buildCalendar()
}

setLocalValues(props.modelValue)
</script>

<template>
  <div class="date__input-container" v-click-outside="onClickOutside" :class="{
    '--is-open': isOpen,
    '--inverse': isNeedToInverse,
    '--disabled': props.disabled,
    '--has-errors': props.errors && props.errors[0]
  }">
    <div class="date__multiple-label" v-if="rangeIndex !== undefined">{{ rangeIndex === 0 ? 'от' : 'до' }}</div>
    <input
        @keydown.enter="onKeydownEnter"
        @keydown="onKeydown"
        :value="localDate"
        @click="onClick"
        ref="input"
        :disabled="props.disabled"
    />
    <div class="date__input-remove-icon" @click="onClickRemove" v-if="localDate !== null" :class="{'--disabled': props.disabled}">
      <svg>
        <use xlink:href="/img/temp_sprite.svg#min_cross"/>
      </svg>
    </div>
    <div class="date__input-icon" @click="onClick">
      <svg>
        <use xlink:href="/img/temp_sprite.svg#calendar"/>
      </svg>
    </div>
    <div
        v-if="isOpen"
        class="date__dropdown"
        :class="{'--inverse': isNeedToInverse}"
        ref="dropdownEl"
    >
      <div class="date__dropdown-arrow" :class="{'--inverse': isNeedToInverse}"/>
      <div class="date__nav">
        <div class="date__arrow-container --left" @click="onClickPrev">
          <svg><use xlink:href="/img/sprite.svg#left_single_arrow"/></svg>
        </div>
        <div class="date__nav-center">
          <div class="date__nav-month" @click="onClickNavMonth">{{ calendarNavMonth }}</div>
          <div class="date__nav-year" @click="onClickNavYear">{{ calendarNavYear }}</div>
          <div v-if="calendarIsOpen" class="date__nav-time" @click="onClickNavTime">
            <svg>
              <use xlink:href="/img/temp_sprite.svg#time"/>
            </svg>
          </div>
          <div v-if="timeIsOpen" class="date__nav-calendar" :class="{'--active': timeIsOpen}" @click="onClickNavCalendar">
            <svg>
              <use xlink:href="/img/temp_sprite.svg#calendar_bold"/>
            </svg>
          </div>
        </div>
        <div class="date__arrow-container --right" @click="onClickNext">
          <svg><use xlink:href="/img/sprite.svg#right_single_arrow"/></svg>
        </div>
      </div>
      <div class="date__calendar" v-if="!monthsIsOpen && !yearsIsOpen && !timeIsOpen">
        <div class="date__calendar-row --days">
          <div class="date__calendar-cell" v-for="monthDay in monthDays">{{ monthDay }}</div>
        </div>
        <hr/>
        <div class="date__calendar-row" v-for="calendarNumberRow in calendarNumbersRows">
          <div
              class="date__calendar-cell"
              :class="{
                      '--not-current': !calendarNumber.isCurrentMonth,
                      '--selected': calendarNumber.isSelectedValue,
                      '--today': calendarNumber.isToday
                    }"
              v-for="calendarNumber in calendarNumberRow"
              @click="selectDate(calendarNumber.moment, false)"
          >
            {{ calendarNumber.value }}
          </div>
        </div>
      </div>
      <div class="date__time" v-if="timeIsOpen && !hoursIsOpen && !minutesIsOpen">
          <div class="date__time_parts">
            <div class="date__time_arrow --top" @click="increaseHour">
              <svg><use xlink:href="/img/sprite.svg#right_single_arrow"/></svg>
            </div>
            <div class="date__time_label" @click="onClickHours">{{ localHoursFormatted }}</div>
            <div class="date__time_arrow --bottom" @click="decreaseHour">
              <svg><use xlink:href="/img/sprite.svg#right_single_arrow"/></svg>
            </div>
          </div>
          <div class="date__time_divider">:</div>
          <div class="date__time_parts">
            <div class="date__time_arrow --top" @click="increaseMinute">
              <svg><use xlink:href="/img/sprite.svg#right_single_arrow"/></svg>
            </div>
            <div class="date__time_label" @click="onClickMinutes">{{ localMinutesFormatted }}</div>
            <div class="date__time_arrow --bottom" @click="decreaseMinute">
              <svg><use xlink:href="/img/sprite.svg#right_single_arrow"/></svg>
            </div>
          </div>
      </div>
      <div class="date__enums --hours" v-if="hoursIsOpen" v-scrollable="{classes: ['--without-track']}">
        <div
            v-for="hour in hours"
            class="date__enum"
            :class="{'--is-selected': hour.isSelected}"
            @click="onClickHour(hour.value)"
        >
          {{ hour.valueFormatted }}
        </div>
      </div>
      <div class="date__enums --minutes" v-if="minutesIsOpen" v-scrollable="{classes: ['--without-track']}">
        <div
            v-for="minute in minutes"
            class="date__enum"
            :class="{'--is-selected': minute.isSelected}"
            @click="onClickMinute(minute.value)"
        >
          {{ minute.valueFormatted }}
        </div>
      </div>
      <div class="date__enums" v-if="monthsIsOpen">
        <div
            v-for="month in months"
            class="date__enum"
            :class="{'--is-selected': month.isCalendarNavMonth}"
            @click="onSelectMonth(month)"
        >
          {{ month.value }}
        </div>
      </div>
      <div class="date__enums --years" ref="yearContainerEl" v-scrollable="{classes: ['--without-track']}" v-if="yearsIsOpen">
        <template v-for="year in years">
          <div
              v-if="year.isCalendarNavYear"
              class="date__enum --is-selected"
              ref="yearSelectedEl"
              @click="onSelectYear(year)"
          >
            {{ year.value }}
          </div>
          <div
              v-else
              class="date__enum"
              @click="onSelectYear(year)"
          >
            {{ year.value }}
          </div>
        </template>
      </div>
      <div class="date__actions">
        <div class="date__information">{{ localDateUnconfirmed ? localDateUnconfirmed : 'Не задано' }}</div>
        <div class="date__buttons">
          <button class="date__button" style="margin-left: 2px;" @click="apply">Применить</button>
        </div>
      </div>
    </div>
  </div>
</template>