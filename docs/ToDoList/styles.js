import { css } from 'https://unpkg.com/@fordi-org/buildless';
import theme from '../theme.js';

export default css`
  .todoList {}
  .todoList .todo:nth-of-type(2n) {
    background: ${theme.backgroundVariant};
  }
  .todo {
    display: flex;
    flex-direction: row;
  }
  .todo input[type="text"] {
    border: none;
    background: none;
    color: ${theme.primary};
    flex: 1 1 auto;
  }
  .todo input[type="text"][disabled] {
    text-decoration: line-through;
  }
  .todo input[type="checkbox"] {
    margin: 10px 3px 0;
  }
  .smallButton {
    width: 29px;
    height: 29px;
    box-sizing: border-box;
    overflow: hidden;
    color: transparent;
    background: ${theme.secondary};
    border: none;
    border-radius: 15px;
    margin: 3px;
    position: relative;
  }
  .smallButton:before {
    color: white;
    left: 0;
    top: 0;
    line-height: 30px;
    font-weight: bold;
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .smallButton.removeTodo {
    background: ${theme.danger};
  }
  .removeTodo:before {
    content: '+';
    font-size: 1.6em;
    transform: rotate(45deg);
  }
  .addTodo:before {
    content: '+';
    font-size: 1.6em;
  }
`;
