export interface IUseFormDefaultProps {
  data: {
    formResponse: {
      entity?: { [key: string]: any }
      [key: string]: any,
    },
    title: string,
    id?: number
  }
}
