import React, { useCallback, useState, useRef } from 'react';
import './App.css';

// Interfaces Task
interface Task {
  id: number;
  title: string;
  status: 'A fazer' | 'Fazendo' | 'Feito';
  startTime?: number; // Inicio da tarefa
  elapsedTime?: number; // Tempo decorrido da tarefa
  isPaused?: boolean; // Rastrear se tarefa pausada
  intervalId?: NodeJS.Timeout | null; // Armazena o id do intervalo do cronônemtro
}

// Interfaces Sprint
interface Sprint {
  id: number;
  name: string;
  tasks: Task[];
}

// Componente principal
const App: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]); // Armazenar as Sprints
  const [newSprintName, setNewSprintName] = useState(''); // Nome da nova Sprint
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);
  const taskInputRef = useRef<HTMLInputElement | null>(null);

  // Função para criar uma nova Sprint
  const createSprint = useCallback(() => {
    if (newSprintName.trim() === '') return;
    const newSprint: Sprint = {
      id: sprints.length + 1,
      name: newSprintName,
      tasks: [],
    };
    setSprints((prevSprints) => [...prevSprints, newSprint]);
    setNewSprintName('');
  }, [newSprintName, sprints]);

  const addTaskToSprint = useCallback(() => {
    if (selectedSprintId === null || newTaskTitle.trim() === '') return;
    setSprints((prevSprints) => {
      const sprint = prevSprints.find((s) => s.id === selectedSprintId);
      if (sprint) {
        const newTask: Task = {
          id: sprint.tasks.length + 1,
          title: newTaskTitle,
          status: 'A fazer',
          elapsedTime: 0,
          isPaused: false,
          intervalId: null,
        };
        return prevSprints.map((s) =>
          s.id === selectedSprintId ? { ...s, tasks: [...s.tasks, newTask] } : s
        );
      }
      return prevSprints;
    });

    setNewTaskTitle('');
    if (taskInputRef.current) taskInputRef.current.focus();
  }, [newTaskTitle, selectedSprintId]);

  // Função de mover as tarefas
  const moveTask = useCallback((sprintId: number, taskId: number, newStatus: 'A fazer' | 'Fazendo' | 'Feito') => {
    setSprints((prevSprints) => {
      return prevSprints.map((sprint) => {
        if (sprint.id === sprintId) {
          return {
            ...sprint,
            tasks: sprint.tasks.map((task) => {
              if (task.id === taskId) {
                if (newStatus === 'Fazendo') {
                  const startTime = Date.now();
                  const intervalId = setInterval(() => {
                    setSprints((prevSprints) => {
                      return prevSprints.map((s) => ({
                        ...s,
                        tasks: s.tasks.map((t) => {
                          if (t.id === taskId && t.status === 'Fazendo' && !t.isPaused) {
                            return { ...t, elapsedTime: (t.elapsedTime || 0) + 1 };
                          }
                          return t;
                        }),
                      }));
                    });
                  }, 1000);

                  return {
                    ...task,
                    status: newStatus,
                    startTime,
                    isPaused: false,
                    intervalId,
                  };
                }

                if (newStatus === 'Feito') {
                  if (task.intervalId) clearInterval(task.intervalId);
                  const elapsedTime = task.startTime ? Math.floor((Date.now() - task.startTime) / 1000) : 0;
                  return { ...task, status: newStatus, elapsedTime: (task.elapsedTime || 0) + elapsedTime, intervalId: null };
                }

                return { ...task, status: newStatus };
              }
              return task;
            }),
          };
        }
        return sprint;
      });
    });
  }, []);

  return (
    <div className='App'>
      <h1>Gerenciamento de Tarefas Scrum</h1>

      <div className='new-sprint-container'>
        <input type="text" value={newSprintName} onChange={(e) => setNewSprintName(e.target.value)} placeholder='Digite o nome da Sprint' className='input' />
        <button className='button' onClick={createSprint}>Criar Sprint</button>
      </div>

      <div className='new-task-container'>
        <select onChange={(e) => setSelectedSprintId(Number(e.target.value))} value={selectedSprintId || ''} className='select'>
          <option value="" disabled>Selecione a sprint</option>
          {sprints.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
          ))}
        </select>

        <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder='Digite o título da tarefa' ref={taskInputRef} className='input' />
      </div>

      <button className='button' onClick={addTaskToSprint}>Adicionar Tarefa</button>

      <div className='sprints-container'>
        {sprints.map((sprint) => (
          <div key={sprint.id} className='sprint'>
            <h3>{sprint.name}</h3>
            <div className='columns'>
              {['A fazer', 'Fazendo', 'Feito'].map((status) => (
                <div key={status} className='column'>
                  <h4>{status}</h4>
                  {sprint.tasks.filter((task) => task.status === status).map((task) => (
                    <div key={task.id} className={`task ${task.status.replace(' ', '-')}`}>
                      <span>{task.title}</span>
                      {task.elapsedTime !== undefined && (
                        <span> - Tempo: {task.elapsedTime}s</span>
                      )}
                      <div className='task-buttons'>
                        {status === 'A fazer' && (
                          <button className='button' onClick={() => moveTask(sprint.id, task.id, 'Fazendo')}>Iniciar</button>
                        )}
                        {status === 'Fazendo' && (
                          <>
                            <button className='button' onClick={() => moveTask(sprint.id, task.id, 'Feito')}>Concluir</button>
                            <button className='button' onClick={() => pauseTask(sprint.id, task.id)}>{task.isPaused ? 'Reiniciar' : 'Pausar'}</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
