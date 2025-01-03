import {
    type Component,
    defineComponent,
    type DefineProps,
    h, KeepAlive,
    type Reactive,
    type Ref,
    type ShallowRef,
    type VNode,
} from 'vue'
import { defu } from 'defu'
import { cloneDeep } from 'lodash-es'
import { useNuxtApp } from '#imports'
import { FetchError } from 'ofetch'
import type { LooseRequired } from '@vue/shared'
import FormSelect from '~/components/Base/Form/Select.vue'
import FormSelectWrap from '~/components/Base/Form/SelectWrap.vue'
import FormInput from '~/components/Base/Form/Input.jsx'
import FormDatetime from '~/components/Base/Form/Datetime.vue'
import FormDate from '~/components/Base/Form/Date.vue'
import FormInputFile from '~/components/Base/Form/InputFile.vue'
import FormTextArea from '~/components/Base/Form/TextArea.vue'
import FormCheckbox from '~/components/Base/Form/Checkbox.vue'
import FormSwitcher from '~/components/Base/Form/Switcher.vue'
import FormEditor from '~/components/Base/Form/Editor.vue'
import Form from '~/components/Base/Form.vue'
import Tabs from '~/components/Base/Tabs.vue'

interface IFormComponent {
    name: string
    label: string
    class?: string
    /** заголовок перед компонентом */
    section?: string
    hide?: boolean,
    /** для того чтобы изменять свойство в componentData */
    componentData?: {
        [key: string]: any
    }
    /** колбек после изменения значения в компоненте */
    onUpdate?: (
        value: any,
        findFormDataItemByName: (name: string) => TFormDataItemOutput
    ) => void
}

interface ITextArea extends IFormComponent {
}

interface IEditor extends IFormComponent {
}

interface ICheckbox extends IFormComponent {
}

interface ISelect extends IFormComponent {
    componentData?: {
        options?: {}[],
        isMultiple?: boolean,
        isFilterable?: boolean,
        isRemovable?: boolean,
        isForceInverse?: boolean
    }
}

interface ISelectWrap extends IFormComponent {
    componentData?: {
        options?: {}[],
        isFilterable?: boolean,
        isForceInverse?: boolean
    }
}

interface IInput extends IFormComponent {
    componentData?: {
        disabled?: boolean,
        description?: string,
        mask?: string,
        type?: 'text' | 'password'
    }
}

interface IDatetime extends IFormComponent {
    componentData?: {
        format?: 'X' | 'DD.MM.yyyy HH:mm',
        disabled?: boolean,
        toUTC?: boolean
    }
}

interface IDate extends IFormComponent {
    componentData?: {
        format?: 'X' | 'DD.MM.yyyy',
        disabled?: boolean,
    }
}

interface IInputFile extends IFormComponent {
    componentData?: {
        allowedTypes?: string[],
        maxSizeMB?: number
    }
}

type TFormDataItemInput = ISelect | ISelectWrap | IInput | IDatetime | IDate | IInputFile | ITextArea | ICheckbox
type TFormDataItemOutput = IFormComponent & { component: Component, componentData: any }

export interface defaultProps {
    data: {
        formResponse: {
            entity?: { [key: string]: any }
            [key: string]: any,
        },
        title: string,
        id?: number
    }
}

interface ITabWithFormData {
    title: string,
    formData: TFormDataItemOutput[]
    hasError?: boolean,
    formClass?: string
}

type propsWithDefaultPropsType = DefineProps<LooseRequired<defaultProps>, never>

const isTabWithFormData = (item: ITabWithFormData | TFormDataItemOutput): item is ITabWithFormData => {
    return 'formData' in item
}

