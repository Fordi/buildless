import { html } from 'https://unpkg.com/@fordi-org/buildless';
import ToDo from './ToDo.js';
import useToDoList from './useToDoList.js';
import todoStyles from './styles.js';
import mainStyles from '../styles.js';

const { todoList, smallButton, addTodo, clearComplete } = todoStyles;
const { button } = mainStyles;

export default () => {
  const { data, update, add, scrub, remove } = useToDoList('todo-list', [
    { done: true, content: 'Write a ToDo list' },
    { done: false, content: 'Do something cool' },
  ]);
  const clearDisabled = !data.find(item => item.done);
  return html`
    <div className=${todoList}>
      ${data.map(item => html`<${ToDo} item=${item} update=${update} remove=${remove} />`)}
      <button className=${smallButton.and(addTodo)} onClick=${add}>Add</button>
      <button className=${button.and(clearComplete)} onClick=${scrub} disabled=${clearDisabled}>Clear complete</button>
    </div>
  `;
};
