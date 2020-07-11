import { html } from 'https://unpkg.com/@fordi-org/buildless';
import ToDoList from './ToDoList/index.js';
import ExtLink from './ExtLink.js';
import styles from './styles.js';

const { demo, buildless } = styles;

const BuildlessLink = () => html`<${ExtLink} className=${buildless} href="https://github.com/Fordi/buildless">Buildless<//>`;
const PreactLink = () => html`<${ExtLink} href="https://preactjs.com/">Preact<//>`;
const HtmLink = () => html`<${ExtLink} href="https://github.com/developit/htm">HTM<//>`;
const PortfolioLink = () => html`<${ExtLink} href="https://github.com/Fordi/fordi-org">portfolio site<//>`;

export default () => html`
  <div className=${demo}>
    <p>
      This is a simple demo app for <${BuildlessLink} />.
    </p>
    <p>
      Buildless is a tiny (6k) compilation of <${PreactLink} /> and <${HtmLink} /> that
      allows you to write modern web applications with little-to-no framework, and without a compilation
      step.
    </p>
    <p>
      The goal here is that you should be able to create apps whose source runs directly
      in the browser - just like the olden days - but which take can take full advantage
      of JavaScript features that modern browsers now ubiquitously support.
    </p>
    <p>
      Have a look at this page's source to understand.  Everything you see here is in human-readable source,
      served directly from an HTML page and a short stack of JS files.
    </p>
    <p>For a more complex example, you can check my <${PortfolioLink} />.</p>
    <p>
      Note: There's no need for the source to all be on this page; it's only like
      this for the benefit of devs looking to get a handle
      on Buildless at a glance.
    </p>
    <p>
      A ToDo list, since no JS tooling is complete without one.
    </p>
    <${ToDoList} />
  </div>
`;