export const useForm = () => {

    const initFormWithTabs = (
        createURL: string,
        updateURL: string,
        tabsWithFormData: ITabWithFormData[],
    ) => {
        const {$authFetch} = useNuxtApp()

        const formDataValues = getFormDataValuesFromTabs(tabsWithFormData)
        const errors: Ref<Record<string, any>> = ref({})

        const selectedTab = ref(0)

        const onChangeTab = (_selectedTab: number) => {
            selectedTab.value = _selectedTab
        }

        const onChangeFormData = (param: string, value: any) => {
            formDataValues[param] = value
        }

        const refTabsWithFormData = ref(tabsWithFormData)

        const onClickSave = async (
            props: propsWithDefaultPropsType,
            emit: (event: ("modal:resolve" | "modal:close"), ...args: any[]) => void
        ) => {
            let requestBody = formRequestBody(formDataValues, props.data.id)

            const URL = props.data.id ? updateURL : createURL

            try {

                await $authFetch(URL, {
                    method: 'POST',
                    body: requestBody,
                })

                emit('modal:resolve')

            } catch (err) {
                if (err instanceof FetchError) {
                    if (err.status === 422 && err.data.errors) {
                        errors.value = err.data.errors

                        for (let tabI = 0; tabI <= refTabsWithFormData.value.length - 1; tabI++) {
                            refTabsWithFormData.value[tabI].hasError = false

                            formIterator: for (let formItemI = 0; formItemI <= refTabsWithFormData.value[tabI].formData.length - 1; formItemI++) {

                                for (let errorKey in err.data.errors) {

                                    if (errorKey === refTabsWithFormData.value[tabI].formData[formItemI].name) {
                                        refTabsWithFormData.value[tabI].hasError = true

                                        break formIterator
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const findFormDataItemByName = (name: string): TFormDataItemOutput => {

            let formDataItem: TFormDataItemOutput | undefined = undefined;

            tab_loop: for (let i = 0; i < refTabsWithFormData.value.length; i++) {
                for (let j = 0; j < refTabsWithFormData.value[i].formData.length; j++) {

                    if (name === refTabsWithFormData.value[i].formData[j].name) {
                        formDataItem = refTabsWithFormData.value[i].formData[j]

                        break tab_loop;
                    }
                }
            }

            if (!formDataItem) {
                throw new Error('Элемент "' + name + '" не найден')
            }

            return formDataItem
        }

        const TabComponent = defineComponent(
            (_props) => {

                return () => {

                    const contentVNodes: VNode[] = []

                    _props.data.formData.forEach((formDataItem: TFormDataItemOutput) => {

                        if (formDataItem.section) {
                            contentVNodes.push(h('div', {class: 'form__section --full'}, formDataItem.section))
                        }

                        if (formDataItem.hide) {
                            return
                        }

                        contentVNodes.push(h(toRaw(formDataItem.component), {
                            key: formDataItem.name,
                            errors: _props.errors && _props.errors[formDataItem.name] ? _props.errors[formDataItem.name] : null,
                            class: formDataItem.class,
                            name: formDataItem.name,
                            label: formDataItem.label,
                            componentData: formDataItem.componentData,
                            modelValue: _props.formDataValues[formDataItem.name],
                            'onUpdate:modelValue': (value: any) => {

                                _props.formDataValues[formDataItem.name] = value
                                delete errors.value[formDataItem.name]

                                if (formDataItem.onUpdate) {
                                    formDataItem.onUpdate(value, findFormDataItemByName)
                                }
                            }
                        }))
                    })

                    return h('div', {
                        onChange: onChangeFormData,
                        class: 'grid',
                    }, contentVNodes)
                }
            },
            {
                props: {
                    data: {
                        type: Object,
                        required: true,
                    },
                    errors: {
                        type: Object,
                        required: false,
                    },
                    formDataValues: {
                        type: Object,
                        required: true,
                    },
                },
            })

        const getFormComponent = (
            emit: (event: ("modal:resolve" | "modal:close"), ...args: any[]) => void,
            props: propsWithDefaultPropsType,
            refTabsWithFormData: Ref<ITabWithFormData[]>,
            errors: Ref<Record<string, any>>
        ) => {
            return defineComponent(
                (_props) => {

                    return () => {
                        return h(Form, {
                            title: props.data.title,
                            onClose: () => {
                                emit('modal:close')
                            }
                        }, {
                            header: () => h(Tabs, {
                                tabs: refTabsWithFormData.value as [],
                                onChange: onChangeTab,
                            }),
                            content: () => h(KeepAlive, h(TabComponent, {
                                key: selectedTab.value,
                                class: refTabsWithFormData.value[selectedTab.value].formClass ? refTabsWithFormData.value[selectedTab.value].formClass : '--2x2',
                                data: refTabsWithFormData.value[selectedTab.value],
                                formDataValues,
                                onChange: onChangeFormData,
                                errors: errors.value,
                            })),
                            footer: () => h('div', {class: 'btn__group'}, [
                                h('button', {
                                    class: 'btn --primary --big',
                                    type: 'submit',
                                    onClick: (e) => {
                                        e.preventDefault()
                                        void onClickSave(props, emit)
                                    },
                                }, 'Сохранить'),
                                h('button', {
                                    class: 'btn --outline-primary --big',
                                    type: 'button',
                                    onClick: () => {
                                        emit('modal:close')
                                    }
                                }, 'Отмена')
                            ])
                        })
                    }
                }
            )
        }

        return {
            tabsWithFormData: refTabsWithFormData,
            formDataValues,
            errors,
            selectedTab,

            onClickSave,
            onChangeTab,
            onChangeFormData,
            getFormComponent,
            findFormDataItemByName
        };
    }

    const initForm = (
        createURL: string,
        updateURL: string,
        formData: TFormDataItemOutput[],
        formClass?: string
    ) => {
        const {$authFetch} = useNuxtApp()

        const formDataValues = getFormDataValues(formData)
        const errors: Ref<Record<string, any>> = ref({})

        const onClickSave = async (
            props: propsWithDefaultPropsType,
            emit: (event: ("modal:resolve" | "modal:close"), ...args: any[]) => void
        ) => {
            let requestBody = formRequestBody(formDataValues, props.data.id)

            const URL = props.data.id ? updateURL : createURL

            try {

                await $authFetch(URL, {
                    method: 'POST',
                    body: requestBody,
                })

                emit('modal:resolve')

            } catch (err) {
                if (err instanceof FetchError) {
                    if (err.status === 422 && err.data.errors) {
                        errors.value = err.data.errors
                    }
                }
            }
        }

        const shallowRefFormData = shallowRef(formData)

        const findFormDataItemByName = (name: string): TFormDataItemOutput => {
            const item = shallowRefFormData.value.find(formDataItem => formDataItem.name === name)

            if (!item) {
                throw new Error('Элемент "' + name + '" не найден')
            }

            return item
        }

        const getFormComponent = (
            emit: (event: ("modal:resolve" | "modal:close"), ...args: any[]) => void,
            props: propsWithDefaultPropsType,
            formData: ShallowRef<TFormDataItemOutput[]>,
            errors: Ref<Record<string, any>>
        ) => {
            return defineComponent(
                (_props) => {
                    return () => {

                        const contentFormData: VNode[] = []

                        formData.value.forEach((formDataItem) => {
                            if (formDataItem.section) {
                                contentFormData.push(h('div', {class: 'form__section --full'}, formDataItem.section))
                            }

                            if (formDataItem.hide) {
                                return
                            }

                            contentFormData.push(
                                h(formDataItem.component, {
                                    componentData: formDataItem.componentData,
                                    class: formDataItem.class,
                                    label: formDataItem.label,
                                    name: formDataItem.name,
                                    modelValue: formDataValues[formDataItem.name],
                                    'onUpdate:modelValue': (value: any) => {
                                        formDataValues[formDataItem.name] = value
                                        delete errors.value[formDataItem.name]

                                        if (formDataItem.onUpdate) {
                                            formDataItem.onUpdate(value, findFormDataItemByName)
                                        }
                                    },
                                    errors: errors.value[formDataItem.name]
                                })
                            )
                        })

                        return h(Form, {
                            title: props.data.title,
                            onClose: () => {
                                emit('modal:close')
                            }
                        }, {
                            content: () => h('div', {class: 'grid ' + (formClass ? formClass : '--2x2')}, contentFormData),
                            footer: () => h('div', {class: 'btn__group'}, [
                                h('button', {
                                    class: 'btn --primary --big',
                                    type: 'submit',
                                    onClick: (e) => {
                                        e.preventDefault()
                                        void onClickSave(props, emit)
                                    }
                                }, 'Сохранить'),
                                h('button', {
                                    class: 'btn --outline-primary --big',
                                    type: 'button',
                                    onClick: () => {
                                        emit('modal:close')
                                    }
                                }, 'Отмена')
                            ])
                        })
                    }
                }
            )
        }

        return {
            formData: shallowRefFormData,
            formDataValues,
            errors,

            onClickSave,
            getFormComponent,
            findFormDataItemByName
        };
    }

    const getFormDataValuesFromTabs = (tabsWithFormData: ITabWithFormData[]): Reactive<Record<string, any>> => {
        const preparedFormDataValues: Record<string, undefined> = {}

        tabsWithFormData.forEach((tab) => {
            tab.formData.forEach((formDataItem) => {
                preparedFormDataValues[formDataItem.name] = undefined
            })
        })

        return reactive(preparedFormDataValues)
    }

    const getFormDataValues = (formDataItems: TFormDataItemInput[]): Reactive<Record<string, any>> => {
        const preparedFormDataValues: Record<string, undefined> = {}

        formDataItems.map((formDataItem) => {
            preparedFormDataValues[formDataItem.name] = undefined
        })

        return reactive(preparedFormDataValues)
    }

    const formRequestBody = (formDataValues: IItem, id: number | undefined = undefined): IItem | FormData => {

        const _formDataValues = cloneDeep(formDataValues)

        let isRequiredFormData = false

        Object.values(_formDataValues).map((value) => {
            if (value instanceof File) {
                isRequiredFormData = true
            }
        });

        if (isRequiredFormData) {
            const formData = new FormData

            Object.entries(_formDataValues).map(([key, value]) => {

                if (value === undefined) {
                    return
                }

                if (typeof value === 'boolean') {
                    value = value ? 1 : 0
                }

                if (value instanceof Array) {
                    value.forEach(item => {
                        formData.append(`${key}[]`, item)
                    })

                    return
                }

                formData.append(key, value)
            })

            if (id !== undefined) {
                formData.append('id', id.toString())
            }

            return formData
        }

        Object.entries(_formDataValues).map(([key, value]) => {

            if (value instanceof Array) {
                return
            }

            if (value instanceof Object) {
                _formDataValues[key] = undefined
            }
        })

        if (id !== undefined) {
            _formDataValues.id = id
        }

        return _formDataValues
    }

    const getDefaultFormDataItemProperties = (config: IFormComponent) => {
        return {
            name: config.name,
            label: config.label,
            class: config.class,
            section: config.section,
            onUpdate: config.onUpdate,
            hide: config.hide ? config.hide : false,
        }
    }

    const select = (config: ISelect): TFormDataItemOutput => {

        const defaultComponentData = {
            options: [],
            isFilterable: false,
            isRemovable: false,
            isForceInverse: false
        }

        const componentData = config.componentData ? defu(config.componentData, defaultComponentData) : defaultComponentData

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormSelect,
            componentData: componentData
        }
    }

    const selectWrap = (config: ISelectWrap): TFormDataItemOutput => {
        const defaultComponentData = {
            options: [],
            isFilterable: false,
            isForceInverse: false
        }

        const componentData = config.componentData ? defu(config.componentData, defaultComponentData) : defaultComponentData

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormSelectWrap,
            componentData: componentData
        }
    }

    const input = (config: IInput): TFormDataItemOutput => {

        const componentData = config.componentData ? config.componentData : {}

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormInput,
            componentData: componentData
        }
    }

    const date = (config: IDate): TFormDataItemOutput => {

        const defaultComponentData = {
            disabled: false,
            format: 'DD.MM.yyyy',
        }

        const componentData = config.componentData ? defu(config.componentData, defaultComponentData) : defaultComponentData

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormDate,
            componentData: componentData
        }
    }

    const datetime = (config: IDatetime): TFormDataItemOutput => {

        const defaultComponentData = {
            disabled: false,
            format: 'DD.MM.yyyy HH:mm',
            toUTC: false
        }

        const componentData = config.componentData ? defu(config.componentData, defaultComponentData) : defaultComponentData

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormDatetime,
            componentData: componentData,
        }
    }

    const inputFile = (config: IInputFile): TFormDataItemOutput => {

        const defaultComponentData = {
            allowedTypes: ['jpg', 'jpeg', 'png']
        }

        const componentData = config.componentData ? defu(config.componentData, defaultComponentData) : defaultComponentData

        if (config.componentData?.allowedTypes) {
            componentData.allowedTypes = config.componentData?.allowedTypes
        }

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormInputFile,
            componentData: componentData
        }
    }

    const textArea = (config: ITextArea): TFormDataItemOutput => {

        const componentData = config.componentData ? config.componentData : {}

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormTextArea,
            componentData: componentData
        }
    }

    const editor = (config: IEditor): TFormDataItemOutput => {
        const componentData = config.componentData ? config.componentData : {}

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormEditor,
            componentData: componentData
        }
    }

    const checkbox = (config: ICheckbox): TFormDataItemOutput => {

        const componentData = config.componentData ? config.componentData : {}

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormCheckbox,
            componentData: componentData
        }
    }

    const switcher = (config: ICheckbox): TFormDataItemOutput => {

        const componentData = config.componentData ? config.componentData : {}

        return {
            ...getDefaultFormDataItemProperties(config),
            component: FormSwitcher,
            componentData: componentData
        }
    }

    const fillComponents = (
        props: propsWithDefaultPropsType,
        formData: ShallowRef<TFormDataItemOutput[] | ITabWithFormData[]>,
        formDataValues: Record<string, undefined>,
        optionsMapper?: {
            [key: string]: {
                to: string,
                fn?: (item: Record<string, any>) => any
            }
        },
        valueMapper?: {
            [key: string]: {
                fn: (item: Record<string, any>, entity?: Record<string, any>) => any
            }
        }
    ) => {
        const formResponse = props.data.formResponse

        if (optionsMapper) {
            const mapperEntries = Object.entries(optionsMapper)

            formData.value.forEach(formDataItem => {

                if (isTabWithFormData(formDataItem)) {
                    formDataItem.formData.forEach((_formDataItem) => {
                        mapperEntries.map(([key, config]) => {

                            if (_formDataItem.name === config.to) {
                                formResponse[key].forEach((option: any) => {
                                    _formDataItem.componentData.options.push(config.fn ? config.fn(option) : option)
                                })
                            }
                        })
                    })

                    return
                }

                mapperEntries.map(([key, config]) => {

                    if (formDataItem.name === config.to) {
                        formResponse[key].forEach((option: any) => {
                            formDataItem.componentData.options.push(config.fn ? config.fn(option) : option)
                        })
                    }
                })
            })
        }

        if (props.data.id) {
            Object.keys(formDataValues).map((key) => {
                formDataValues[key] = valueMapper && valueMapper[key] ?
                    valueMapper[key].fn(formResponse.entity![key], formResponse.entity) :
                    formResponse.entity![key]
            })
        }
    }

    return {
        initForm,
        initFormWithTabs,

        fillComponents,

        getFormDataValues,
        formRequestBody,

        select,
        selectWrap,
        input,
        date,
        datetime,
        inputFile,
        textArea,
        editor,
        checkbox,
        switcher
    }
}