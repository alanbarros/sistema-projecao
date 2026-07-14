import { Routes, Route } from 'react-router-dom'
import { CatalogoPage } from './pages/CatalogoPage'
import { ItemFormPage } from './pages/ItemFormPage'
import { RoteirosPage } from './pages/RoteirosPage'
import { RoteiroFormPage } from './pages/RoteiroFormPage'
import { RoteiroEditorPage } from './pages/RoteiroEditorPage'
import { PlayModePage } from './pages/PlayModePage'
import { ProjectorPage } from './pages/ProjectorPage'

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
      <Route path="/roteiros/:id/play" element={<PlayModePage />} />
      <Route path="/projetor/:roteiroId" element={<ProjectorPage />} />
    </Routes>
  )
}

export default App
