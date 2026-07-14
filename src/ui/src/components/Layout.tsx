import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
  pageTitle?: string
  breadcrumb?: { label: string; to?: string }[]
}

export function Layout({ children, pageTitle, breadcrumb }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">Projecao</span>
          <h1>Sistema Liturgico</h1>
          <p>Gestao de projecao em tempo real</p>
        </div>

        <nav className="nav">
          <Link
            to="/"
            style={{ textDecoration: 'none' }}
          >
            <button className={isActive('/') && !isActive('/roteiros') ? 'active' : ''}>
              Catalogo
            </button>
          </Link>
          <Link
            to="/roteiros"
            style={{ textDecoration: 'none' }}
          >
            <button className={isActive('/roteiros') ? 'active' : ''}>
              Celebracoes
            </button>
          </Link>
        </nav>

        <div className="sidebar-foot">
          Sistema de Projecao Liturgica v1.0
        </div>
      </aside>

      <main>
        <div className="topbar">
          <div className="crumb">
            {breadcrumb ? (
              breadcrumb.map((item, i) => (
                <span key={i}>
                  {item.to ? (
                    <Link to={item.to} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                  {i < breadcrumb.length - 1 && ' / '}
                </span>
              ))
            ) : (
              <span>Area de trabalho</span>
            )}
            {pageTitle && <strong>{pageTitle}</strong>}
          </div>
          <div className="status">
            Disponivel localmente
          </div>
        </div>

        <div className="view">
          {children}
        </div>
      </main>
    </div>
  )
}
