import { useState, useEffect } from 'https://unpkg.com/@fordi-org/buildless';

const { parse, stringify } = JSON;
export default (storageName, initialList) => {
  const [data, setData] = useState(parse(localStorage.getItem(storageName) || stringify(initialList)));
  useEffect(() => {
    localStorage.setItem(storageName, stringify(data));
  }, [data]);
  return {
    data,
    update(item, updates) {
      const tmp = data.slice();
      tmp.splice(data.indexOf(item), 1, { ...item, ...updates });
      setData(tmp);
    },
    add() {
      setData(data.concat([{ content: '', done: false }]));
    },
    scrub() {
      setData(data.filter(item => !item.done));
    },
    remove(item) {
      const tmp = data.slice();
      tmp.splice(data.indexOf(item), 1);
      setData(tmp);
    }
  };
}
