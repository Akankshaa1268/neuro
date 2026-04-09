import { useState } from 'react';
import PatientNavbar from '../components/PatientNavbar';
import ViewerPanel from '../components/ViewerPanel';
import PatientExplanation from '../components/PatientExplanation';
import { Upload, Sparkles } from 'lucide-react';

function Patient() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisState, setAnalysisState] = useState('idle');

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setAnalysisData(null);
    setAnalysisState('idle');
  };

  const generateAnalysis = (file) => {
    const nameHash = file.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const sizeHash = file.size;
    
    const locationIndex = nameHash % 3;
    const locations = [
      { 
        name: 'left temporal',
        position: { x: -0.6, y: 0.3, z: 0.5 },
        description: 'left temporal region',
        criticalArea: 'speech and language processing'
      },
      { 
        name: 'right frontal',
        position: { x: 0.5, y: 0.4, z: 0.6 },
        description: 'right frontal lobe',
        criticalArea: 'motor control and decision-making'
      },
      { 
        name: 'parietal',
        position: { x: 0.2, y: 0.7, z: -0.3 },
        description: 'parietal region',
        criticalArea: 'sensory processing and spatial awareness'
      }
    ];
    
    const sizeIndex = Math.floor((sizeHash / 100000) % 3);
    const sizes = [
      { label: 'Small', diameter: '1.8 cm', scale: 0.2, risk: 'Low' },
      { label: 'Medium', diameter: '2.3 cm', scale: 0.25, risk: 'Moderate' },
      { label: 'Large', diameter: '3.1 cm', scale: 0.32, risk: 'High' }
    ];
    
    const location = locations[locationIndex];
    const size = sizes[sizeIndex];
    
    const riskColors = {
      'Low': 'text-green-400',
      'Moderate': 'text-amber-400',
      'High': 'text-red-400'
    };
    
    return {
      location,
      size,
      riskColor: riskColors[size.risk],
      timestamp: Date.now()
    };
  };

  const handleAnalyze = () => {
    if (uploadedFile && analysisState === 'idle') {
      setAnalysisState('analyzing');
      
      const processingTime = 2000 + Math.random() * 1000;
      
      setTimeout(() => {
        const analysis = generateAnalysis(uploadedFile);
        setAnalysisData(analysis);
        setAnalysisState('completed');
      }, processingTime);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-white">
      <PatientNavbar />

      <main className="mx-auto max-w-[1400px] px-6 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
            <Sparkles size={16} className="text-accent" />
            <span className="text-xs font-medium uppercase tracking-wider text-accent">
              AI-Powered Analysis
            </span>
          </div>
          <h1 className="mb-4 text-5xl font-bold text-white">
            Understand Your Scan
          </h1>
          <p className="text-xl text-slate-400">
            Upload your scan to get a simple explanation of what it means.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="mx-auto max-w-2xl">
            <label
              htmlFor="patient-file-upload"
              className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-gradient-to-br from-panel to-panel/50 p-12 transition-all hover:border-accent/50 hover:bg-panel/50 hover:scale-[1.02] shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative rounded-full bg-accent/10 p-4 transition-all group-hover:bg-accent/20 group-hover:scale-110">
                <Upload size={40} className="text-accent" />
              </div>
              <p className="relative mb-2 mt-6 text-lg font-medium text-slate-200 transition-colors group-hover:text-white">
                {uploadedFile?.name || 'Click to upload or drag and drop'}
              </p>
              <p className="relative text-sm text-slate-400">
                You can upload MRI images (JPG, PNG, DICOM)
              </p>
              <input
                id="patient-file-upload"
                type="file"
                className="hidden"
                accept=".dcm,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </label>

            {uploadedFile && (
              <div className="mt-6 text-center animate-fade-in">
                <button
                  onClick={handleAnalyze}
                  disabled={analysisState !== 'idle'}
                  className={`group relative overflow-hidden rounded-xl px-10 py-4 text-base font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    analysisState === 'completed'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                      : 'bg-accent text-slate-950 shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-105'
                  }`}
                >
                  {analysisState === 'analyzing' && (
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  )}
                  {analysisState === 'idle' && 'Analyze Scan'}
                  {analysisState === 'analyzing' && 'Analyzing...'}
                  {analysisState === 'completed' && 'Analysis Complete'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {uploadedFile && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* 3D Viewer */}
            <div className="h-[500px]">
              <ViewerPanel
                showWireframe={false}
                analysisData={analysisData}
                highlightTumor={true}
                analysisState={analysisState}
              />
            </div>

            {/* Explanation */}
            <div>
              <PatientExplanation
                analysisData={analysisData}
                analysisState={analysisState}
              />
            </div>
          </div>
        )}

        {/* Bottom Note */}
        {!uploadedFile && (
          <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-border bg-gradient-to-br from-panel to-panel/50 p-8 text-center shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-slate-400 leading-relaxed">
              This tool helps you understand your brain scan results in simple terms. 
              Always discuss results with your healthcare provider.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Patient;
