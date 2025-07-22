import { type FulfillmentData, openseaFetch } from '@server/opensea'
import type { Context } from 'hono'
import { z } from 'zod'

const fulfillListingSchema = z.object({
  listing: z.object({
    hash: z.string(),
    chain: z.string(),
    protocol_address: z
      .string()
      .default('0x0000000000000068f116a894984e2db1123eb395'),
  }),
  fulfiller: z.object({
    address: z.string(),
  }),
})

export async function fulfillListing(c: Context) {
  const { listing, fulfiller } = fulfillListingSchema.parse(await c.req.json())

  const res = await openseaFetch(`/listings/fulfillment_data`, {
    method: 'POST',
    body: JSON.stringify({ listing, fulfiller }),
  })

  const json = (await res.json()) as FulfillmentData
  return c.json(json)
}

const fulfillOfferSchema = z.object({
  offer: z.object({
    hash: z.string(),
    chain: z.string(),
    protocol_address: z
      .string()
      .default('0x0000000000000068f116a894984e2db1123eb395'),
  }),
  fulfiller: z.object({
    address: z.string(),
  }),
  consideration: z.object({
    asset_contract_address: z.string(),
    token_id: z.coerce.number(),
  }),
})

export async function fulfillOffer(c: Context) {
  const { offer, fulfiller, consideration } = fulfillOfferSchema.parse(
    await c.req.json()
  )

  const res = await openseaFetch(`/offers/fulfillment_data`, {
    method: 'POST',
    body: JSON.stringify({ offer, fulfiller, consideration }),
  })

  const json = (await res.json()) as FulfillmentData
  return c.json(json)
}
