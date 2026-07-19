'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import toast from 'react-hot-toast';
import { Person, Circle, Star, ArrowRight, Tag, Bulb, ArrowLeft, FaceRobot } from '@gravity-ui/icons';

export default function DashboardChatsPage() {
  const queryClient = useQueryClient();
  const [activeChatTab, setActiveChatTab] = useState('active'); // 'active' | 'previous'
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [prodSearch, setProdSearch] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch all chats grouped into active and previous
  const { data: chatData = { activeChats: [], previousChats: [] }, isLoading, isError } = useQuery({
    queryKey: ['admin-chats-list'],
    queryFn: () => apiClient.get('/api/admin/chats'),
    refetchInterval: 3000, // Poll chats list every 3s to capture new messages in real-time!
  });

  // Fetch all products for tagging suggestions
  const { data: productsData } = useQuery({
    queryKey: ['admin-chat-products-list'],
    queryFn: () => apiClient.get('/api/products?limit=150'),
  });

  const products = productsData?.products || [];

  const chatList = activeChatTab === 'active' ? chatData.activeChats : chatData.previousChats;

  // Find currently selected chat details
  const selectedChat = [...chatData.activeChats, ...chatData.previousChats].find(
    (c) => c._id === selectedChatId
  );

  // Auto-scroll to bottom of chat screen when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  // Reply Mutation
  const replyMutation = useMutation({
    mutationFn: ({ id, message }) => apiClient.post(`/api/admin/chats/${id}/reply`, { message }),
    onSuccess: () => {
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['admin-chats-list'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send response');
    },
  });

  // Toggle AI Mutation
  const toggleAiMutation = useMutation({
    mutationFn: ({ id, aiEnabled }) => apiClient.post(`/api/admin/chats/${id}/toggle-ai`, { aiEnabled }),
    onSuccess: (data) => {
      toast.success(data.aiEnabled ? 'AI Assistant activated' : 'AI Assistant disabled. You have manual control.');
      queryClient.invalidateQueries({ queryKey: ['admin-chats-list'] });
    },
    onError: (err) => {
      toast.error('Failed to change assistant mode');
    },
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatId) return;
    replyMutation.mutate({ id: selectedChatId, message: replyText });
  };

  const handleToggleAi = (aiStatus) => {
    if (!selectedChatId) return;
    toggleAiMutation.mutate({ id: selectedChatId, aiEnabled: !aiStatus });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row border border-zinc-150 rounded-2xl bg-white overflow-hidden shadow-sm font-body">
      
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-zinc-150 flex flex-col flex-shrink-0 bg-zinc-50/50 h-full min-h-0 overflow-hidden ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-150 bg-white">
          <h2 className="font-heading font-black text-lg text-dark uppercase tracking-tight mb-3">Stylist Chats</h2>
          
          {/* Tab Selector */}
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setActiveChatTab('active');
                setSelectedChatId(null);
              }}
              className={`flex-1 text-center py-2 text-[10px] font-heading font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeChatTab === 'active'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-zinc-400 hover:text-dark'
              }`}
            >
              Active ({chatData.activeChats.length})
            </button>
            <button
              onClick={() => {
                setActiveChatTab('previous');
                setSelectedChatId(null);
              }}
              className={`flex-1 text-center py-2 text-[10px] font-heading font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeChatTab === 'previous'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-zinc-400 hover:text-dark'
              }`}
            >
              Previous ({chatData.previousChats.length})
            </button>
          </div>
        </div>

        {/* Chats Feed */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {isLoading ? (
            <div className="p-8 text-center text-zinc-400 text-xs animate-pulse">Loading conversations...</div>
          ) : chatList.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-xs">No styling conversations found.</div>
          ) : (
            chatList.map((chat) => {
              const lastMsg = chat.messages?.[chat.messages.length - 1];
              const isSelected = chat._id === selectedChatId;
              return (
                <button
                  key={chat._id}
                  onClick={() => setSelectedChatId(chat._id)}
                  className={`w-full text-left p-4.5 transition-all duration-150 flex items-start gap-3 border-l-4 ${
                    isSelected
                      ? 'bg-white border-dark'
                      : 'border-transparent hover:bg-zinc-50'
                  }`}
                >
                  <div className="relative w-8 h-8 rounded-full bg-zinc-200 flex-shrink-0 flex items-center justify-center font-heading font-bold text-dark text-[10px] uppercase">
                    {(chat.userId === 'anonymous' ? 'AN' : 'C').substring(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-bold text-dark text-xs uppercase truncate">
                        {chat.customerName || 'Anonymous Guest'}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">
                        {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[10px] font-mono truncate mt-0.5">ID: {chat._id}</p>
                    {lastMsg && (
                      <p className="text-zinc-500 text-xs truncate mt-2 font-body italic">
                        "{lastMsg.content}"
                      </p>
                    )}
                    
                    {/* Badges indicators */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-heading font-bold uppercase tracking-wider ${
                        chat.aiEnabled !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                          : 'bg-amber-50 text-amber-700 border border-amber-150'
                      }`}>
                        {chat.aiEnabled !== false ? 'AI Agent' : 'Human Takeover'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-zinc-50/30 h-full min-h-0 overflow-hidden ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Pane Header */}
            <div className="p-4 bg-white border-b border-zinc-150 flex items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setSelectedChatId(null)}
                  className="md:hidden p-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-dark transition cursor-pointer flex items-center justify-center flex-shrink-0"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-heading font-bold text-dark text-[10px] uppercase flex-shrink-0">
                  {(selectedChat.userId === 'anonymous' ? 'AN' : 'C').substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-dark text-xs uppercase tracking-wide truncate">
                    {selectedChat.customerName || 'Anonymous Guest'}
                  </h3>
                  <p className="text-[9px] font-mono text-zinc-400 mt-0.5 truncate">Convo: {selectedChat._id}</p>
                </div>
              </div>

              {/* AI Takeover Switch */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleToggleAi(selectedChat.aiEnabled !== false)}
                  disabled={toggleAiMutation.isPending}
                  className={`px-3 py-2 border rounded-xl flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer text-[10px] font-heading font-bold uppercase tracking-wider ${
                    selectedChat.aiEnabled !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {selectedChat.aiEnabled !== false ? (
                    <>
                      <FaceRobot className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="hidden sm:inline">AI Autopilot</span>
                    </>
                  ) : (
                    <>
                      <Person className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="hidden sm:inline">Manual Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Chat Timeline scrollbox */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedChat.messages?.map((msg, idx) => {
                const isAssistant = msg.role === 'assistant';
                const isAdminMessage = msg.sender === 'admin';
                return (
                  <div key={idx} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                    <div className="max-w-[75%] space-y-1">
                      <div className="flex items-center gap-1.5 px-1">
                        <span className="text-[8px] font-heading font-bold uppercase tracking-widest text-zinc-400">
                          {isAssistant ? (isAdminMessage ? 'Admin Agent' : 'Vestra AI') : 'Customer'}
                        </span>
                      </div>
                      <div className={`p-4.5 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? (isAdminMessage ? 'bg-dark text-white rounded-tl-sm' : 'bg-zinc-100 text-zinc-700 rounded-tl-sm')
                          : 'bg-[#C9FA75] text-dark rounded-tr-sm'
                      }`}>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Manual Reply Form Box */}
            <div className="p-4 bg-white border-t border-zinc-150">
              <form onSubmit={handleSendReply} className="flex gap-3 items-center">
                <div className="relative flex-1 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={
                      selectedChat.aiEnabled !== false
                        ? "Disable AI (Autopilot) to manually reply to this customer..."
                        : "Type your manual reply..."
                    }
                    disabled={selectedChat.aiEnabled !== false || replyMutation.isPending}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-dark rounded-xl text-xs outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body"
                  />
                  
                  {/* Product Tag Mention Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={selectedChat.aiEnabled !== false}
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className="h-full px-3.5 md:px-4 border border-zinc-200 hover:border-dark hover:bg-zinc-50 text-dark font-heading font-bold text-[9px] uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                    >
                      <Tag className="w-3 h-3 flex-shrink-0" />
                      <span className="hidden md:inline">Mention Product</span>
                    </button>

                    {isSearchOpen && (
                      <div className="absolute bottom-full mb-3 right-[-60px] sm:right-0 w-[290px] max-w-[calc(100vw-32px)] bg-white border border-zinc-150 rounded-2xl shadow-xl z-50 p-3 animate-fade-in space-y-2">
                        <h4 className="text-[9px] font-heading font-bold uppercase tracking-wider text-zinc-400">Search Catalog Item</h4>
                        <input
                          type="text"
                          placeholder="Type product name..."
                          value={prodSearch}
                          onChange={(e) => setProdSearch(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-dark rounded-xl text-xs outline-none font-body"
                        />
                        <div className="max-h-40 overflow-y-auto divide-y divide-zinc-100">
                          {products
                            .filter(p => p.name?.toLowerCase().includes(prodSearch.toLowerCase()))
                            .slice(0, 8)
                            .map(p => (
                              <button
                                key={p._id}
                                type="button"
                                onClick={() => {
                                  setReplyText(prev => (prev ? prev + ' ' : '') + `[${p.name}](/products/${p._id})`);
                                  setIsSearchOpen(false);
                                  setProdSearch('');
                                }}
                                className="w-full text-left py-2 px-1 hover:bg-[#C9FA75]/20 text-[11px] font-heading font-bold uppercase truncate transition-colors text-zinc-700 hover:text-dark cursor-pointer"
                              >
                                {p.name} (৳{p.price})
                              </button>
                            ))}
                          {products.filter(p => p.name?.toLowerCase().includes(prodSearch.toLowerCase())).length === 0 && (
                            <div className="text-zinc-400 text-center py-4 text-[10px]">No catalog match found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={selectedChat.aiEnabled !== false || replyMutation.isPending || !replyText.trim()}
                  className="bg-dark text-white hover:bg-[#C9FA75] hover:text-dark px-4 md:px-6 py-3.5 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150 flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              {selectedChat.aiEnabled !== false && (
                <p className="text-[9px] text-zinc-400 mt-2 font-body flex items-center justify-center gap-1">
                  <Bulb className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                  <span>Autopilot AI is answering for this session. Disable AI above to type custom manual replies.</span>
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
            <Star className="w-8 h-8 text-zinc-250 mb-3" />
            <h3 className="font-heading font-bold text-dark text-sm uppercase tracking-wide">No Chat Selected</h3>
            <p className="text-zinc-400 text-xs mt-1">Select a customer session from the left feed list to review chat streams.</p>
          </div>
        )}
      </div>

    </div>
  );
}
