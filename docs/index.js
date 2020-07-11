import { render, html } from 'https://unpkg.com/@fordi-org/buildless';
import App from './App.js';

render(html`<${App}/>`, document.getElementById('app'));
