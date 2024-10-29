import { Link } from "react-router-dom"
import './header.css'

export function Header() {
    return (
        <header>
            <h2>Criando rotas</h2>

            <div>
              <Link to='/'></Link>
              <Link to='/sobre'>Sobre</Link>
              <Link to='/contato'>Contato</Link>
            </div>
        </header>
    )
}