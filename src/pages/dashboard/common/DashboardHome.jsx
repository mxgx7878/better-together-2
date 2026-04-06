import { useAuth } from '../../../context/AuthContext';
import ProviderDashboardHome from '../provider/ProviderDashboardHome';
import ParticipantDashboardHome from '../participant/ParticipantDashboardHome';

const DashboardHome = () => {
  const { isProvider } = useAuth();

  return isProvider ? <ProviderDashboardHome /> : <ParticipantDashboardHome />;
};

export default DashboardHome;