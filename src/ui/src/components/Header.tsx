import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Sistema de Projeção Litúrgica
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Catálogo</Link>
          <Link to="/novo" className="nav-link">Novo Item</Link>
          <Link to="/roteiros" className="nav-link">Roteiros</Link>
        </nav>
      </div>
    </header>
  )
}
