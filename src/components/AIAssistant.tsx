'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! I’m your AI Assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    if (message.includes('course') || message.includes('learn')) {
      return 'I can help you find a course! Try searching for a topic like "Python" or filter by category in the search bar above. Do you have a specific subject in mind?';
    } else if (message.includes('certificate') || message.includes('certification')) {
      return 'You can find certification courses in the "Certification Courses" section. Scroll down to see available options, or filter by "Certification" in the filters.';
    } else if (message.includes('navigate') || message.includes('page')) {
      return 'Use the navigation bar at the bottom to switch between pages like Home, Courses, Dashboard, and Profile. Where would you like to go?';
    } else {
      return 'I’m here to assist! You can ask about courses, certifications, navigation, or anything else related to your learning journey. What would you like to know?';
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);

    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 500);

    setInput('');
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed left-0 top-18 h-150 z-50 flex items-center">
      {!isOpen && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-r-full shadow-lg cursor-pointer transition-colors duration-300 bg-gray-800/90 text-cyan-400"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="w-6 h-6" />
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 backdrop-blur-lg shadow-xl flex flex-col border-r border-gray-700"
          >
            <div className="p-5  flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-cyan-400" />
                <h2 className="text-lg font-semibold text-gray-100">Hey Buddy</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div id="chat-container" className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-violet-500 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600 focus:ring-2 focus:ring-cyan-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <Button
                  onClick={handleSend}
                  className="bg-violet-500 hover:bg-violet-600 text-white"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
