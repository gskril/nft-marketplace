import { Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/layout'
import { CollectionScreen } from '@/screens/Collection'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CollectionScreen />} />
      </Routes>
    </Layout>
  )
}

export default App
