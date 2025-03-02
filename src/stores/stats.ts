import { ApolloService } from '@/apollo/apollo-client'
import { mock_data } from '@/mock/data'
import { gql } from '@apollo/client/core'
import { defineStore } from 'pinia'

export class GetSystemStatDto {
  totalUsersCount!: number
  dayTopUsers!: { id: string; email: string; requestsCount: number }[]
  totalDayRequests!: number
  totalWeekRequests!: number
  totalMonthRequests!: number

  lastMonthRequestsHistory!: {
    date: Date
    providers: { provider: string; count: number; tokens: number }[]
  }[]
}

export const useStatStore = defineStore('stat', () => {
  async function getSystemStat(): Promise<GetSystemStatDto> {
    try {
      const { client } = new ApolloService().getApolloClient()
      const query = gql`
        query GetSystemStats {
          systemStats {
            totalUsersCount
            dayTopUsers {
              id
              email
              requestsCount
            }
            totalDayRequests
            totalWeekRequests
            totalMonthRequests
            lastMonthRequestsHistory {
              date
              providers {
                provider
                count
                tokens
              }
            }
          }
        }
      `
      const { data } = await client.query({
        query,
      })

      return data
    } catch (err) {
      return mock_data
    }
  }

  return { getSystemStat }
})
