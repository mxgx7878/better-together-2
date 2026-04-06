import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const suggestedPrompts = {
  provider: [
    'Help me draft a service agreement',
    'Explain the latest NDIS pricing changes',
    'What are the practice standards for SIL?',
    'Draft an email to a participant about availability',
    'Help me understand restrictive practices reporting',
    'Create a template for incident reporting',
  ],
  participant: [
    'What does my NDIS plan cover?',
    'How do I prepare for a plan review?',
    'Help me write an email to my provider',
    'What is support coordination?',
    'How do I make a complaint about a service?',
    'Explain the difference between core and capacity building',
  ],
};

const AISupportPage = () => {
  const { isProvider, user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello ${user.name.split(' ')[0]}! I'm your AI assistant for ${isProvider ? 'NDIS provider' : 'NDIS participant'} support. I can help with:\n\n${isProvider ? '• NDIS processes and compliance\n• Drafting documents, letters, and emails\n• Policy explanations\n• Pricing and quoting guidance\n• Templates and step-by-step guides' : '• Understanding your NDIS plan\n• Preparing for meetings and reviews\n• Drafting emails and letters\n• Learning about your rights\n• Finding the right support services'}\n\nHow can I help you today?` },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Thank you for your question about "${msg.slice(0, 50)}${msg.length > 50 ? '...' : ''}". This is a demo of the AI Support feature.\n\nIn the live platform, I would provide detailed, accurate guidance based on current NDIS policies, pricing arrangements, and best practices.\n\nIs there anything else I can help you with?`,
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const prompts = isProvider ? suggestedPrompts.provider : suggestedPrompts.participant;

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800">AI Support</h1>
          <p className="text-xs text-slate-500">{isProvider ? 'Provider-focused AI assistant for NDIS matters' : 'Your AI helper for NDIS questions'}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-5 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}>
              <p className="text-sm whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-3">Suggested questions:</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="text-left p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-4 border-t border-slate-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a question..."
            className="flex-1 px-5 py-3 bg-white rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-sm outline-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 text-center">AI responses are for guidance only. Always verify with official NDIS sources.</p>
      </div>
    </div>
  );
};

export default AISupportPage;