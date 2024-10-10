import { useState, FormEvent } from 'react'
import logoImg from './assets/Head-Wolf-Logo-Design-Inspiration-Graphics-39255511-1.jpg'
import './App.css'


interface InfoProps {
  title: string;
  preco: string | number;

}

function App() {
  const [nome, setNome] = useState("")
  const [preco, setPreco] = useState("")

  const [info, setInfo] = useState<InfoProps>()

  function imprimir(event: FormEvent) {
    event.preventDefault();

    return (
      setInfo({
        title: nome,
        preco: formatarMoeda(preco),
      })

    )

  }

  function formatarMoeda(valor: number) {
    let valorFormatado = valor.toLocaleString("pt-br",
      {
        style: 'currency',
        currency: 'BRL'
      }
    )

    return valorFormatado;
  }

  return (

    <main className='container'>

      <div >

        <div className='marca'>  
          <img src={logoImg} className='logo' alt="" />

          <h1 className='title'> Cadastro de Produtos</h1> 
          </div>


        <form onSubmit={imprimir} >

          <label >Nome do Produto:</label>

          <input type='text' className='input' value={nome} required onChange={(e) => setNome(String(e.target.value))} />

          <label >Preço:</label>

          <input type='number' className='input' value={preco} required onChange={(e) => setPreco(Number(e.target.value))} />


          <input type="submit" className='button' value='imprimir' />
        </form>



        {info && Object.keys(info).length > 0 && (

          <section className='result'>


            <span>Nome do Produto: {info.title}</span>

            <span>Preço: {info.preco}</span>

          </section>
        )}

      </div>


    </main>


  )
}
export default App
