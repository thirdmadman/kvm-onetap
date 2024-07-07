import {useEffect, useState} from 'react';
import './App.css';

const launchKvmByName = async (name: string) => {
  fetch(`http://127.0.0.1:5000/api/${name}`)
};

function App() {
  const [names, setNames] = useState<null | string[]>(null);

  useEffect(() => {
    const getNames = async () => {
      const response = await fetch('http://127.0.0.1:5000/api/');
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
