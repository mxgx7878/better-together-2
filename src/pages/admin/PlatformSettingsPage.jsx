import { useState } from 'react';
import { Card, PageHeader, Button, Toggle } from '../../components/ui';
import toast from 'react-hot-toast';

const PlatformSettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: 'The Better Together Group',
    supportEmail: 'support@bettertogether.com.au',
    maxTeamMembers: 4,
    allowRegistration: true,
    requireApproval: true,
    maintenanceMode: false,
    emailNotifications: true,
    autoApproveVerified: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="Platform Settings" subtitle="Configure platform behavior and preferences">
        <Button onClick={handleSave}>Save Changes</Button>
      </PageHeader>

      {/* General */}
      <Card>
        <h3 className="text-base font-semibold text-slate-800 mb-5">General Settings</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform Name</label>
            <input type="text" value={settings.siteName} onChange={e => update('siteName', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Email</label>
            <input type="email" value={settings.supportEmail} onChange={e => update('supportEmail', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Team Members per Provider</label>
            <input type="number" value={settings.maxTeamMembers} onChange={e => update('maxTeamMembers', parseInt(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400" />
          </div>
        </div>
      </Card>

      {/* Registration */}
      <Card>
        <h3 className="text-base font-semibold text-slate-800 mb-5">Registration & Approval</h3>
        <div className="space-y-4">
          <Toggle label="Allow new registrations" description="When disabled, no new users can sign up" checked={settings.allowRegistration} onChange={v => update('allowRegistration', v)} />
          <Toggle label="Require provider approval" description="New providers need admin approval before going live" checked={settings.requireApproval} onChange={v => update('requireApproval', v)} />
          <Toggle label="Auto-approve NDIS registered providers" description="Skip manual approval for verified NDIS registered providers" checked={settings.autoApproveVerified} onChange={v => update('autoApproveVerified', v)} />
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 className="text-base font-semibold text-slate-800 mb-5">Notifications</h3>
        <div className="space-y-4">
          <Toggle label="Email notifications" description="Send email notifications for platform events" checked={settings.emailNotifications} onChange={v => update('emailNotifications', v)} />
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <h3 className="text-base font-semibold text-red-700 mb-5">Danger Zone</h3>
        <Toggle label="Maintenance mode" description="Puts the platform into maintenance mode. Only admins can access." checked={settings.maintenanceMode} onChange={v => update('maintenanceMode', v)} />
      </Card>
    </div>
  );
};

export default PlatformSettingsPage;
