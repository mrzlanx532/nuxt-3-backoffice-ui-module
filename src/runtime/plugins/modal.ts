interface IConfig {
  isPreset?: boolean,
  isPreventClickOverlay?: boolean,
  modalContainerClass?: string
}

const defaultConfig: IConfig = {
  isPreset: false,
  isPreventClickOverlay: false,
  modalContainerClass: ''
}

export interface IModalManager {
  componentFilename: null,
  componentProps: null,
  isPreset: null,
  instance: null,

  load: (
    name: string,
    props: {
      [key: string]: any
    },
    config?: IConfig
  ) => any,

  confirm: (
    props: {
      question?: string,
      moreText?: string|null,
      agreeText?: string
      disagreeText?: string
  }) => any,
}

export default class ModalManager implements IModalManager{
  public componentFilename = null
  public componentProps = null
  public isPreset = null
  public instance = null

  #load(name: string, props = {}, config: IConfig) {

    const promise = new Promise((resolve, reject) => {

      if (!this.instance) {
        return
      }

      this.instance.resolve = resolve
      this.instance.reject = reject
    })

    if (
      this.componentFilename === null ||
      this.componentProps === null ||
      this.isPreset === null
    ) {
      throw new Error('Unexpected error')
    }

    this.componentFilename.value = name
    this.componentProps.value = props
    this.isPreset.value = config.isPreset
    this.isPreventClickOverlay.value = config.isPreventClickOverlay
    this.modalContainerClass.value = config.modalContainerClass

    return promise
  }

  confirm(props = {}) {
    return this.#load('Confirm', props, {isPreset: true, modalContainerClass: '--small'})
  }

  load(name: string, props = {}, config: IConfig = defaultConfig) {
    return this.#load(name, props, config)
  }
}
