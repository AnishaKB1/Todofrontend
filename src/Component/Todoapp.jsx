import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Todoapp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [newTodoStatus, setNewTodoStatus] = useState('ongoing');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/Todo/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addTodo = async () => {
        try {
            await axios.post('http://localhost:3000/Todo/todos', {
                description: newTodoDescription,
                status: newTodoStatus,
            });
            setNewTodoDescription('');
            setNewTodoStatus('ongoing');
            fetchData();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/Todo/todos/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ongoing' ? 'completed' : 'ongoing';
            await axios.put(`http://localhost:3000/Todo/todos/${id}`, { status: newStatus });
            fetchData();
        } catch (error) {
            console.error('Error updating todo status:', error);
        }
    };

    const filteredTodos = todos.filter((todo) => {
        if (filter === 'completed') {
            return todo.status === 'completed';
        } else if (filter === 'incomplete') {
            return todo.status === 'ongoing';
        } else {
            return true;
        }
    });

    return (
        <div className="Todo">
           
      <div>
      <h2 id='head'> ToDo App </h2>
        <label>Description:</label>
        <input
          type="text"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Status:</label>
        <select
          value={newTodoStatus}
          onChange={(e) => setNewTodoStatus(e.target.value)}
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button id="add" onClick={addTodo}>
        Add
      </button>

      <div>
        <label>Show:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo._id} className={todo.status === 'completed' ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.status === 'completed'}
              onChange={() => toggleStatus(todo._id, todo.status)}
            />
            <span>{todo.description}</span>
            <button id="delete" onClick={() => deleteTodo(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
    );
};

export default Todoapp;
