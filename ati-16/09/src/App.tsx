import { useState } from "react";

import logoImg from './assets/Logo.png'
import './App.css'


function App() {

  const [textoFrase, setTextoFrase] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(0)

  const allFrases = [
    {
      id: 1,
      nome: 'Bom dia',
      frases: ['Acordar de bem com a vida é o primeiro passo para ter um dia abençoado!',
        'A melhor forma de acordar é pular da cama e se preocupar em correr atrás de todos os seus sonhos!',
        'Escreva em seu coração: todo dia é o melhor dia do ano.',
        'Bom dia! Não se esqueça que a sua alma é o reflexo do sol, tão forte e brilhante quanto um girassol.',

      ]
    },

    {
      id: 2,
      nome: 'Motivação',
      frases: ['Siga os bons e aprenda com eles.', 'O bom-senso vale mais do que muito conhecimento.',
        'O riso é a menor distância entre duas pessoas.',
        'Deixe de lado as preocupações e seja feliz!',
        'Realize o óbvio, penso no improvável e conquiste o impossível.',


      ]
    },
  ]

  function handleSwitchCategory(index: number) {
    setCategoriaSelecionada(index)
  }

  function gerarFrase() {
    let numeroAleatorio = Math.floor(Math.random() * allFrases[categoriaSelecionada].frases.length)
    setTextoFrase(`"${allFrases[categoriaSelecionada].frases[numeroAleatorio]}"`)
  }


  return (
    <div className="container">

      <img src={logoImg} alt="logo" className="logo" />

      <h2 className="title"> Categorias</h2>

      <section className="category-area">

        {allFrases.map((item, index) => (
          <button key={item.id} className="category-button"
            style={{
              borderWidth: item.nome === allFrases[categoriaSelecionada].nome ? 10 : 0,
              borderColor: '#1fa4db'
            }}
            onClick={() => handleSwitchCategory(index)}
          >
            {item.nome}



          </button>
        ))}

      </section>

      <button className="button-frase" onClick={gerarFrase}>Gerar Frase</button>

      {textoFrase !== '' &&
        <p className="textoFrase"> {textoFrase}</p>
      }



    </div>
  )
}

export default App
