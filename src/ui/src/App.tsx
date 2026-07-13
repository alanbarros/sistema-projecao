import { Routes, Route } from 'react-router-dom'
import { CatalogoPage } from './pages/CatalogoPage'
import { ItemFormPage } from './pages/ItemFormPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogoPage />} />
      <Route path="/novo" element={<ItemFormPage />} />
      <Route path="/editar/:id" element={<ItemFormPage />} />
    </Routes>
  )
}

export default App
