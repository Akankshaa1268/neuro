import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

function PatientNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-wide text-white">
          NeuroLens
        </Link>

        <h1 className="text-sm font-medium text-slate-300">Patient View</h1>

        <Link
          to="/doctor"
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-slate-300 transition-colors hover:border-accent hover:text-accent"
        >
          <Stethoscope size={16} />
          <span>Doctor View</span>
        </Link>
      </div>
    </header>
  );
}

export default PatientNavbar;
