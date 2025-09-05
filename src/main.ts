import './style.css';
import './components/my-element';
import './components/todo-list';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <my-element name="TypeScript + Vite + Lit"></my-element>
    <todo-list></todo-list>
  </div>
`;