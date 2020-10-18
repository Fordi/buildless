# `css`

```javascript
const I18N = createI18nContext({
  keyLang: "en",
  messageTable: {
    "In english": {
      "es": "En español",
      "jp": "日本語で"
    },
    "Downloaded %% MiB": {
      "es": "Descargado 2.5 MiB",
      "jp": "2.5MiBをダウンロード"
    }
  }
});
```

This function creates a context providing a template function that
coordinates internationalization across your app.  Simply provide it a message
table, wrap your app with the context, and use the context in your components.

Your keys are the strings you pass in your native language, with all template
substitutions swapped out for the string '%%' - so it's pretty
straightforward to migrate to internationalized text.

Also, you'll get warnings on your console for strings that aren't in the table,
and for strings you don't have a translation for - so you can pretty much migrate
your site, _then_ start writing your translations.

## Example:

```javascript
const I18N = createI18nContext({
  // English is the default.  Whatever language is here assumes that the string
  //  passed is the correct string for that language.
  keyLang: "en",
  messageTable: {
    "You have not clicked": {
      "es": "No has hecho clic",
      "jp": "クリックしていません"
    },
    "You have clicked once": {
      "es": "Has hecho clic una vez",
      "jp": "一度クリックしました"
    }
    "You have clicked %% times": {
      "es": "Ha hecho clic %% veces",
      "jp": "%%回クリックしました"
    }
  }
});

const CounterButton = () => {
  const [count, setCount] = useState(0);
  const _ = useContext(I18N);
  return html`
    <button onClick=${() => setCount(count + 1)}>
      ${count === 0 && _`You have not clicked`}
      ${count === 1 && _`You have clicked once`}
      ${count > 1 && _`You have clicked ${count} times`}
    </button>
  `;
};

export default () => {
  const [language, setLanguage] = useState('en');
  return html`
    <${I18N.Provider} value=${language}>
      <hgroup>
        <button onClick=${() => setLanguage('en')}>English</button>
        <button onClick=${() => setLanguage('es')}>Spanish</button>
        <button onClick=${() => setLanguage('jp')}>Japanese</button>
      </hgroup>
      <${CounterButton} />
    </${I18N.Provider}>
  `;
};
```
