import { useState } from 'react';
import DoctorNavbar from '../components/DoctorNavbar';
import UploadPanel from '../components/UploadPanel';
import ViewerPanel from '../components/ViewerPanel';
import SummaryPanel from '../components/SummaryPanel';
import ChatPanel from '../components/ChatPanel';

function Doctor() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [highlightTumor, setHighlightTumor] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisState, setAnalysisState] = useState('idle'); // 'idle' | 'analyzing' | 'completed'

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setAnalysisData(null);
    setAnalysisState('idle');
    setHighlightTumor(true); // Auto-enable highlight for new upload
  };

  const handleReset = () => {
    setUploadedFile(null);
    setAnalysisData(null);
    setAnalysisState('idle');
    setHighlightTumor(false);
  };

  const generateAnalysis = (file) => {
    // Use file properties to generate pseudo-random but consistent results
    const nameHash = file.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const sizeHash = file.size;
    
    // Determine tumor location based on filename
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
    
    // Determine tumor size based on file size
    const sizeIndex = Math.floor((sizeHash / 100000) % 3);
    const sizes = [
      { label: 'Small', diameter: '1.8 cm', scale: 0.2, risk: 'Low' },
      { label: 'Medium', diameter: '2.3 cm', scale: 0.25, risk: 'Moderate' },
      { label: 'Large', diameter: '3.1 cm', scale: 0.32, risk: 'High' }
    ];
    
    const location = locations[locationIndex];
    const size = sizes[sizeIndex];
    
    // Generate risk color
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
      
      // Simulate processing time (2-3 seconds)
      const processingTime = 2000 + Math.random() * 1000;
      
      setTimeout(() => {
        const analysis = generateAnalysis(uploadedFile);
        setAnalysisData(analysis);
        setAnalysisState('completed');
      }, processingTime);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-white">
      <DoctorNavbar />

      <main className="mx-auto max-w-[1800px] p-6">
        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT SIDEBAR - Upload + Controls */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <UploadPanel
                fileName={uploadedFile?.name}
                onFileUpload={handleFileUpload}
                highlightTumor={highlightTumor}
                setHighlightTumor={setHighlightTumor}
                showWireframe={showWireframe}
                setShowWireframe={setShowWireframe}
                onAnalyze={handleAnalyze}
                onReset={handleReset}
                analysisState={analysisState}
              />
            </div>
          </div>

          {/* CENTER PANEL - 3D Viewer */}
          <div className="lg:col-span-5">
            <div className="h-[600px] lg:h-[calc(100vh-120px)]">
              <ViewerPanel 
                showWireframe={showWireframe} 
                analysisData={analysisData}
                highlightTumor={highlightTumor}
                analysisState={analysisState}
              />
            </div>
          </div>

          {/* RIGHT PANEL - Summary + Chat */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <SummaryPanel analysisData={analysisData} analysisState={analysisState} />
              <ChatPanel analysisData={analysisData} analysisState={analysisState} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Doctor;
