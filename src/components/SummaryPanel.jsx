import { FileText } from 'lucide-react';

function SummaryPanel({ analysisData, analysisState }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-6">
      <div className="mb-4 flex items-center gap-2">
        <FileText size={18} className="text-slate-400" />
        <h2 className="text-lg font-semibold text-white">Surgical Summary</h2>
      </div>

      {analysisState === 'idle' ? (
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-slate-400">
            No analysis yet. Upload and analyze a scan.
          </p>
        </div>
      ) : analysisState === 'analyzing' ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-700" />
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-2 h-3 w-1/3 animate-pulse rounded bg-slate-700" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-700" />
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-2 h-3 w-1/3 animate-pulse rounded bg-slate-700" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-700" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-sm leading-relaxed text-slate-300">
              Tumor detected in the <span className="font-medium text-white">{analysisData.location.description}</span>.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Estimated Size
              </p>
              <p className="mt-1 text-sm text-white">{analysisData.size.diameter}</p>
            </div>
            
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Proximity
              </p>
              <p className="mt-1 text-sm text-white">Near critical {analysisData.location.criticalArea}</p>
            </div>
            
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Risk Level
              </p>
              <p className={`mt-1 text-sm font-medium ${analysisData.riskColor}`}>{analysisData.size.risk}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryPanel;
