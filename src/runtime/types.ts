export namespace Types {
  export namespace Composables {
    export namespace useForm {
      export interface IDefaultProps {
        data: {
          formResponse: {
            entity?: { [key: string]: any }
            [key: string]: any,
          },
          title: string,
          id?: number
        }
      }
    }
  }
}
