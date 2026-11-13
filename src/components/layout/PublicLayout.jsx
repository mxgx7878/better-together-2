import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { CANVAS } from '../public/ui';

const PublicLayout = () => (
  <div className="btn-site flex min-h-screen flex-col" style={{ background: CANVAS }}>
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
