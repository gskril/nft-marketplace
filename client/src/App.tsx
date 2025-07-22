import { Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/layout'
import { CollectionScreen } from '@/screens/collection'

import { NftScreen } from './screens/nft'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CollectionScreen />} />
        <Route path="/item/:chain/:address/:tokenId" element={<NftScreen />} />
      </Routes>
    </Layout>
  )
}

export default App
