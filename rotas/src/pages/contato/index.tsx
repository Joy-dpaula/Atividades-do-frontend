import { Home } from "../home"
import { Link } from "react-router-dom"

export function Contato(){
    return(
        <div>
            <h1>Bem vindo a pagina de Contato</h1>
            <h3>Telefone: (12) 4002-8922</h3>
            <br />
            <Link to='/'>Ir para a home</Link>
        </div>
    )
}