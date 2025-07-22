import { useQuery } from '@tanstack/react-query'
import { hcWithType } from 'server/dist/client'
import { Order } from 'server/dist/opensea'
import { useAccount } from 'wagmi'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

export const client = hcWithType(SERVER_URL)

export function useCollection(slug: string) {
  return useQuery({
    queryKey: ['collection', slug],
    queryFn: async () => {
      const res = await client.collections[':slug'].$get({
        param: {
          slug,
        },
      })

      return res.json()
    },
  })
}

export function useNfts(slug: string) {
  return useQuery({
    queryKey: ['nfts', slug],
    queryFn: async () => {
      const res = await client.collections[':slug'].nfts.$get({
        param: {
          slug,
        },
      })

      return res.json()
    },
  })
}

export function useNft(chain: string, address: string, tokenId: string) {
  return useQuery({
    queryKey: ['nft', chain, address, tokenId],
    queryFn: async () => {
      const res = await client.nfts[':chain'][':address'][':tokenId'].$get({
        param: {
          chain,
          address,
          tokenId,
        },
      })

      return res.json()
    },
  })
}

export function useFulfillListing(order: Order) {
  const caller = useAccount()

  return useQuery({
    queryKey: ['fulfillListing', order],
    queryFn: async () => {
      const res = await client.marketplace.listings.fulfill.$post({
        json: {
          listing: {
            chain: 'base',
            hash: order.order_hash,
          },
          fulfiller: {
            address: caller.address,
          },
        },
      })

      return res.json()
    },
  })
}
