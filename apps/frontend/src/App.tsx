import {useEffect, useState} from 'react';
import './App.css';

const API_URL = `http://127.0.0.1:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_PREFIX}`;

const launchKvmByName = async (name: string) => {
  fetch(`${API_URL}/${name}`)
};

function App() {
  const [names, setNames] = useState<null | string[]>(null);

  useEffect(() => {
    const getNames = async () => {
      const response = await fetch(`${API_URL}/`);
      const responseJson = await response.json();
      if (!responseJson) {
        return null;
      }
      const {names} = responseJson.data;
      setNames(names);
    };

    getNames();
  }, []);

  return <>{names?.map((el) => (<button key={el} onClick={() => launchKvmByName(el)}>{el}</button>))}</>;
}

export default App;
