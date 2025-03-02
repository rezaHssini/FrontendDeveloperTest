import {
  InMemoryCache,
  split,
  createHttpLink,
  ApolloClient,
  type DefaultOptions,
  type ApolloClientOptions,
} from '@apollo/client/core'
import { RetryLink } from '@apollo/client/link/retry'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { ApolloGraphQLErrorHandler } from './error-handler'
import { useAuthStore } from '@/stores/auth'
import { onError } from '@apollo/client/link/error'

export class ApolloService {
  private store = useAuthStore()
  protected defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }

  protected errorHandler: ApolloGraphQLErrorHandler

  getApolloClient() {
    const options = this.getApolloClientOptions()
    const client = new ApolloClient(options)

    return { client }
  }

  private getGqlUri(): string {
    return 'MOCK_GRAPHQL_SERVER_URL'
  }
  private getRetryLink() {
    const options: RetryLink.Options = {
      delay: {
        initial: 500,
        max: Infinity,
        jitter: true,
      },
      attempts: {
        max: 5,
        retryIf: (error, operation) => !!error && operation.operationName === '',
      },
    }
    const retryLink = new RetryLink(options)

    return retryLink
  }
  private getSplitLink() {
    return split(
      ({ query }) => {
        const definition = getMainDefinition(query)

        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
      },
      this.getWSLink(),
      this.getHttpLink(),
    )
  }
  private getHttpLink() {
    const { accessToken: token } = this.store.getTokens()
    const uri = this.getGqlUri()

    if (token && token.length > 0) {
      return createHttpLink({
        uri: uri,
        headers:
          token != null
            ? {
                Authorization: `Bearer ${token}`,
              }
            : { 'X-Hasura-Role': 'user' },
      })
    } else {
      return createHttpLink({
        uri: uri,
      })
    }
  }
  private getWSLink() {
    let activeSocket
    let timedOut

    const { accessToken: token } = this.store.getTokens()

    return new GraphQLWsLink(
      createClient({
        url: this.getGqlUri(),
        keepAlive: 10000,
        connectionParams: {
          headers:
            token != null
              ? {
                  Authorization: token.length > 0 ? `Bearer ${token}` : undefined,
                }
              : { 'X-Hasura-Role': 'user' },
        },
        on: {
          connected: (socket) => (activeSocket = socket),
          ping: (received) => {
            if (!received) {
              timedOut = setTimeout(() => {
                if (activeSocket.readyState === WebSocket.OPEN) {
                  activeSocket.close(4408, 'Request Timeout')
                }
              }, 5000)
            }
          },
          pong: (received) => {
            if (received) clearTimeout(timedOut)
          },
        },
      }),
    )
  }
  private getErrorLink() {
    return onError(({ graphQLErrors, networkError, operation }) => {
      this.errorHandler = new ApolloGraphQLErrorHandler()
      if (graphQLErrors) {
        this.errorHandler.gqlErrorHandler(graphQLErrors, operation)
      }

      if (networkError) {
        this.errorHandler.networkErrorHandler(networkError, operation)
      }
    })
  }
  private getApolloClientOptions() {
    const link = this.getSplitLink()

    return Object.assign({
      link: this.getRetryLink().concat(this.getErrorLink().concat(link)),
      cache: new InMemoryCache({
        typePolicies: {
          Subscription: {
            fields: {
              broadcast: {
                merge(existing, incoming) {
                  return incoming
                },
              },
              messages: {
                merge(existing, incoming) {
                  return incoming
                },
              },
              user_broadcast: {
                merge(existing, incoming) {
                  return incoming
                },
              },
            },
          },
        },
        addTypename: false,
      }),
      name: 'apolloClient',
      defaultOptions: this.defaultOptions,
    }) as ApolloClientOptions<unknown>
  }
}
