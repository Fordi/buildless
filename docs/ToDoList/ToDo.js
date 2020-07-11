import { html } from 'https://unpkg.com/@fordi-org/buildless';
import todoStyles from './styles.js';
const { todo, smallButton, removeTodo } = todoStyles;

export default ({ item, update, remove }) => {
  const updateDone = ({ target }) => update(item, { done: target.checked });
  const updateContent = ({ target }) => update(item, { content: target.value });
  const removeSelf = () => remove(item);
  return html`
    <div className=${todo}>
      <input type="checkbox" checked=${item.done} onChange=${updateDone} />
      <input type="text" value=${item.content} disabled=${item.done} onChange=${updateContent} />
      <button className=${smallButton.and(removeTodo)} onClick=${removeSelf}>Remove</button>
    </div>
  `;
};
