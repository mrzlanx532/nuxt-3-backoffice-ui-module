import moment from 'moment/moment'
import { type Component, defineComponent, h, type Ref } from 'vue'

export type IItem = {[key: string]: any}

export interface IConfigItem {
    columnClass: number,
    title: string,
    name: string,
    toFormat?: (item: {[key: string]: any}) => {},
    component?: {}
    preset?: {
        name: string,
        locale?: string ,
        format?: string
    }
}

export interface IColumn {
    name: string,
    title: string,
    class?: string,
    toFormat?: (item: {[key: string]: any}) => {}
    component?: any | {
        component: Component,
        [key: string]: any
    },
    preset?: {
        name: string
    }
}

export const useBrowser = () => {

    const items: Ref<IItem[]> = ref([])

    const getLocalRequestProperties = (requestProperties: string[]|undefined) => {
        return requestProperties ?
            requestProperties.reduce((acc, value) => {
                return {...acc, [value]: value}
            }, {}) :
            null
    }

    const setItems = (_items: IItem[], localRequestProperties: Ref<{[p: string]: string} | null>) => {
        const preparedItems: IItem[] = [];

        _items.forEach((item: IItem) => {

            const filteredItem: {[key: string]: any} = {};

            for (let value in item) {

                if (!item.hasOwnProperty(value)) {
                    continue;
                }

                if (localRequestProperties.value !== null && !localRequestProperties.value.hasOwnProperty(value)) {
                    continue;
                }

                filteredItem[value] = item[value]
            }

            preparedItems.push(filteredItem)
        })

        items.value = preparedItems
    }

    const dynamicMethods: {[key: string]: (configItem: IConfigItem, item: IItem) => string | null} = {
        timestampToFormatPreset: (configItem: IConfigItem, item: IItem) => {

            if (item[configItem.name] === null) {
                return '-'
            }

            const date = moment(item[configItem.name] * 1000)

            if (!date.isValid()) {
                return null;
            }

            if (configItem.preset?.hasOwnProperty('locale')) {
                date.locale(configItem.preset.locale!)
            } else {
                date.locale('ru')
            }

            return configItem.preset?.format ? date.format(configItem.preset.format) : date.format('DD.MM.YYYY')
        }
    }

    const callPreset = (methodName: string, configItem: IConfigItem, item: IItem) => {
        return dynamicMethods[methodName](configItem, item)
    }

    const firstLoadingIsActive = ref(true)
    const loadingIsActive = ref(false)

    const totalItems = ref(0)

    const isVueComponent = (component: any): boolean => {
        return typeof component === 'object' && ('setup' in component || 'template' in component)
    }

    const getSubComponent = (component: any) => {

        const filteredProperties = Object.assign({}, component)
        delete filteredProperties['component']

        return defineComponent(
            (props) => {
                return () => {
                    return h({...component.component}, {
                        item: props.item,
                        column: props.column,
                        ...filteredProperties
                    })
                }
            },
            {
                props: {
                    item: Object,
                    column: Object
                }
            }
        )
    }

    return {
        /** Pagination */
        totalItems,

        /** Items*/
        items,
        getLocalRequestProperties,
        setItems,

        /** Other */
        firstLoadingIsActive,
        loadingIsActive,
        callPreset,
        isVueComponent,
        getSubComponent
    }
}