'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../lib/auth-context';

export default function ChatWidget() {
  const pathname = usePathname();
  if (pathname?.startsWith('/dashboard')) return null;
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'Suggest a minimalist look for Men',
    'Do you have any jackets in stock?',
    'What is your cheapest category?',
  ]);

  const messagesEndRef = useRef(null);

  // Load chat session dynamically
  useEffect(() => {
    const loadSession = async () => {
      if (user) {
        try {
          const convo = await apiClient.get('/api/ai/chat/user-conversation');
          if (convo) {
            setConversationId(convo._id);
            setMessages(convo.messages || []);
          }
        } catch (err) {
          console.error('Error loading user conversation:', err);
        }
      } else {
        const savedConvoId = localStorage.getItem('vestra_guest_convo_id');
        if (savedConvoId) {
          setConversationId(savedConvoId);
          try {
            const data = await apiClient.get(`/api/ai/chat/history?conversationId=${savedConvoId}`);
            if (data.messages) {
              setMessages(data.messages);
            }
          } catch (err) {
            console.error('Error loading guest conversation history:', err);
          }
        } else {
          setMessages([
            {
              role: 'assistant',
              content: "Hello! I am the Vestra Stylist. I can recommend premium minimalist outfits from our catalog, answer sizing questions, or guide your style. What are you looking for today?",
            }
          ]);
        }
      }
    };

    loadSession();
  }, [user]);

  // Background polling for admin manual replies
  useEffect(() => {
    if (!isOpen || !conversationId) return;

    const pollHistory = async () => {
      try {
        const data = await apiClient.get(`/api/ai/chat/history?conversationId=${conversationId}`);
        if (data.messages && JSON.stringify(data.messages) !== JSON.stringify(messages)) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Polling chat history error:', err);
      }
    };

    pollHistory(); // Run immediately on open/update to prevent waiting!

    const interval = setInterval(pollHistory, 2500); // Snappier 2.5s polling interval
    return () => clearInterval(interval);
  }, [isOpen, conversationId, messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;

    // Append user message
    const newMessages = [...messages, { role: 'user', content: messageText }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call chat API
      const result = await apiClient.post('/api/ai/chat', {
        conversationId,
        message: messageText,
        pageContext: `Current URL path: ${pathname}`,
      });

      if (result.conversationId) {
        setConversationId(result.conversationId);
        if (!user) {
          localStorage.setItem('vestra_guest_convo_id', result.conversationId);
        }
      }

      // Append assistant message
      setMessages([...newMessages, { role: 'assistant', content: result.response }]);
      
      if (result.suggestedQuestions && result.suggestedQuestions.length > 0) {
        setSuggestedQuestions(result.suggestedQuestions);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an issue connecting to the stylist database. Please verify your internet connection or try again later.",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert markdown-style product links [name](/products/id) into clickable elements
  const formatMessageText = (text) => {
    if (!text) return '';
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const linkText = match[1];
      const linkUrl = match[2];
      
      parts.push(
        <Link
          key={match.index}
          href={linkUrl}
          onClick={() => setIsOpen(false)}
          className="text-[#C9FA75] underline font-bold hover:text-white transition-colors"
        >
          {linkText}
        </Link>
      );
      
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="font-body">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-dark text-white hover:text-dark hover:bg-[#C9FA75] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-zinc-800"
            aria-label="Open Vestra Stylist Chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l3.597-1.199a8.032 8.032 0 006.197-3.236m-1.936-4.82c.119-.517.185-1.056.185-1.608 0-4.418-3.582-8-8-8a8.003 8.003 0 00-7 4.5m10.5 4.5a3.502 3.502 0 01-3.5 3.5 3.502 3.502 0 01-3.5-3.5c0-.983.405-1.87 1.057-2.505M13.5 10.5h.008v.008H13.5V10.5zm-3.75.375h.008v.008H9.75v-.008z" />
            </svg>
          </button>
        </div>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-full sm:h-[550px] bg-dark text-white sm:rounded-2xl shadow-2xl border border-zinc-850 sm:border-zinc-800/80 flex flex-col overflow-hidden z-45 animate-slide-in">
          
          {/* Header */}
          <div className="bg-zinc-950 px-5 py-4 flex justify-between items-center border-b border-zinc-900">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 bg-[#C9FA75] rounded-full animate-pulse" />
              <div>
                <h3 className="font-heading font-black text-xs uppercase tracking-wider">Vestra Stylist</h3>
                <p className="text-[10px] text-zinc-500 font-medium">Live Catalog Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white p-1.5 hover:bg-zinc-900 rounded-full transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-900/40">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={index}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-zinc-850 text-zinc-100 border border-zinc-800'
                        : 'bg-[#C9FA75] text-dark font-semibold'
                    }`}
                  >
                    {isAssistant ? formatMessageText(msg.content) : msg.content}
                  </div>
                </div>
              );
            })}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-850 border border-zinc-800 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-[#C9FA75] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#C9FA75] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#C9FA75] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {!isLoading && suggestedQuestions.length > 0 && (
            <div className="px-5 py-2.5 bg-zinc-950 border-t border-zinc-900 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white px-3 py-1.5 rounded-full transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Footer input form */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputMessage);
              }}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about items, fit, or styling..."
                className="flex-grow bg-transparent text-xs text-white outline-none border-none py-2 placeholder-zinc-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="text-[#C9FA75] hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
