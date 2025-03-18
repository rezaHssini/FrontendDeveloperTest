import type { AsyncMethodDecorator, MethodDecorator } from './async-method.decorator'

export function CatchErrorAsync(bubble = true): AsyncMethodDecorator {
  return (target: any, _propertyKey: string | symbol, propertyDescriptor: PropertyDescriptor) => {
    const originalMethod = propertyDescriptor.value
    propertyDescriptor.value = async function (...args: any[]): Promise<any> {
      try {
        const result = await originalMethod.apply(this, args)

        return result
      } catch (error: any) {
        const targetName = typeof target === 'function' ? target.name : target.constructor.name
        error = typeof error === 'string' ? new Error(error) : error
        error.message = error.defaultMessage ? error.defaultMessage : error.message
        console.log(`${targetName}: ${error.message}`)

        if (bubble) {
          throw error
        }
      }
    }
  }
}

export function CatchError(bubble = true): MethodDecorator {
  return (target: any, _propertyKey: string | symbol, propertyDescriptor: PropertyDescriptor) => {
    const originalMethod = propertyDescriptor.value
    propertyDescriptor.value = function (...args: any[]): any {
      try {
        return originalMethod.apply(this, args)
      } catch (error: any) {
        const targetName = typeof target === 'function' ? target.name : target.constructor.name
        error = typeof error === 'string' ? new Error(error) : error
        error.message = error.defaultMessage ? error.defaultMessage : error.message
        console.log(`${targetName}: ${error.message}`)

        if (bubble) {
          throw error
        }
      }
    }
  }
}
