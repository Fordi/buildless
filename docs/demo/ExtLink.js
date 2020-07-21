import { html } from 'https://unpkg.com/@fordi-org/buildless';

export default ({ children, ...props }) => html`
  <a
    target="_blank"
    rel="noopener noreferrer"
    ...${props}
  >
    ${children}
  </a>
`;
