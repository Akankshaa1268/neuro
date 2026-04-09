import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

function DoctorNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-4">
        <Link to="/" className="group text-lg font-semibold tracking-wide text-white transition-colors hover:text-accent">
          NeuroLens
        </Link>

        <h1 className="text-sm font-medium text-slate-300">Doctor Dashboard</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 transition-all hover:border-accent/50">
            <User size={16} className="text-slate-400" />
            <span className="text-sm text-slate-300">Dr. Smith</span>
          </div>
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-slate-300 transition-all hover:border-accent hover:bg-accent/5 hover:text-accent"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default DoctorNavbar;
