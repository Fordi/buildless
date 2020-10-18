const BROWSER_LANG = navigator.language.split('-')[0];

export default ({ createContext, createElement }) => {
  return ({ messageTable, keyLang = 'en' }) => {
    const Context = createContext({ language: BROWSER_LANG });
    const { Provider } = Context;
    Context.Provider = ({
      children,
      value:language = BROWSER_LANG,
    }) => createElement(
      Provider,
      {
        value: (strings, ...subs) => {
          const id = strings.raw.join('%%');
          const lookup = messageTable[id];
          if (!lookup) {
            console.warn(`No i18n entries for "${id}"`);
          } else if (!lookup[language] && language !== keyLang) {
            console.warn(`No ${language} translation for "${id}"`);
          }
          if (language === keyLang || !lookup || !lookup[language]) {
            return String.raw(strings, ...subs);
          }
          return String.raw({ raw: lookup[language].split('%%') }, ...subs);
        }
      },
      children
    );
    return Context;
  };
};
