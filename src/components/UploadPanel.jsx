import { Upload, RotateCcw } from 'lucide-react';

function UploadPanel({ fileName, onFileUpload, highlightTumor, setHighlightTumor, showWireframe, setShowWireframe, onAnalyze, onReset, analysisState }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const getButtonText = () => {
    if (!fileName) return 'Upload File First';
    if (analysisState === 'analyzing') return 'Analyzing...';
    if (analysisState === 'completed') return 'Analysis Complete';
    return 'Analyze Scan';
  };

  const isAnalyzeDisabled = !fileName || analysisState === 'analyzing' || analysisState === 'completed';

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-gradient-to-br from-panel to-panel/50 p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">MRI Input</h2>
        {analysisState === 'completed' && (
          <button
            onClick={onReset}
            className="group flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-accent hover:bg-accent/5 hover:text-accent hover:scale-105"
            title="Reset and analyze new scan"
          >
            <RotateCcw size={14} className="transition-transform group-hover:rotate-180 duration-500" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Upload Box */}
      <div className="mb-6">
        <label
          htmlFor="file-upload"
          className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface p-8 transition-all hover:border-accent/50 hover:bg-surface/50 hover:scale-[1.02]"
        >
          <Upload size={32} className="mb-3 text-slate-400 transition-colors group-hover:text-accent" />
          <p className="mb-2 text-sm font-medium text-slate-300 transition-colors group-hover:text-white">
            {fileName || 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-slate-500">Supports DICOM, PNG, JPG</p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".dcm,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
        </label>
        {fileName && (
          <div className="mt-3 animate-fade-in rounded-lg border border-accent/30 bg-accent/5 px-3 py-2">
            <p className="text-xs text-accent">Selected file:</p>
            <p className="text-sm text-white">{fileName}</p>
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="flex-1 space-y-4">
        <h3 className="text-sm font-medium text-slate-400">Controls</h3>

        {/* Toggle: Highlight Tumor */}
        <div className="group flex items-center justify-between rounded-lg border border-border bg-surface p-3 transition-all hover:border-accent/30">
          <span className="text-sm text-slate-300 transition-colors group-hover:text-white">Highlight Tumor</span>
          <button
            onClick={() => setHighlightTumor(!highlightTumor)}
            disabled={analysisState !== 'completed'}
            className={`relative h-6 w-11 rounded-full transition-all ${
              highlightTumor ? 'bg-accent shadow-lg shadow-accent/30' : 'bg-slate-600'
            } disabled:opacity-50`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                highlightTumor ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle: Show Wireframe */}
        <div className="group flex items-center justify-between rounded-lg border border-border bg-surface p-3 transition-all hover:border-accent/30">
          <span className="text-sm text-slate-300 transition-colors group-hover:text-white">Show Wireframe</span>
          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className={`relative h-6 w-11 rounded-full transition-all ${
              showWireframe ? 'bg-accent shadow-lg shadow-accent/30' : 'bg-slate-600'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                showWireframe ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Analyze Button */}
        <button
          onClick={onAnalyze}
          disabled={isAnalyzeDisabled}
          className={`group relative w-full overflow-hidden rounded-lg px-4 py-3 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
            analysisState === 'completed'
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
              : 'bg-accent text-slate-950 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:scale-105'
          }`}
        >
          {analysisState === 'analyzing' && (
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
          )}
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}

export default UploadPanel;
