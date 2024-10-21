import React, { useState, useRef, useCallback } from 'react'; 
import './App.css'; 

// Define a interface Task que descreve a estrutura de uma tarefa.
interface Task {
  id: number; // ID único da tarefa.
  title: string; // Título da tarefa.
  status: 'A Fazer' | 'Fazendo' | 'Feito'; // Status da tarefa.
  startTime?: number; // Hora de início da tarefa (opcional).
  elapsedTime?: number; // Tempo decorrido (opcional).
  isPaused?: boolean; // Rastreia se a tarefa está pausada (opcional).
  intervalId?: NodeJS.Timeout | null; // Armazena o ID do intervalo para o cronômetro (opcional).
}

// Define a interface Sprint que descreve a estrutura de um sprint.
interface Sprint {
  id: number; // ID único do sprint.
  name: string; // Nome do sprint.
  tasks: Task[]; // Array de tarefas associadas ao sprint.
}

// Componente principal do aplicativo.
const App: React.FC = () => {
  // Define os estados do componente usando hooks.
  const [sprints, setSprints] = useState<Sprint[]>([]); // Estado para armazenar os sprints.
  const [newSprintName, setNewSprintName] = useState(''); // Estado para armazenar o nome da nova sprint.
  const [newTaskTitle, setNewTaskTitle] = useState(''); // Estado para armazenar o título da nova tarefa.
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null); // Estado para armazenar o ID do sprint selecionado.
  const taskInputRef = useRef<HTMLInputElement | null>(null); // Referência para o campo de entrada da tarefa.

  // Função para criar uma nova Sprint.
  const createSprint = useCallback(() => {
    if (newSprintName.trim() === '') return; // Verifica se o nome da sprint não está vazio.
    const newSprint: Sprint = {
      id: sprints.length + 1, // Gera um ID único para a nova sprint.
      name: newSprintName, // Define o nome da nova sprint.
      tasks: [], // Inicializa a lista de tarefas como vazia.
    };
    setSprints(prevSprints => [...prevSprints, newSprint]); // Atualiza o estado adicionando a nova sprint.
    setNewSprintName(''); // Limpa o campo de entrada do nome da sprint.
  }, [newSprintName, sprints]); // Dependências da função.

  // Função para adicionar uma tarefa a um sprint selecionado.
  const addTaskToSprint = useCallback(() => {
    if (selectedSprintId === null || newTaskTitle.trim() === '') return; // Verifica se um sprint está selecionado e se o título da tarefa não está vazio.
    setSprints(prevSprints => {
      const sprint = prevSprints.find(s => s.id === selectedSprintId); // Encontra o sprint selecionado.
      if (sprint) {
        const newTask: Task = {
          id: sprint.tasks.length + 1, // Gera um ID único para a nova tarefa.
          title: newTaskTitle, // Define o título da nova tarefa.
          status: 'A Fazer', // Define o status inicial da tarefa como "A Fazer".
          elapsedTime: 0, // Inicializa o tempo decorrido como 0.
          isPaused: false, // Define como não pausada.
          intervalId: null, // Inicializa o ID do intervalo como null.
        };
        // Atualiza o estado do sprint selecionado adicionando a nova tarefa.
        return prevSprints.map(s => s.id === selectedSprintId ? { ...s, tasks: [...s.tasks, newTask] } : s);
      }
      return prevSprints; // Retorna o estado anterior se o sprint não for encontrado.
    });
    setNewTaskTitle(''); // Limpa o campo de entrada do título da tarefa.
    if (taskInputRef.current) taskInputRef.current.focus(); // Foca o campo de entrada da tarefa após a adição.
  }, [newTaskTitle, selectedSprintId]); // Dependências da função.

  // Função para mover uma tarefa entre os status.
  const moveTask = useCallback((sprintId: number, taskId: number, newStatus: 'A Fazer' | 'Fazendo' | 'Feito') => {
    setSprints(prevSprints => {
      return prevSprints.map(sprint => {
        if (sprint.id === sprintId) { // Verifica se o sprint corresponde ao ID fornecido.
          return {
            ...sprint,
            tasks: sprint.tasks.map(task => {
              if (task.id === taskId) { // Verifica se a tarefa corresponde ao ID fornecido.
                if (newStatus === 'Fazendo') { // Se a tarefa estiver sendo movida para "Fazendo".
                  const startTime = Date.now(); // Armazena o tempo de início.
                  const intervalId = setInterval(() => {
                    setSprints(prevSprints => {
                      return prevSprints.map(sprint => ( {
                        ...sprint,
                        tasks: sprint.tasks.map(t => {
                          if (t.id === taskId && t.status === 'Fazendo' && !t.isPaused) { // Atualiza o tempo decorrido se a tarefa não estiver pausada.
                            return { ...t, elapsedTime: (t.elapsedTime || 0) + 1 }; // Incrementa o tempo decorrido.
                          }
                          return t; // Retorna a tarefa inalterada.
                        }),
                      }));
                    });
                  }, 1000); // Atualiza o estado a cada segundo.
                  return { ...task, status: newStatus, startTime, isPaused: false, intervalId }; // Retorna a tarefa atualizada.
                }
                if (newStatus === 'Feito') { // Se a tarefa estiver sendo movida para "Feito".
                  if (task.intervalId) clearInterval(task.intervalId); // Limpa o intervalo se estiver ativo.
                  const elapsedTime = task.startTime ? Math.floor((Date.now() - task.startTime) / 1000) : 0; // Calcula o tempo decorrido.
                  return { ...task, status: newStatus, elapsedTime: task.elapsedTime ? task.elapsedTime + elapsedTime : elapsedTime, intervalId: null }; // Retorna a tarefa atualizada.
                }
                return { ...task, status: newStatus }; // Retorna a tarefa atualizada com o novo status.
              }
              return task; // Retorna a tarefa inalterada.
            }),
          };
        }
        return sprint; // Retorna o sprint inalterado.
      });
    });
  }, []); // Dependências da função.

  // Função para pausar uma tarefa.
  const pauseTask = useCallback((sprintId: number, taskId: number) => {
    setSprints(prevSprints => {
      return prevSprints.map(sprint => {
        if (sprint.id === sprintId) { // Verifica se o sprint corresponde ao ID fornecido.
          return {
            ...sprint,
            tasks: sprint.tasks.map(task => {
              if (task.id === taskId && task.status === 'Fazendo') { // Verifica se a tarefa está "Fazendo".
                if (task.intervalId) clearInterval(task.intervalId); // Limpa o intervalo ao pausar.
                const elapsedTime = task.startTime ? Math.floor((Date.now() - task.startTime) / 1000) : 0; // Calcula o tempo decorrido.
                return { ...task, isPaused: true, elapsedTime: task.elapsedTime ? task.elapsedTime + elapsedTime : elapsedTime, intervalId: null }; // Retorna a tarefa atualizada.
              }
              return task; // Retorna a tarefa inalterada.
            }),
          };
        }
        return sprint; // Retorna o sprint inalterado.
      });
    });
  }, []); // Dependências da função.

  // Função para reiniciar uma tarefa pausada.
  const restartTask = useCallback((sprintId: number, taskId: number) => {
    setSprints(prevSprints => {
      return prevSprints.map(sprint => {
        if (sprint.id === sprintId) { // Verifica se o sprint corresponde ao ID fornecido.
          return {
            ...sprint,
            tasks: sprint.tasks.map(task => {
              if (task.id === taskId && task.isPaused) { // Verifica se a tarefa está pausada.
                const startTime = Date.now(); // Reseta o tempo de início.
                const intervalId = setInterval(() => {
                  setSprints(prevSprints => {
                    return prevSprints.map(sprint => ( {
                      ...sprint,
                      tasks: sprint.tasks.map(t => {
                        if (t.id === taskId && t.status === 'Fazendo' && !t.isPaused) { // Atualiza o tempo decorrido se a tarefa não estiver pausada.
                          return { ...t, elapsedTime: (t.elapsedTime || 0) + 1 }; // Incrementa o tempo decorrido.
                        }
                        return t; // Retorna a tarefa inalterada.
                      }),
                    }));
                  });
                }, 1000); // Atualiza o estado a cada segundo.
                return { ...task, startTime, isPaused: false, intervalId }; // Retorna a tarefa atualizada.
              }
              return task; // Retorna a tarefa inalterada.
            }),
          };
        }
        return sprint; // Retorna o sprint inalterado.
      });
    });
  }, []); // Dependências da função.

  // Renderização do componente.
  return (
    <div className="App"> {/* Contêiner principal do aplicativo. */}
      <h1>Gerenciamento de Tarefas Scrum</h1> {/* Título do aplicativo. */}

      <div className="new-sprint-container"> {/* Contêiner para a criação de novas sprints. */}
        <input
          type="text"
          value={newSprintName} // Valor do campo de entrada ligado ao estado newSprintName.
          onChange={(e) => setNewSprintName(e.target.value)} // Atualiza o estado ao digitar.
          placeholder="Digite o nome da Sprint" // Texto de placeholder.
          className="input" // Classe CSS para estilização.
        />
        <button className="button" onClick={createSprint}>Criar Sprint</button> {/* Botão para criar uma nova sprint. */}
      </div>

      <div className="new-task-container"> {/* Contêiner para a criação de novas tarefas. */}
        <select onChange={(e) => setSelectedSprintId(Number(e.target.value))} value={selectedSprintId || ''} className="select">
          <option value="" disabled>Selecione a Sprint</option> {/* Opção padrão do seletor. */}
          {sprints.map(sprint => ( // Mapeia os sprints disponíveis para opções no seletor.
            <option key={sprint.id} value={sprint.id}>{sprint.name}</option> // Cada opção representa um sprint.
          ))}
        </select>
        <input
          type="text"
          value={newTaskTitle} // Valor do campo de entrada ligado ao estado newTaskTitle.
          onChange={(e) => setNewTaskTitle(e.target.value)} // Atualiza o estado ao digitar.
          placeholder="Digite o título da Tarefa" // Texto de placeholder.
          ref={taskInputRef} // Atribui a referência ao campo de entrada.
          className="input" // Classe CSS para estilização.
        />
        <button className="button" onClick={addTaskToSprint}>Adicionar Tarefa</button> {/* Botão para adicionar uma nova tarefa. */}
      </div>

      <div className="sprints-container"> {/* Contêiner para exibir os sprints e suas tarefas. */}
        {sprints.map(sprint => ( // Mapeia os sprints disponíveis.
          <div key={sprint.id} className="sprint"> {/* Contêiner para um sprint individual. */}
            <h3>{sprint.name}</h3> {/* Nome do sprint. */}
            <div className="columns"> {/* Contêiner para colunas de status das tarefas. */}
              {['A Fazer', 'Fazendo', 'Feito'].map(status => ( // Mapeia os status das tarefas.
                <div key={status} className="column"> {/* Contêiner para uma coluna de status. */}
                  <h4>{status}</h4> {/* Cabeçalho da coluna com o status. */}
                  {sprint.tasks.filter(task => task.status === status).map(task => ( // Filtra e mapeia as tarefas com o status correspondente.
                    <div key={task.id} className={`task ${task.status.replace(' ', '-')}`}> {/* Contêiner para uma tarefa individual. */}
                      <span>{task.title}</span> {/* Título da tarefa. */}
                      {task.elapsedTime !== undefined && ( // Verifica se o tempo decorrido está definido.
                        <span> - Tempo: {task.elapsedTime}s</span> // Exibe o tempo decorrido.
      )}
                      <div className="task-buttons"> {/* Contêiner para botões de ação da tarefa. */}
                        {status === 'A Fazer' && ( // Se a tarefa está "A Fazer".
                          <button className="button" onClick={() => moveTask(sprint.id, task.id, 'Fazendo')}>Iniciar</button> // Botão para iniciar a tarefa.
                        )}
                        {status === 'Fazendo' && ( // Se a tarefa está "Fazendo".
                          <>
                            <button className="button" onClick={() => moveTask(sprint.id, task.id, 'Feito')}>Concluir</button> {/* Botão para concluir a tarefa.  */}
                            <button className="button" onClick={() => pauseTask(sprint.id, task.id)}>
                              {task.isPaused ? 'Reiniciar' : 'Pausar'} {/* Botão para pausar ou reiniciar a tarefa dependendo do estado.  */}
                            </button>
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

// Exporta o componente principal para uso em outros arquivos.
export default App;
