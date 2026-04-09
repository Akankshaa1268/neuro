import { MessageSquare, Send } from 'lucide-react';

function ChatPanel({ analysisData, analysisState }) {
  const generateMessages = () => {
    if (!analysisData) return [];
    
    const { location, size } = analysisData;
    
    return [
      {
        role: 'ai',
        content: `Tumor detected in the ${location.description}.`,
      },
      {
        role: 'user',
        content: 'Is it close to critical areas?',
      },
      {
        role: 'ai',
        content: `Yes, it is near regions associated with ${location.criticalArea}.`,
      },
      {
        role: 'ai',
        content: size.risk === 'High' 
          ? 'Given the size and location, immediate surgical intervention is recommended with careful planning.'
          : size.risk === 'Low'
          ? 'The tumor is relatively small. Monitoring or minimally invasive approaches may be considered.'
          : 'Surgical planning should consider minimal disruption to surrounding tissue.',
      },
    ];
  };

  const messages = generateMessages();

  return (
    <div className="flex flex-col rounded-xl border border-border bg-panel p-6">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare size={18} className="text-slate-400" />
        <h2 className="text-lg font-semibold text-white">AI Explanation</h2>
      </div>

      {/* Chat Messages */}
      <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-lg border border-border bg-surface p-4">
        {analysisState === 'idle' ? (
          <p className="text-sm text-slate-400">
            Chat will appear here after analysis.
          </p>
        ) : analysisState === 'analyzing' ? (
          <div className="space-y-3">
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg border border-border bg-panel px-4 py-2">
                <div className="mb-1 h-3 w-12 animate-pulse rounded bg-slate-700" />
                <div className="h-4 w-48 animate-pulse rounded bg-slate-700" />
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg border border-border bg-panel px-4 py-2">
                <div className="mb-1 h-3 w-12 animate-pulse rounded bg-slate-700" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-700" />
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-accent text-slate-950'
                    : 'border border-border bg-panel text-slate-200'
                }`}
              >
                <p className="text-xs font-medium uppercase tracking-wider opacity-70">
                  {msg.role === 'user' ? 'You' : 'AI'}
                </p>
                <p className="mt-1 text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask about the analysis..."
          disabled={analysisState !== 'completed'}
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          disabled={analysisState !== 'completed'}
          className="rounded-lg bg-accent p-2 text-slate-950 transition-colors hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
