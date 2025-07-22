import type { Hex } from 'viem'

const OPENASEA_API_URL = 'https://api.opensea.io/api/v2'

export function openseaFetch(path: string, options: RequestInit = {}) {
  return fetch(`${OPENASEA_API_URL}${path}`, {
    ...options,
    headers: {
      'X-API-KEY': process.env.OPENSEA_API_KEY!,
      'Content-Type': 'application/json',
    },
  })
}

export type Collection = {
  collection: string
  name: string
  description: string | null
  image_url: string | null
  banner_image_url: string | null
  owner: Hex
  category: string | null
  project_url: string | null
  contracts: {
    address: Hex
    chain: 'base'
  }[]
  fees: {
    fee: number
    recipient: Hex
    required: boolean
  }[]
  total_supply: number
  created_date: string
}

export type CollectionStats = {
  total: {
    volume: number
    sales: number
    num_owners: number
    market_cap: number
    floor_price: number
    floor_price_symbol: string
    average_price: number
  }
  intervals: {
    interval: string
    volume: number
    volume_diff: number
    volume_change: number
    sales: number
    sales_diff: number
    average_price: number
  }[]
}

export type Nft = {
  identifier: string
  collection: string
  contract: Hex
  token_standard: 'erc1155' | 'erc721'
  name: string
  description: string | null
  image_url: string
  display_image_url: string
  display_animation_url: string | null
  metadata_url: string
  opensea_url: string
  updated_at: string
  is_disabled: boolean
  is_nsfw: boolean

  // Only available for specific token requests
  animation_url: string | null
  creator: Hex
  traits: {
    trait_type: string
    display_type: number
    max_value: string
    value: number
  }[]
  owners: {
    address: Hex
    quantity: number
  }[]
}

export type NftEvent = {
  event_type: string
  event_timestamp: number
  transaction?: string
  chain: string
  from_address?: string
  to_address?: string
  nft?: {
    identifier: string
    collection: string
    contract: string
    token_standard: string
    name: string
    description: string
    image_url: string
    display_image_url: string
    display_animation_url: any
    metadata_url: string
    opensea_url: string
    updated_at: string
    is_disabled: boolean
    is_nsfw: boolean
  }
  quantity: number
  payment?: {
    quantity: string
    token_address: string
    decimals: number
    symbol: string
  }
  closing_date?: number
  seller?: string
  buyer?: string
  order_hash?: string
  protocol_address?: string
  order_type?: string
  start_date?: number
  expiration_date?: number
  asset?: {
    identifier: string
    collection: string
    contract: string
    token_standard: string
    name: string
    description: string
    image_url: string
    display_image_url: string
    display_animation_url: any
    metadata_url: string
    opensea_url: string
    updated_at: string
    is_disabled: boolean
    is_nsfw: boolean
  }
  maker?: string
  taker?: string
  criteria: any
  is_private_listing?: boolean
}

type ProtocolData = {
  parameters: {
    offerer: string
    offer: Array<{
      itemType: number
      token: string
      identifierOrCriteria: string
      startAmount: string
      endAmount: string
    }>
    consideration: Array<{
      itemType: number
      token: string
      identifierOrCriteria: string
      startAmount: string
      endAmount: string
      recipient: string
    }>
    startTime: string
    endTime: string
    orderType: number
    zone: string
    zoneHash: string
    salt: string
    conduitKey: string
    totalOriginalConsiderationItems: number
    counter: number
  }
  signature: Hex
}

export type Order = {
  created_date: string
  closing_date: string
  listing_time: number
  expiration_time: number
  order_hash: string
  protocol_data: ProtocolData
  protocol_address: string
  current_price: string
  maker: {
    address: string
    profile_img_url: any
    config: any
  }
  taker: any
  maker_fees: Array<any>
  taker_fees: Array<any>
  side: string
  order_type: string
  cancelled: boolean
  finalized: boolean
  marked_invalid: boolean
  remaining_quantity: number
  maker_asset_bundle: {
    assets: Array<{
      id: any
      token_id: string
      num_sales: any
      background_color: any
      image_url: string
      image_preview_url: any
      image_thumbnail_url: any
      image_original_url: any
      animation_url: any
      animation_original_url: any
      name: string
      description: string
      external_link: string
      asset_contract: {
        address: string
        chain_identifier: string
        schema_name: string
        asset_contract_type: string
      }
      permalink: string
      collection: Collection
      decimals: any
      token_metadata: any
      is_nsfw: boolean
      owner: {
        address: string
        profile_img_url: any
        config: any
      }
    }>
    maker: any
    asset_contract: any
    slug: any
    name: any
    description: any
    external_link: any
    permalink: any
    seaport_sell_orders: any
  }
  taker_asset_bundle: {
    assets: Array<{
      id: any
      token_id: string
      num_sales: any
      background_color: any
      image_url: any
      image_preview_url: any
      image_thumbnail_url: any
      image_original_url: any
      animation_url: any
      animation_original_url: any
      name: string
      description: any
      external_link: any
      asset_contract: {
        address: string
        chain_identifier: string
        schema_name: string
        asset_contract_type: string
      }
      permalink: any
      collection: any
      decimals: number
      token_metadata: any
      is_nsfw: any
      owner: any
    }>
    maker: any
    asset_contract: any
    slug: any
    name: any
    description: any
    external_link: any
    permalink: any
    seaport_sell_orders: any
  }
}

export type FulfillmentData = {
  protocol: string
  fulfillment_data: {
    transaction: {
      function: string
      chain: number
      to: Hex
      value: string
      input_data: {
        parameters: {
          considerationToken: Hex
          considerationIdentifier: string
          considerationAmount: string
          offerer: Hex
          zone: Hex
          offerToken: Hex
          offerIdentifier: string
          offerAmount: string
          basicOrderType: number
          startTime: string
          endTime: string
          zoneHash: Hex
          salt: string
          offererConduitKey: Hex
          fulfillerConduitKey: Hex
          totalOriginalAdditionalRecipients: string
          additionalRecipients: Array<{
            amount: string
            recipient: Hex
          }>
          signature: Hex
        }
      }
    }
    orders: ProtocolData[]
  }
}
