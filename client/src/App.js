import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

//const socket = io(tu adres hosta, np: 'http://localhost:8000');
const socket = io(process.NODE_ENV === 'production' ? '' : 'http://localhost:8000');

class App extends React.Component {
  
  componentDidMount() {
    socket.on('updateTask', (tasks) => this.updateTask(tasks));
    socket.on('removeTask', (id) => this.removeTask(id));
    socket.on('addTask', (task) => this.addTask(task));
  }
  
  state= {
    tasks: [],
    taskData: {
        id:'',
        name:'',
    },
  }
  
  addTask(task) {
    this.setState({
      task: this.state.tasks.push(task)
    })
  }
  
  removeTask(id, local) {
    const { tasks } = this.state;
    this.setState({ 
      tasks: tasks.filter((task) => task.id !== id)
    })
    if (local) {
      socket.emit('removeTask', id);
    }
  }
  
  updateTask(tasks) {
    this.setState({
        tasks: tasks
    })
  }
  
  submitForm(e) {
    e.preventDefault();
    
    this.addTask(this.state.taskData);
    socket.emit('addTask', this.state.taskData);
    
    this.setState({ taskData: {name: ''} });
  }
  
  render() {
    const {tasks, taskData} = this.state;
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task)=> (
            <li className="task" key={task.id}>
              {task.name}
              <div>
                <button
                  className="btn btn--red"
                  onClick={() => this.removeTask(task.id, true)}
                >
                  Remove
                </button>
              </div>
            </li>
            ))}
          </ul>
          
          <form id="add-task-form" onSubmit={(e)=>this.submitForm(e)}>
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={taskData.name}
              onChange={(e) => this.setState({taskData: {id: uuidv4(), name: e.target.value}})} 
            />
            <button className="btn" type="submit">Add</button>
          </form>
          
        </section>
      </div>
    );
  };
};

export default App;
