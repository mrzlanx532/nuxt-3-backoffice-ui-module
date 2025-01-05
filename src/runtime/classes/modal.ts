import ConfirmComponent from '#backoffice-ui/components/Modal/presets/Confirm.vue'
import type { Component } from 'vue'
import defu from 'defu'

interface IConfig {
  isPreventClickOverlay?: boolean,
  modalContainerClass?: string
}

export interface IModalManager {
  component: null|Component,
  componentProps: null,
  instance: null,

  load: (
    component: Component,
    props: {
      [key: string]: any
    },
    config?: IConfig
  ) => any,

  confirm: (
    props?: {
      question?: string,
      moreText?: string|null,
      agreeText?: string
      disagreeText?: string
  }) => any,
}

export default class ModalManager implements IModalManager{
  public component = null
  public componentProps = null
  public instance = null

  #load(component: Component, props = {}, config: IConfig) {

    const promise = new Promise((resolve, reject) => {

      if (!this.instance) {
        return
      }

      this.instance.resolve = resolve
      this.instance.reject = reject
    })

    if (
      this.component === null ||
      this.componentProps === null
    ) {
      throw new Error('Unexpected error')
    }

    this.component.value = component
    this.componentProps.value = props
    this.isPreventClickOverlay.value = config.isPreventClickOverlay
    this.modalContainerClass.value = config.modalContainerClass

    return promise
  }

  confirm(props = {}) {
    return this.#load(ConfirmComponent, props, {
      modalContainerClass: '--small'
    })
  }

  load(component: Component, props = {}, config: IConfig = {}) {
    return this.#load(component, props, defu(config, {
      isPreventClickOverlay: false,
      modalContainerClass: ''
    }))
  }
}
