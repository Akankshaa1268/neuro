import { Heart, Info } from 'lucide-react';

function PatientExplanation({ analysisData, analysisState }) {
  const generateExplanation = () => {
    if (!analysisData) return null;

    const { location, size } = analysisData;
    
    // Simplify location names
    const simpleLocation = location.name.includes('temporal') 
      ? 'an area that helps with speech and communication'
      : location.name.includes('frontal')
      ? 'an area that helps with movement and thinking'
      : 'an area that helps with sensing and understanding space';

    // Simplify size description
    const sizeDescription = size.risk === 'High'
      ? 'an area'
      : size.risk === 'Low'
      ? 'a small area'
      : 'an area';

    return {
      main: `We detected ${sizeDescription} in the brain that may need attention.`,
      location: `It is located near ${simpleLocation}.`,
      next: 'Your doctors will review this in detail and decide the safest next steps.',
    };
  };

  const explanation = generateExplanation();

  return (
    <div className="rounded-xl border border-border bg-panel p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-accent/10 p-2">
          <Heart size={20} className="text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-white">Your Results</h2>
      </div>

      {analysisState === 'idle' ? (
        <div className="rounded-lg border border-border bg-surface p-6 text-center">
          <p className="text-slate-400">
            No analysis yet. Upload a scan to begin.
          </p>
        </div>
      ) : analysisState === 'analyzing' ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-slate-700" />
            <div className="mb-3 h-4 w-full animate-pulse rounded bg-slate-700" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-700" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4 rounded-lg border border-green-500/20 bg-green-500/5 p-6">
            <p className="text-lg leading-relaxed text-slate-200">
              {explanation.main}
            </p>
            <p className="text-lg leading-relaxed text-slate-200">
              {explanation.location}
            </p>
            <p className="text-lg leading-relaxed text-slate-200">
              {explanation.next}
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <Info size={18} className="mt-0.5 flex-shrink-0 text-blue-400" />
            <p className="text-sm leading-relaxed text-slate-300">
              This is an AI-assisted explanation to help you understand. Please consult your doctor for medical advice and treatment decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientExplanation;
