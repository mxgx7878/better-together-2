import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Mock user profiles for demo
const mockUsers = {
  providerFree: {
    id: 'prov-001',
    name: 'Sarah Mitchell',
    email: 'sarah@communitycare.com.au',
    role: 'provider',
    tier: 'free',
    organisation: 'Community Care Solutions',
    avatar: null,
    location: 'Melbourne, VIC',
    joinedDate: '2024-11-15',
    profileComplete: 65,
  },
  providerPaid: {
    id: 'prov-002',
    name: 'Sarah Mitchell',
    email: 'sarah@communitycare.com.au',
    role: 'provider',
    tier: 'paid',
    subscriptionPlan: 'Growth & Referral',
    organisation: 'Community Care Solutions',
    avatar: null,
    location: 'Melbourne, VIC',
    joinedDate: '2024-11-15',
    profileComplete: 92,
    analytics: {
      profileViews: 148,
      referralsThisMonth: 12,
      eventEngagement: 8,
      responseRate: '94%',
    },
  },
  participantFree: {
    id: 'part-001',
    name: 'James Chen',
    email: 'james.chen@email.com',
    role: 'participant',
    tier: 'free',
    avatar: null,
    location: 'Sydney, NSW',
    joinedDate: '2025-01-10',
    profileComplete: 70,
  },
  participantPaid: {
    id: 'part-002',
    name: 'James Chen',
    email: 'james.chen@email.com',
    role: 'participant',
    tier: 'paid',
    subscriptionPlan: 'Personal Support Plus',
    avatar: null,
    location: 'Sydney, NSW',
    joinedDate: '2025-01-10',
    profileComplete: 88,
    planBuddy: {
      name: 'Karen Burgess',
      nextCheckIn: '2026-02-28',
    },
  },
};

export const AuthProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState('providerFree');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const user = mockUsers[currentProfile];

  const switchProfile = (profileKey) => {
    if (mockUsers[profileKey]) {
      setCurrentProfile(profileKey);
    }
  };

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const isProvider = user.role === 'provider';
  const isParticipant = user.role === 'participant';
  const isFree = user.tier === 'free';
  const isPaid = user.tier === 'paid';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        currentProfile,
        switchProfile,
        login,
        logout,
        isProvider,
        isParticipant,
        isFree,
        isPaid,
        availableProfiles: Object.keys(mockUsers),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;