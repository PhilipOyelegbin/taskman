import { Suspense, lazy, useReducer, useState } from 'react';
import { initialState, taskReducer } from "../reducers/taskReducer";
import axios from 'axios';
import sun from '../assets/icon-sun.svg'
import moon from '../assets/icon-moon.svg'

const TaskList = lazy(() => import('./TaskList'));

const TaskPage = ({handleThemeToggle, theme}) => {
  const [, dispatch] = useReducer(taskReducer, initialState);

  const [newCardForm, setNewCardForm] = useState(
    {title: '', description: '', status: "Pending"}
  );

  function onInputChange(e) {
    setNewCardForm({...newCardForm, [e.target.name]: e.target.value})
  };

  const handlePostTask = async (e) => {
    e.preventDefault()
    try {
      let resp = await axios.post(process.env.REACT_APP_API_URL, newCardForm)
      dispatch({type: "POST_TASK", payload: resp.data})
      setNewCardForm({title: '', description: ''})
      resp = await axios.get(process.env.REACT_APP_API_URL)
      dispatch({type: "GET_TASK", payload: resp.data})
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <section className="task-list">
      <div className='page-header'>
        <h1>Taskgenics</h1>
        <img src={!theme ? sun : moon} className="toggle-btn toggle-btn-default" onClick={() => handleThemeToggle()} alt="theme icon" />
      </div>

      <form className="task-list-form" onSubmit={handlePostTask}>
        <input type="text" name='title' value={newCardForm.title} onChange={onInputChange} minLength="5" maxLength="50"placeholder="title" required/>
        <input type="text" name='description' value={newCardForm.description} onChange={onInputChange} placeholder="description" required/>
        <select name="status" id="status" onChange={onInputChange}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit" disabled={newCardForm.title === "" || newCardForm.description === ""}>Save</button>
      </form>

      <Suspense fallback={<h3 className='loading'>Loading task...</h3>}>
        <TaskList/>
      </Suspense>
    </section>
  )
}

export default TaskPage