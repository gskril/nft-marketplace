import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { getCollection, getNft, getNfts } from './handlers/collection'
import { fulfillListing, fulfillOffer } from './handlers/listings'

export const app = new Hono()
  .use(cors())
  .get('/collections/:slug', getCollection)
  .get('/collections/:slug/nfts', getNfts)
  .get('/nfts/:chain/:address/:tokenId', getNft)
  .post('/marketplace/listings/fulfill', fulfillListing)
  .post('/marketplace/offers/fulfill', fulfillOffer)
// .post('/marketplace/listings/:chain/create', createListing)
// .post('/marketplace/offers/:chain/create', createOffer)

export default app
