import {ReactNode} from 'react';
import {Header} from './Header';

interface ILayoutProps {
  children: ReactNode;
}

export function Layout({children}: ILayoutProps) {
  return (
    <div className='min-w-full min-h-full'>
      <Header />
      {children}
    </div>
  );
}
