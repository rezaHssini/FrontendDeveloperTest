import { ApolloService } from '@/apollo/apollo-client'
import { mock_data } from '@/mock/data'
import { sanitizeString } from '@/utils/helpers.ts/string.helper'
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

export interface CreateNewDeviceDto {
  name: string
  model: string
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

  async function createNewDevice(dto: CreateNewDeviceDto): Promise<boolean> {
    try {
      const { client } = new ApolloService().getApolloClient()

      dto.name = sanitizeString(dto.name)
      delete dto.model

      await client.mutate({
        query: gql`
          mutation CreateDevice($input: CreateNewDeviceDto!) {
            createDevice(input: $input) {
              id
              name
              model
            }
          }
        `,
      })

      return true
    } catch (error) {}
  }

  async function getDayTopUsersForPastMonth(): Promise<[]> {
    try {
      const { client } = new ApolloService().getApolloClient()

      const customHeaders = {
        'X-API-KEY': 'b27f9c2a-8d4e-4a91-a5c1-3f6d9e7e21f8',
      }

      const query = gql`
        query GetDayTopUsersForPastMonth {
          systemStats {
            lastMonthRequestsHistory {
              date
              topUsers: dayTopUsers {
                id
                email
                requestsCount
              }
            }
          }
        }
      `

      const { data } = await client.query({ query, context: customHeaders })

      return data?.lastMonthRequestsHistory || []
    } catch (err) {
      console.error('Error fetching top users for past month:', err)
      return []
    }
  }

  return { getSystemStat, createNewDevice, getDayTopUsersForPastMonth }
})
