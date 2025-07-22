import { Link, useParams } from 'react-router-dom'
import { formatEther, parseAbi } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'

import { ConnectButton } from '@/components/connectButton'
import { Button } from '@/components/ui/button'
import { useFulfillListing, useNft } from '@/components/useHono'
import { truncateAddress } from '@/lib/utils'

export function NftScreen() {
  const { chain, address, tokenId } = useParams()
  const nft = useNft(chain!, address!, tokenId!)

  if (nft.isLoading) return <p>Loading...</p>
  if (nft.isError) return <p>Error</p>
  if (!nft.data) return <p>No data</p>

  return (
    <div className="flex flex-col gap-4 p-2 pt-4">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="text-sm text-gray-500">
          ← Back to collection
        </Link>

        <ConnectButton />
      </div>

      <hr />

      <img src={nft.data.image_url} alt={nft.data.name} className="w-full" />

      <div>
        <h1 className="text-2xl font-bold">{nft.data.name}</h1>
        <span className="text-sm text-gray-500">
          Owned by {truncateAddress(nft.data.owners[0].address)}
        </span>
      </div>

      <hr />

      {/* If there's no listing and no offers, show a message */}
      {nft.data.listings.length === 0 && nft.data.offers.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center rounded-md bg-gray-100 p-4">
          <span className="text-sm text-gray-500 uppercase">
            No listings or offers for this NFT
          </span>
        </div>
      )}

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
          <BuyNowButton nft={nft.data} />
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

function BuyNowButton({ nft }: { nft: ReturnType<typeof useNft>['data'] }) {
  const { address } = useAccount()
  const fulfillListing = useFulfillListing(nft!.listings[0]!)
  const tx = useWriteContract()

  function handleClick() {
    // This shouldn't happen but is nice for typescript
    if (!fulfillListing.data) return
    const transaction = fulfillListing.data.fulfillment_data.transaction
    const params = transaction.input_data.parameters

    tx.writeContract({
      abi: parseAbi([
        'function fulfillBasicOrder_efficient_6GL6yc((address considerationToken,uint256 considerationIdentifier,uint256 considerationAmount,address offerer,address zone,address offerToken,uint256 offerIdentifier,uint256 offerAmount,uint8 basicOrderType,uint256 startTime,uint256 endTime,bytes32 zoneHash,uint256 salt,bytes32 offererConduitKey,bytes32 fulfillerConduitKey,uint256 totalOriginalAdditionalRecipients,(uint256 amount,address recipient)[] additionalRecipients,bytes signature)) payable returns (bool fulfilled)',
      ]),
      address: transaction.to,
      functionName: 'fulfillBasicOrder_efficient_6GL6yc',
      value: BigInt(transaction.value),
      args: [
        {
          ...params,
          considerationIdentifier: BigInt(params.considerationIdentifier),
          considerationAmount: BigInt(params.considerationAmount),
          offerIdentifier: BigInt(params.offerIdentifier),
          offerAmount: BigInt(params.offerAmount),
          startTime: BigInt(params.startTime),
          endTime: BigInt(params.endTime),
          salt: BigInt(params.salt),
          totalOriginalAdditionalRecipients: BigInt(
            params.totalOriginalAdditionalRecipients
          ),
          additionalRecipients: params.additionalRecipients.map(
            (recipient) => ({
              ...recipient,
              amount: BigInt(recipient.amount),
            })
          ),
        },
      ],
    })
  }

  return (
    <Button disabled={!address || !fulfillListing.data} onClick={handleClick}>
      Buy now
    </Button>
  )
}
