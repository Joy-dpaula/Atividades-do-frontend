import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

interface Task {
  id: number;
  title: string;
  status: string;
}

interface Sprint {
  id: number;
  name: string;
  tasks: Task[];
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  const [sprintName, setSprintName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null);

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem('@sprints');
    if (tarefasSalvas) {
      setSprints(JSON.parse(tarefasSalvas));
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem('@sprints', JSON.stringify(sprints));
  }, [sprints]);

  const handleRegisterSprint = useCallback(() => {
    if (!sprintName) {
      alert('Digite o nome da sprint');
      return;
    }

    const newSprint: Sprint = {
      id: sprints.length + 1,
      name: sprintName,
      tasks: []
    };

    setSprints((sprints) => [...sprints, newSprint]);
    setSprintName('');
  }, [sprintName, sprints]);

  const handleRegisterTask = useCallback(() => {
    if (!taskTitle || selectedSprint === null) {
      alert('Selecione uma sprint e digite o título da tarefa');
      return;
    }

    const updatedSprints = sprints.map((sprint) => {
      if (sprint.id === selectedSprint) {
        const newTask: Task = {
          id: sprint.tasks.length + 1,
          title: taskTitle,
          status: 'A Fazer'
        };
        return { ...sprint, tasks: [...sprint.tasks, newTask] };
      }
      return sprint;
    });

    setSprints(updatedSprints);
    setTaskTitle('');
  }, [taskTitle, selectedSprint, sprints]);

  const toggleTaskStatus = useCallback((sprintId: number, taskId: number) => {
    const updatedSprints = sprints.map((sprint) => {
      if (sprint.id === sprintId) {
        const updatedTasks = sprint.tasks.map((task) => {
          if (task.id === taskId) {
            let newStatus = task.status;
            if (task.status === 'A Fazer') {
              newStatus = 'Fazendo';
            } else if (task.status === 'Fazendo') {
              newStatus = 'Feito';
            } 
            // Se o status for "Feito", não muda mais
            return { ...task, status: newStatus };
          }
          return task;
        });
        return { ...sprint, tasks: updatedTasks };
      }
      return sprint;
    });

    setSprints(updatedSprints);
  }, [sprints]);

  return (
    <div>
      <div className='container'>
        <div className='bloco'>
          <h1 className='titulo'>Gerenciamento de Sprint e Tarefas</h1>

          <div className='bloco1'>
            <p className='text'>Sprint</p>
            <input
              type="text"
              placeholder='Digite o nome da sprint'
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              ref={inputRef}
              className='sprint-input'
            />
            <button className='button1' onClick={handleRegisterSprint}>
              Adicionar Sprint
            </button>

            <br /><br />

            <select
              className='select'
              value={selectedSprint ?? ''}
              onChange={(e) => setSelectedSprint(Number(e.target.value))}>
              <option value="" disabled>Selecione uma sprint</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </option>
              ))}
            </select>

            <br />

            <p className='text'>Tarefa </p>
            <input
              type="text"
              placeholder='Digite o título da tarefa'
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className='task-input'
            />
            <button className='button1' onClick={handleRegisterTask}>
              Adicionar Tarefa
            </button>
          </div>

          <h2 className='titulo'>Sprints e Tarefas</h2>

          {sprints.map((sprint) => (
            <div className='blocao' key={sprint.id}>
              <hr />
              <h2>{sprint.name}</h2>
              <div className='column'>
                {sprint.tasks.map((task) => (
                  <div key={task.id} className='bloquinho'>
                    <span className='bloco6'>
                      {task.title}
                      <button className='button1' onClick={() => toggleTaskStatus(sprint.id, task.id)}>
                        {task.status}
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer>
        <hr />
        <p className='footer'>© 2024 Company, Inc</p>
      </footer>
    </div>
  );
}
