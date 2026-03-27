import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Send, MessageCircle, Clock, ChevronLeft } from '../../components/Icons';

const mockConversations = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    initials: 'SM',
    role: 'Support Coordinator',
    lastMessage: 'I have updated your service agreement with the new goals we discussed.',
    time: '10:32 AM',
    unread: 2,
    color: 'bg-purple-500',
  },
  {
    id: 2,
    name: 'Therapy Plus Co.',
    initials: 'TP',
    role: 'Allied Health Provider',
    lastMessage: 'Your next OT session is confirmed for Thursday at 2pm.',
    time: '9:15 AM',
    unread: 0,
    color: 'bg-pink-500',
  },
  {
    id: 3,
    name: 'James Nguyen',
    initials: 'JN',
    role: 'Plan Manager',
    lastMessage: 'The invoice from last month has been processed and paid.',
    time: 'Yesterday',
    unread: 1,
    color: 'bg-indigo-500',
  },
  {
    id: 4,
    name: 'ActiveCare Support',
    initials: 'AC',
    role: 'Daily Living Provider',
    lastMessage: 'We can adjust your Saturday morning schedule if needed.',
    time: 'Yesterday',
    unread: 0,
    color: 'bg-fuchsia-500',
  },
  {
    id: 5,
    name: 'Dr. Emily Tran',
    initials: 'ET',
    role: 'Psychologist',
    lastMessage: 'Here are the resources I mentioned during our last session.',
    time: 'Mon',
    unread: 0,
    color: 'bg-violet-500',
  },
];

const mockMessages = {
  1: [
    { id: 1, sender: 'them', text: 'Hi! I wanted to follow up on your plan review meeting from last week.', time: '10:05 AM' },
    { id: 2, sender: 'me', text: 'Thanks Sarah! Yes, I had a few questions about the new capacity building goals.', time: '10:12 AM' },
    { id: 3, sender: 'them', text: 'Of course. Which goals would you like to discuss?', time: '10:18 AM' },
    { id: 4, sender: 'me', text: 'The social and community participation one — I want to make sure the hours are enough.', time: '10:24 AM' },
    { id: 5, sender: 'them', text: 'Great question. Based on the assessment, we allocated 6 hours per week. I can request a review if you feel that is not sufficient.', time: '10:28 AM' },
    { id: 6, sender: 'them', text: 'I have updated your service agreement with the new goals we discussed.', time: '10:32 AM' },
  ],
  2: [
    { id: 1, sender: 'them', text: 'Hi there! Just confirming your upcoming appointment details.', time: '9:00 AM' },
    { id: 2, sender: 'me', text: 'Sure, what day and time?', time: '9:08 AM' },
    { id: 3, sender: 'them', text: 'Your next OT session is confirmed for Thursday at 2pm.', time: '9:15 AM' },
  ],
  3: [
    { id: 1, sender: 'me', text: 'Hi James, has the provider invoice from February been processed yet?', time: '3:40 PM' },
    { id: 2, sender: 'them', text: 'The invoice from last month has been processed and paid.', time: '4:02 PM' },
  ],
  4: [
    { id: 1, sender: 'them', text: 'Just checking in about your weekend support schedule.', time: '11:00 AM' },
    { id: 2, sender: 'me', text: 'Could we move Saturday to 9am instead of 8am?', time: '11:15 AM' },
    { id: 3, sender: 'them', text: 'We can adjust your Saturday morning schedule if needed.', time: '11:30 AM' },
  ],
  5: [
    { id: 1, sender: 'them', text: 'It was great catching up today. I have some reading material for you.', time: '2:00 PM' },
    { id: 2, sender: 'them', text: 'Here are the resources I mentioned during our last session.', time: '2:05 PM' },
  ],
};

const MessagingPage = () => {
  const { user } = useAuth();
  const isProvider = user?.role === 'provider';
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showList, setShowList] = useState(true);

  const filteredConversations = mockConversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConvo = mockConversations.find(c => c.id === selectedConversation);
  const activeMessages = selectedConversation ? (mockMessages[selectedConversation] || []) : [];

  const handleSelectConversation = (id) => {
    setSelectedConversation(id);
    setShowList(false);
  };

  const handleBack = () => {
    setShowList(true);
    setSelectedConversation(null);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">
          Communicate securely with {isProvider ? 'participants and coordinators' : 'participants and providers'}
        </p>
      </div>

      {/* Two-Panel Layout */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" style={{ height: '70vh', minHeight: '500px' }}>
        <div className="flex h-full">

          {/* Left Panel — Conversation List */}
          <div className={`w-full md:w-96 md:min-w-[320px] border-r border-slate-200 flex flex-col ${!showList ? 'hidden md:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">No conversations found</div>
              ) : (
                filteredConversations.map(convo => (
                  <button
                    key={convo.id}
                    onClick={() => handleSelectConversation(convo.id)}
                    className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-slate-50 border-b border-slate-50 ${
                      selectedConversation === convo.id ? 'bg-purple-50 border-l-2 border-l-purple-500' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 ${convo.color} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                      {convo.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-800 truncate">{convo.name}</span>
                        <span className="text-xs text-slate-400 flex-shrink-0">{convo.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{convo.role}</p>
                      <p className="text-sm text-slate-500 mt-1 truncate">{convo.lastMessage}</p>
                    </div>
                    {convo.unread > 0 && (
                      <span className="flex-shrink-0 mt-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {convo.unread}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Panel — Active Conversation */}
          <div className={`flex-1 flex flex-col ${showList ? 'hidden md:flex' : 'flex'}`}>
            {!selectedConversation ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">Select a conversation to start messaging</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-sm">
                  Choose a conversation from the list or start a new one to communicate securely with your {isProvider ? 'participants' : 'providers'}.
                </p>
              </div>
            ) : (
              <>
                {/* Conversation Header */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <button
                    onClick={handleBack}
                    className="md:hidden p-1 rounded-lg hover:bg-white/60 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  {activeConvo && (
                    <>
                      <div className={`w-9 h-9 ${activeConvo.color} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                        {activeConvo.initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">{activeConvo.name}</h3>
                        <p className="text-xs text-slate-500">{activeConvo.role}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                  <div className="flex items-center justify-center my-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                      <Clock className="w-3 h-3" />
                      Today
                    </span>
                  </div>
                  {activeMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                          msg.sender === 'me'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl rounded-br-md shadow-md'
                            : 'bg-white text-slate-700 rounded-2xl rounded-bl-md shadow-sm border border-slate-100'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1.5 ${msg.sender === 'me' ? 'text-purple-200' : 'text-slate-400'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      rows={1}
                      className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className="flex-shrink-0 p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl shadow-md transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full" />
                    End-to-end secure messaging
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
