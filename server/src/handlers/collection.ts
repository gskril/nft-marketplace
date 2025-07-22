import {
  type Collection,
  type CollectionStats,
  type Nft,
  type NftEvent,
  type Order,
  openseaFetch,
} from '@server/opensea'
import type { Context } from 'hono'
import { z } from 'zod'

const collectionSchema = z.object({
  slug: z.string(),
})

export async function getCollection(c: Context) {
  const { slug } = collectionSchema.parse(c.req.param())
  const [baseRes, statsRes] = await Promise.all([
    openseaFetch(`/collections/${slug}`),
    openseaFetch(`/collections/${slug}/stats`),
  ])

  const [base, stats] = await Promise.all([
    baseRes.json() as Promise<Collection>,
    statsRes.json() as Promise<CollectionStats>,
  ])

  return c.json({ ...base, stats })
}

const nftSchema = z.object({
  slug: z.string(),
})

export async function getNfts(c: Context) {
  const { slug } = nftSchema.parse(c.req.param())
  const res = await openseaFetch(`/collection/${slug}/nfts?limit=100`)

  const json = (await res.json()) as {
    nfts: Nft[]
    next: string | null
  }

  return c.json(json)
}

const getNftSchema = z.object({
  address: z.string(),
  chain: z.string().default('base'),
  tokenId: z.coerce.number(),
})

export async function getNft(c: Context) {
  const { address, chain, tokenId } = getNftSchema.parse(c.req.param())
  const [baseRes, eventsRes, listingsRes, offersRes] = await Promise.all([
    openseaFetch(`/chain/${chain}/contract/${address}/nfts/${tokenId}`),
    openseaFetch(`/events/chain/${chain}/contract/${address}/nfts/${tokenId}`),
    openseaFetch(
      `/orders/${chain}/seaport/listings?asset_contract_address=${address}&token_ids=${tokenId}`
    ),
    openseaFetch(
      `/orders/${chain}/seaport/offers?asset_contract_address=${address}&token_ids=${tokenId}`
    ),
  ])

  const [base, events, listings, offers] = await Promise.all([
    baseRes.json() as Promise<Nft>,
    eventsRes.json() as Promise<{
      asset_events: NftEvent[]
      next: string | null
    }>,
    listingsRes.json() as Promise<{
      orders: Order[]
      next: string | null
    }>,
    offersRes.json() as Promise<{
      orders: Order[]
      next: string | null
    }>,
  ])

  return c.json({ ...base, events: events.asset_events, listings, offers })
}
