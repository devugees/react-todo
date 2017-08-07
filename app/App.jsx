import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';


const TodoForm = ({addTodo}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = '';
      }}>
      <div className="form-group">
        <label htmlFor="todo-input"><h1>What's up?</h1></label>
        <input id="todo-input" className="form-control" htmlRequired="true" ref={node => {
          input = node;
        }} />
    </div>
  </form>
  );
};

const Title = ({todoCount}) => {
  return (
    <div>
      <div>
        <h2>{todoCount} to-do's</h2>
      </div>
    </div>
  );
}

class Todo extends React.Component{
  constructor(props){
    super(props);
    this.remove = this.props.remove.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.state = {editing: false}
  }
  handleSave(){
    this.setState({editing: false});
    console.log(this.input.value)
  }
  handleEdit(id){
    this.setState({editing: true});
  }
  render(){
  if (this.state.editing == false) {
    return (
      <li className="list-group-item">
        <a href="#"
          onClick={() => {this.handleEdit(this.props.todo.id)}}>
          {this.props.todo.text}
        </a>
        <a href="#"
          className="right"
          onClick={() => {this.props.remove(this.props.todo.id)}}>
          x
        </a>
      </li>
    );
   } else {
     return(
     <div>
      <input defaultValue={this.props.todo.text} id="todo-input" className="form-control" htmlRequired="true" ref={(input) => this.input = input} />
      <button onClick={this.handleSave}>save</button>
    </div>
     )
   }
 }
}

const TodoList = ({todos, remove}) => {
  // Map through the todos
  const todoNode = todos.map((todo) => {
    return (<Todo todo={todo} key={todo.id} remove={remove}/>)
  });
  return (<div className="list-group">{todoNode}</div>);
}

// Contaner Component
// Todo Id
window.id = 0;
class TodoApp extends React.Component{
  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: []
    }
    this.apiUrl = 'https://57b1924b46b57d1100a3c3f8.mockapi.io/api/todos'
  }
  // Lifecycle method
  componentDidMount(){
    // Make HTTP reques with Axios
    axios.get(this.apiUrl)
      .then((res) => {
        // Set state with result
        this.setState({data:res.data});
      });
  }
  // Add todo handler
  addTodo(val){
    // Assemble data
    const todo = {text: val}
    // Update data
    axios.post(this.apiUrl, todo)
       .then((res) => {
          this.state.data.push(res.data);
          this.setState({data: this.state.data});
       });
  }
  // Handle remove
  handleRemove(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo) => {
      if(todo.id !== id) return todo;
    });
    // Update state with filter
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});
      })
  }

  render(){
    // Render JSX
    return (
      <div>
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <Title todoCount={this.state.data.length}/>
        <TodoList
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}
render(<TodoApp />, document.getElementById('app'));
