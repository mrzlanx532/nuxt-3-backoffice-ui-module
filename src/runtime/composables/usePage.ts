import { useNuxtApp, useAsyncData, useRouter } from '#imports'
import type { Component, Ref } from 'vue'
import { type IItem, type IBrowser } from '@/components/Base/Browser/Browser.vue';
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from '#vue-router'
import { FetchError } from 'ofetch'

export interface IConfigCreateEdit {
    formURL: string,
    modalComponent: Component,
    modalTitle: string,
    notificationMessage: string,
    modalConfig?: {
        isPreventClickOverlay?: boolean,
        modalContainerClass?: string
    }
}

export interface IConfigDelete {
    deleteURL: string,
    notificationMessage: string,
    redirectURL?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric,
    logicErrorStatusCode?: number
}

export const usePage = () => {

    const item: Ref<IItem|undefined> = ref()
    const browserEl: Ref<IBrowser|null> = ref(null)

    const {
        $modal,
        $notification,
        $authFetch
    } = useNuxtApp()

    const onClickCreate = async (config: IConfigCreateEdit) => {
        const formResponse = await $authFetch(config.formURL, {
            method: 'GET',
        })

        $modal.load(config.modalComponent, {
            title: config.modalTitle,
            formResponse
        }, config.modalConfig).then(() => {
            browserEl.value!.reset()
            $notification.push({type: 'success', message: config.notificationMessage})
        })
    }

    const onClickEdit = async (config: IConfigCreateEdit) => {
        const formResponse = await $authFetch(config.formURL, {
            method: 'GET',
            params: {
                id: item.value!.id,
            },
        })

        $modal.load(config.modalComponent, {
            title: config.modalTitle,
            id: item.value!.id,
            formResponse
        }, config.modalConfig).then(() => {
            $notification.push({type: 'success', message: config.notificationMessage})

            if (browserEl.value) {
                browserEl.value!.reset(true)
            }
        })
    }

    const onClickDelete = (config: IConfigDelete) => {
        $modal.confirm().then(async (isAgree: boolean) => {
            if (!isAgree) {
                return
            }

            try {
                await $authFetch(config.deleteURL, {
                    method: 'POST',
                    body: {
                        id: item.value!.id,
                    },
                })
            } catch (e) {

                if (e instanceof FetchError) {
                    if (e.statusCode === (config.logicErrorStatusCode ? config.logicErrorStatusCode : 409)) {
                        $notification.push({type: 'danger', message: e.data.message})

                        return
                    }

                    $notification.push({type: 'danger', message: 'Ошибка сервера'})
                }

                return
            }

            $notification.push({type: 'success', message: config.notificationMessage})
            item.value = {}

            if (browserEl.value !== null) {
                browserEl.value.reset()
                browserEl.value.closeDetail()

                return
            }

            if (config.redirectURL) {
                await useRouter().push(config.redirectURL)
            }
        })
    }

    const SSRLoadDetail = async (item: Ref<IItem|undefined>, detailURL: string, id: string|string[]) => {

        const response = await useAsyncData(
            detailURL.replaceAll('/', '_'),
            () => $authFetch(detailURL, {
                params: {
                    id: id,
                }
            }),
        )

        if (response.status.value === 'error') {
            throw createError({
                statusCode: 404,
                message: 'Страницы не существует',
            })
        }

        if (
            typeof response.data.value === 'object' &&
            response.data.value !== null
        ) {
            item.value = response.data.value
        }
    }

    const onItemUpdated = (_item: IItem) => {
        item.value = _item
    }

    const initBrowserMultiple = () => {
        const selectedIds: Ref<string[]> = ref([])
        const isOpenBulkActions = ref(false)
        const onChangeSelectedIds = (ids: string[]) => {
            isOpenBulkActions.value = true
            selectedIds.value = ids
        }
        const onClickBulkActions = () => {
            isOpenBulkActions.value = true
        }

        const onCloseBulkActions = () => {
            isOpenBulkActions.value = false
        }

        return {
            selectedIds,
            isOpenBulkActions,
            onChangeSelectedIds,
            onClickBulkActions,
            onCloseBulkActions
        }
    }

    return {
        browserEl,
        item,

        onClickCreate,
        onClickEdit,
        onClickDelete,
        onItemUpdated,

        SSRLoadDetail,

        /** Browser Multiple Select */
        initBrowserMultiple
    }
}