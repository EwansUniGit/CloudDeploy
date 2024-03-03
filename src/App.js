import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/tasks')
        .then(response => setTasks(response.data))
        .catch(error => console.error('Error fetching tasks: ', error))
  });


  const addTask = () => {
    axios.post('http://localhost:3001/tasks', {description: newTask})
        .then(response => setTasks([...tasks, response.data]))
        .catch(error => console.error('Error adding task: ', error))
  };

  const toggleTask = (taskId, completed) => {
    axios.put(`http://localhost:3001/tasks/${taskId}`, { completed: !completed })
        .then(response => {
          const updatedTasks = tasks.map(task => (task.task_id === (taskId -1) ? response.data : task));
          setTasks(updatedTasks);
        })
        .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = taskId => {
    // Delete a to-do item from the server
    axios.delete(`http://localhost:3001/tasks/${taskId}`)
        .then(() => {
          const updatedTasks = tasks.filter(task => task.task_id !== taskId);
          setTasks(updatedTasks);
        })
        .catch(error => console.error('Error deleting todo:', error));
  };
  return (
      <Container>
        <Row><h1>To-Do App</h1></Row>
          <Row><input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} /></Row>
        <Button variant={"primary"} onClick={addTask}>Add task</Button>
        <ul>
          {tasks.map(task => (
              <Row>
              <li key={task.task_id}>
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.task_description}</span>
                <Button variant={"success"} onClick={() => toggleTask(task.task_id, task.completed)}>Toggle</Button>
                <Button variant={"secondary"} onClick={() => deleteTask(task.task_id)}>Delete</Button>
              </li>
              </Row>
          ))}
        </ul>
      </Container>
  );
};

export default App;
