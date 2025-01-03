import type { ReturnType } from 'birpc'
import type { Component } from 'vue'

export interface ITabItem {
    title: string,
    component: Component
}

export const useTabs = () => {

    const selectedTab = ref(0)

    const initTabs = (tabs: ITabItem[]) => {
        const selectedTabComponent = initSelectedTabComponent(tabs)
        watchSelectedTab(tabs, selectedTabComponent)

        return {
            tabs,
            selectedTabComponent,
            onChangeSelectedTab
        }
    }

    const initSelectedTabComponent = (tabs: ITabItem[]) => {
        return shallowRef(tabs[selectedTab.value].component)
    }

    const watchSelectedTab = (tabs: ITabItem[], selectedTabComponent: ReturnType<typeof initSelectedTabComponent>) => {
        watch(
            selectedTab,
            () => {
                selectedTabComponent.value = tabs[selectedTab.value].component
            }
        )
    }

    const onChangeSelectedTab = (tabIndex: number) => {
        selectedTab.value = tabIndex;
    }

    return {
        initTabs
    }
}