import { Link } from "react-router-dom"
import './footer.css'
import logo from '../../assets/globo-ocular (1).png'

export function Footer() {
    return (
        <footer>
            <img className="logo" src={logo} alt='Logo' />

            <div>
                <Link to='/'>Home</Link>
                <Link to='/sobre'>Sobre</Link>
                <Link to='/contato'>Contato</Link>
            </div>

        </footer>
    )
}