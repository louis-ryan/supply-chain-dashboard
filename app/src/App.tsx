import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Facilities } from './pages/Facilities'
import { Suppliers } from './pages/Suppliers'
import { Products } from './pages/Products'
import { Shipments } from './pages/Shipments'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="products" element={<Products />} />
          <Route path="shipments" element={<Shipments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
