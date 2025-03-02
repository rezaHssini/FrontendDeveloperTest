import type { ErrorResponse } from '@apollo/client/link/error'
import router from '../router'

export class ApolloGraphQLErrorHandler {
  constructor() {}

  gqlErrorHandler = async (
    graphQLErrors: ErrorResponse['graphQLErrors'],
    operation: ErrorResponse['operation'],
  ) => {
    const messages = []
    graphQLErrors.forEach(async (error) => {
      switch (error.extensions.code) {
        case 404:
        case 'not-found':
          // await router.push({ path: 'not-found' })
          break
        case 401:
        case 403:
        case 'access-denied':
          await router.push({ name: 'AccessDenied' })
          break
        case 500:
        case 502:
        case 503:
          await router.push({ name: 'ServerError' })
          break
        case 429:
          await router.push({ name: 'ManyRequests' })
          break
        case 'constraint-violation':
        case 'permission-error':
          break
        default:
          if (error.extensions.message) {
            messages.push(error.message)
          }

          break
      }
    })

    messages.forEach((message) => {
      console.error(message)
    })
  }

  networkErrorHandler = async (
    networkError: ErrorResponse['networkError'],
    operation: ErrorResponse['operation'],
  ) => {
    if (
      networkError.name === 'TypeError' &&
      networkError.message === 'Failed to fetch' &&
      networkError.cause == null
    ) {
      await router.push({ name: 'CORSPolicy' })
    } else {
      if (networkError.name === 'Error') {
      } else {
        // if (networkError.message.includes('404')) {
        //   router.push({ path: 'not-found' })
        // } else {
        //   await router.push({ name: 'ContactSupport' })
        // }
      }
    }
  }
}
