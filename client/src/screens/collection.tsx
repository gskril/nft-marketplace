import { Link } from 'react-router-dom'

import { useCollection, useNfts } from '@/components/useHono'

const collectionSlug = 'hoomanspfp'

export function CollectionScreen() {
  const collection = useCollection(collectionSlug)
  const nfts = useNfts(collectionSlug)

  if (collection.isLoading) return <p>Loading...</p>
  if (collection.isError) return <p>Error</p>
  if (!collection.data) return <p>No data found</p>

  const stats = [
    {
      label: 'Total Volume',
      value: `${collection.data.stats.total.volume.toFixed(2)} ETH`,
    },
    {
      label: 'Floor Price',
      value: `${collection.data.stats.total.floor_price.toFixed(4)} ETH`,
    },
    {
      label: 'Unique Owners',
      value: collection.data.stats.total.num_owners,
    },
  ]

  return (
    <div className="flex flex-col gap-4 p-2 pt-4">
      <div>
        <h1 className="text-2xl font-bold">{collection.data.name}</h1>
        <span className="text-sm text-gray-500">
          {collection.data.description}
        </span>
      </div>

      <hr />

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="text-sm text-gray-500 uppercase">
              {stat.label}
            </span>
            <span className="font-medium">{stat.value}</span>
          </div>
        ))}
      </div>

      <hr />

      <NftGrid nfts={nfts} chain={collection.data.contracts[0].chain} />
    </div>
  )
}

function NftGrid({
  nfts,
  chain,
}: {
  nfts: ReturnType<typeof useNfts>
  chain: string
}) {
  if (nfts.isLoading) return <p>Loading...</p>
  if (nfts.isError) return <p>Error</p>
  if (!nfts.data) return <p>No data found</p>

  return (
    <div className="grid grid-cols-2 gap-4">
      {nfts.data.nfts.map((nft) => (
        <Link
          key={nft.identifier}
          to={`/item/${chain}/${nft.contract}/${nft.identifier}`}
          className="overflow-hidden rounded-lg border border-gray-200"
        >
          <img src={nft.image_url} alt={nft.name} className="" />
          <div className="p-2">
            <span className="leading-0">{nft.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
