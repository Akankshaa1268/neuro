function FeatureCard({ title, description }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-soft transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-accent">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300 transition-colors group-hover:text-slate-200">{description}</p>
      </div>
    </article>
  );
}

export default FeatureCard;
