import { Routes, Route } from 'react-router-dom'
import { CatalogoPage } from './pages/CatalogoPage'
import { ItemFormPage } from './pages/ItemFormPage'
import { RoteirosPage } from './pages/RoteirosPage'
import { RoteiroFormPage } from './pages/RoteiroFormPage'
import { RoteiroEditorPage } from './pages/RoteiroEditorPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogoPage />} />
      <Route path="/novo" element={<ItemFormPage />} />
      <Route path="/editar/:id" element={<ItemFormPage />} />
      <Route path="/roteiros" element={<RoteirosPage />} />
      <Route path="/roteiros/novo" element={<RoteiroFormPage />} />
      <Route path="/roteiros/:id" element={<RoteiroEditorPage />} />
      <Route path="/roteiros/:id/editar" element={<RoteiroFormPage />} />
    </Routes>
  )
}

export default App
