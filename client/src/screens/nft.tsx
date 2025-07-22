import { Link, useParams } from 'react-router-dom'
import { formatEther } from 'viem'

import { Button } from '@/components/ui/button'
import { useNft } from '@/components/useHono'
import { truncateAddress } from '@/lib/utils'

export function NftScreen() {
  const { chain, address, tokenId } = useParams()
  const nft = useNft(chain!, address!, tokenId!)

  if (nft.isLoading) return <p>Loading...</p>
  if (nft.isError) return <p>Error</p>
  if (!nft.data) return <p>No data</p>

  return (
    <div className="flex flex-col gap-4 p-2 pt-4">
      <Link to="/" className="text-sm text-gray-500">
        ← Back to collection
      </Link>

      <hr />

      <img src={nft.data.image_url} alt={nft.data.name} className="w-full" />

      <div>
        <h1 className="text-2xl font-bold">{nft.data.name}</h1>
        <span className="text-sm text-gray-500">
          Owned by {truncateAddress(nft.data.owners[0].address)}
        </span>
      </div>

      <hr />

      {nft.data.listings.length > 0 && (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 uppercase">Buy now for</span>
          <div className="mb-1.5 flex items-center gap-3">
            <span className="text-2xl font-bold">
              {Number(
                formatEther(BigInt(nft.data.listings[0].current_price))
              ).toFixed(4)}{' '}
              ETH
            </span>
            <span className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-500">
              Ends at{' '}
              {new Date(
                nft.data.listings[0].closing_date + 'Z'
              ).toLocaleTimeString('UTC', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <Button>Buy now</Button>
        </div>
      )}

      {nft.data.listings.length > 0 && nft.data.offers.length > 0 && <hr />}

      {nft.data.offers.length > 0 && (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 uppercase">Highest offer</span>
          <div className="mb-1.5 flex items-center gap-3">
            <span className="text-2xl font-bold">
              {Number(
                formatEther(
                  BigInt(
                    nft.data.offers[0].protocol_data.parameters.offer[0]
                      .endAmount
                  )
                )
              ).toFixed(4)}{' '}
              ETH
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
