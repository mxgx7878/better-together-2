import { Construction } from 'lucide-react';

const AdminPlaceholder = ({ title = 'Coming Soon' }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
      <Construction className="w-8 h-8 text-slate-500" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-500 max-w-md">
      This admin feature is currently under development. Check back soon for updates.
    </p>
  </div>
);

export default AdminPlaceholder;
