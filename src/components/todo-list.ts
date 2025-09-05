import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

@customElement('todo-list')
export class TodoList extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      max-width: 500px;
      margin: 2rem auto;
      padding: 1rem;
    }

    h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .input-container {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    input[type="text"] {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    button:hover {
      background-color: #45a049;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      background-color: #f9f9f9;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    li:hover {
      background-color: #f0f0f0;
    }

    li.completed {
      opacity: 0.6;
    }

    li.completed span {
      text-decoration: line-through;
    }

    input[type="checkbox"] {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    span {
      flex: 1;
    }

    .delete-btn {
      background-color: #f44336;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }

    .delete-btn:hover {
      background-color: #da190b;
    }

    .stats {
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #e3f2fd;
      border-radius: 4px;
      text-align: center;
      color: #666;
    }
  `;

  @state()
  private todos: Todo[] = [];

  @state()
  private inputValue = '';

  render() {
    const completedCount = this.todos.filter(todo => todo.completed).length;
    const totalCount = this.todos.length;

    return html`
      <h2>Todo List</h2>
      
      <div class="input-container">
        <input 
          type="text" 
          placeholder="Enter a new todo..."
          .value=${this.inputValue}
          @input=${this._handleInput}
          @keypress=${this._handleKeyPress}
        />
        <button @click=${this._addTodo}>Add</button>
      </div>

      <ul>
        ${this.todos.map(todo => html`
          <li class=${todo.completed ? 'completed' : ''}>
            <input 
              type="checkbox" 
              .checked=${todo.completed}
              @change=${() => this._toggleTodo(todo.id)}
            />
            <span>${todo.text}</span>
            <button 
              class="delete-btn"
              @click=${() => this._deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        `)}
      </ul>

      ${totalCount > 0 ? html`
        <div class="stats">
          ${completedCount} of ${totalCount} completed
        </div>
      ` : html`
        <div class="stats">
          No todos yet. Add one above!
        </div>
      `}
    `;
  }

  private _handleInput(e: Event) {
    this.inputValue = (e.target as HTMLInputElement).value;
  }

  private _handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._addTodo();
    }
  }

  private _addTodo() {
    if (this.inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: this.inputValue.trim(),
        completed: false
      };
      this.todos = [...this.todos, newTodo];
      this.inputValue = '';
    }
  }

  private _toggleTodo(id: number) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  private _deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}