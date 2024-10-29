import { Link } from "react-router-dom"

export function NotFound() {
    return(
        <div>
            <h1>OOOOOPS, essa página do not exists!</h1>

            <Link to='/'>Acessar a página Home</Link>
        </div>
    )
}