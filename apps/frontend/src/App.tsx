import {useEffect, useState} from 'react';
import {Layout} from './Layout';

const API_URL = `http://127.0.0.1:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_PREFIX}`;

const launchKvmByName = async (name: string) => {
  fetch(`${API_URL}/${name}`);
};

const generateLinks = (array: string[]) =>
  array.map((el) => (
    <a
      className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
      key={el}
      download
      href={`${API_URL}/${el}?download=true`}
    >
      {el}
    </a>
  ));

const generateButtons = (array: string[]) =>
  array.map((el) => (
    <button
      className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
      key={el}
      onClick={() => launchKvmByName(el)}
    >
      {el}
    </button>
  ));

function App() {
  const [names, setNames] = useState<null | string[]>(null);
  const searchParams = new URLSearchParams(window.location.search);

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

  const isPrivate = searchParams.get('private');

  if (!names || names.length <= 0) {
    return <Layout>We are sorry, but there are no KVM in config.json</Layout>;
  }

  if (isPrivate && isPrivate === 'true') {
    return (
      <Layout>
        <div className='container max-w-screen-xl mx-auto py-24 px-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 xl:py-32'>
          <h1 className='text-2xl mb-8 font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>Choose kvm to launch</h1>
          <div className='flex gap-3 flex-wrap'>{generateButtons(names)}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='container max-w-screen-xl mx-auto py-24 px-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 xl:py-32'>
        <h1 className='text-2xl mb-8 font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>Choose kvm to download .jnlp</h1>
        <div className='flex gap-3 flex-wrap'>{generateLinks(names)}</div>
      </div>
    </Layout>
  );
}

export default App;
