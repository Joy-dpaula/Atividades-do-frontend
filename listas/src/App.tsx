import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './App.css'

export default function App() {


  const inputRef = useRef<HTMLInputElement>(null);

  const firstRender = useRef(true);



  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState<string[]>([])

  const [editTask, setEditTask] = useState({
    enabled: false,
    task: ''
  })

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem('@item')

    if(tarefasSalvas){
      setTasks(JSON.parse(tarefasSalvas));
    }

  }, [])

  useEffect(() => {

    if(firstRender.current){
      firstRender.current = false;
      return;
    }

    localStorage.setItem('@item', JSON.stringify(tasks))

  }, [tasks])


  const handleRegister = useCallback(() => {

      if(!input) {
        alert("Digite o nome da tarefa")
        return;
      }
  
      if (editTask.enabled) {
        handleSaveEdit();
        return;
      }
  
      setTasks(tarefas => [...tarefas, input])
      setInput("")
  
     
  

  }, [input, tasks])

 

  function handleSaveEdit() {

    const findIndexTasks = tasks.findIndex(task => task === editTask.task)
    const allTasks = [...tasks];

    allTasks[findIndexTasks] = input;
    setTasks(allTasks);

    setEditTask({
      enabled: false,
      task: ''

    })

    setInput("")



  }

  function handleDelete(item: string) {

    const removeTask = tasks.filter(task => task !== item)
    setTasks(removeTask)

    


  }

  function handleEdit(item: string) {

    inputRef.current?.focus();
    setInput(item)

    setEditTask({
      enabled: true,
      task: item

    })

   

  }

  const totalTarefas = useMemo(() => {
    return tasks.length
  }, [tasks])

  return (
    <div className='container'>
      <div className='bloco'>
      <h1 className='titulo'>Lista de Tarefas</h1>

    
    <div className='bloco1'>

    <input  type="text" placeholder='Digite o nome da tarefa' value={input} onChange={(e) => setInput(e.target.value)} ref={inputRef} />

<button className='button1' onClick={handleRegister} >  {editTask.enabled ? "Atualizar tarefa" : "Adicionar tarefa"}</button>

<strong>
  Você tem {totalTarefas} tarefas!
</strong>
<br /><br />


    </div>
     
      {tasks.map((item, index) => (
        <section key={item}>
          <span> {item} </span>
          <hr />
          <section className='button2'>
          
          <button   onClick={() => handleEdit(item)} > Editar</button>
          <button   onClick={() => handleDelete(item)} > Excluir</button>

          </section>
         
        </section>
      ))}

    </div>

    </div>
  )
}

