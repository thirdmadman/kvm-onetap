import {useEffect, useState} from 'react';
import {Layout} from './Layout';

interface IKvmGroup {
  id: number;
  name: string;
}

interface IKvmName {
  name: string;
  groupId: number;
}

const API_URL = `http://127.0.0.1:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_PREFIX}`;

const launchKvmByName = async (name: string) => {
  fetch(`${API_URL}/${name}`);
};

const generateLinksFromNames = (array: string[]) =>
  array.map((el) => (
    <a
      className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
      key={el}
      download
      target='_blank'
      href={`${API_URL}/${el}?download=true`}
    >
      {el}
    </a>
  ));

const generateLinks = (groups: Array<IKvmGroup> | null, names: Array<IKvmName>) => {
  if (!groups || groups.length <= 0) {
    return generateLinksFromNames(names.map((el) => el.name));
  }

  return groups.map((group) => {
    const filteredNames = names.filter((name) => name.groupId === group.id).map((el) => el.name);

    return (
      <div className='p-4 px-6 rounded-xl border w-full'>
        <h2 className='pb-8 text-4xl font-bold dark:text-white'>{group.name}</h2>
        <div className='flex gap-3 flex-wrap'>{generateLinksFromNames(filteredNames)}</div>
      </div>
    );
  });
};

const generateButtonsFromNames = (array: string[]) =>
  array.map((el) => (
    <button
      className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
      key={el}
      onClick={() => launchKvmByName(el)}
    >
      {el}
    </button>
  ));

const generateButtons = (groups: Array<IKvmGroup> | null, names: Array<IKvmName>) => {
  if (!groups || groups.length <= 0) {
    return generateButtonsFromNames(names.map((el) => el.name));
  }

  return groups.map((group) => {
    const filteredNames = names.filter((name) => name.groupId === group.id).map((el) => el.name);

    return (
      <div className='p-4 px-6 rounded-xl border w-full'>
        <h2 className='pb-8 text-4xl font-bold dark:text-white'>{group.name}</h2>
        <div className='flex gap-3 flex-wrap'>{generateButtonsFromNames(filteredNames)}</div>
      </div>
    );
  });
};

function App() {
  const [names, setNames] = useState<null | Array<IKvmName>>(null);
  const [groups, setGroups] = useState<null | Array<IKvmGroup>>(null);

  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const getNames = async () => {
      const response = await fetch(`${API_URL}/`);
      const responseJson = await response.json();
      if (!responseJson) {
        return null;
      }
      const {names, groups} = responseJson.data;
      setNames(names);
      setGroups(groups);
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
          <h1 className='pb-8 text-5xl font-extrabold dark:text-white'>Choose kvm to launch</h1>
          <div className='flex gap-3 flex-wrap'>{generateButtons(groups, names)}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='container max-w-screen-xl mx-auto py-24 px-6 sm:px-8 md:px-12 lg:px-24 xl:px-32 xl:py-32'>
        <h1 className='pb-8 text-5xl font-extrabold dark:text-white'>Choose kvm to download .jnlp</h1>
        <div className='flex flex-col gap-8'>{generateLinks(groups, names)}</div>
      </div>
    </Layout>
  );
}

export default App;
