import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import Navbar from '../components/Navbar';

const features = [
  {
    title: '3D Visualization',
    description: 'View brain scans in an interactive 3D environment',
  },
  {
    title: 'Structured Insights',
    description: 'Get clear, readable summaries from complex imaging data',
  },
  {
    title: 'Explainable AI',
    description: 'Understand how the system derives its conclusions',
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />

      <main>
        <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-24 text-center sm:px-8 sm:pt-32">
          <span className="animate-fade-in rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Medical Imaging Clarity
          </span>

          <h1 className="mt-8 max-w-3xl animate-fade-in-up text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl" style={{ animationDelay: '0.1s' }}>
            From MRI Scans to Surgical Understanding
          </h1>

          <p className="mt-6 max-w-2xl animate-fade-in-up text-base leading-8 text-slate-300 sm:text-lg" style={{ animationDelay: '0.2s' }}>
            NeuroLens transforms complex brain scans into clear, explainable insights
            for better medical decisions.
          </p>

          <div className="mt-10 flex flex-col gap-4 animate-fade-in-up sm:flex-row" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/doctor"
              className="group relative overflow-hidden rounded-xl bg-accent px-8 py-4 text-sm font-medium text-slate-950 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:scale-105"
            >
              <span className="relative z-10">Doctor View</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentDark opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              to="/patient"
              className="group rounded-xl border-2 border-accent px-8 py-4 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent/10 hover:scale-105"
            >
              Patient View
            </Link>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-6 pb-8 sm:px-8">
          <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 text-left shadow-soft transition-all duration-300 hover:border-white/20 hover:shadow-xl">
            <p className="text-sm uppercase tracking-[0.18em] text-accent">About</p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              NeuroLens is designed to present complex neuroimaging data in a format
              that supports clinicians, informs patients, and keeps decision-making
              grounded in transparency.
            </p>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-accent">Features</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Built to make scan interpretation clearer
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, idx) => (
              <div key={feature.title} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-white/10 px-6 py-8 text-center sm:px-8">
        <p className="text-sm text-slate-400">
          © 2026 NeuroLens. Built for better clinical decisions.
        </p>
      </footer>
    </div>
  );
}

export default Landing;
