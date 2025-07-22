import { useAccount } from 'wagmi'

import { Button } from './ui/button'

export function ConnectButton() {
  const { address } = useAccount()

  if (address) {
    return (
      <span className="bg-accent rounded-md px-3 py-1.5 text-sm">
        Connected
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm">Connect</Button>
    </div>
  )
}
