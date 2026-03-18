import { useAuth } from '../../context/AuthContext';
import ProviderDashboardHome from './ProviderDashboardHome';
import ParticipantDashboardHome from './ParticipantDashboardHome';

const DashboardHome = () => {
  const { isProvider } = useAuth();

  return isProvider ? <ProviderDashboardHome /> : <ParticipantDashboardHome />;
};

export default DashboardHome;