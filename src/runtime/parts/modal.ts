export default class ModalManager {
  public componentFilename = null
  public componentProps = null
  public isPreset = null
  public instance = null

  #load(name: string, props = {}, isPreset = false) {

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
    this.isPreset.value = isPreset

    return promise
  }

  confirm(props = {}) {
    return this.#load('Confirm', props, true)
  }

  load(name: string, props = {}) {
    return this.#load(name, props)
  }
}
