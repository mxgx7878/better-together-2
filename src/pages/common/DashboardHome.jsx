import useAuth from '../../hooks/useAuth';
import ProviderDashboardHome from '../provider/ProviderDashboardHome';
import ParticipantDashboardHome from '../participant/ParticipantDashboardHome';
import AdminDashboardHome from '../admin/AdminDashboardHome';

const DashboardHome = () => {
  const { isProvider, isAdmin } = useAuth();

  if (isAdmin) return <AdminDashboardHome />;
  return isProvider ? <ProviderDashboardHome /> : <ParticipantDashboardHome />;
};

export default DashboardHome;
