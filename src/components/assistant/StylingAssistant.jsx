import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageSquare, X, Send, Sparkles } from 'lucide-react'

export default function StylingAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Atelier Styling Assistant. What occasion are you shopping for today?", sender: 'bot' }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const handleSend = () => {
    if (!inputText.trim()) return

    const newMsg = { id: Date.now(), text: inputText, sender: 'user' }
    setMessages(prev => [...prev, newMsg])
    setInputText('')
    setIsTyping(true)

    // Simulate AI response logic
    setTimeout(() => {
      let botResponse = "I see. Feel free to browse our collections, or let me know if you have a specific product in mind!"
      
      const lowerInput = newMsg.text.toLowerCase()
      if (lowerInput.includes('wedding') || lowerInput.includes('marriage')) {
        botResponse = "For a wedding, our Kanchipuram silk weaves are unparalleled. They offer a regal presence. Would you like to see our latest bridal collection?"
      } else if (lowerInput.includes('party') || lowerInput.includes('event')) {
        botResponse = "For a party, you might want something elegant yet striking. Do you prefer deep colors like emerald or ruby, or something lighter?"
      } else if (lowerInput.includes('red') || lowerInput.includes('green') || lowerInput.includes('blue') || lowerInput.includes('black') || lowerInput.includes('white')) {
        botResponse = "That's a fantastic color choice! It always adds a touch of elegance. Shall I show you our best pieces in that shade?"
      } else if (lowerInput.includes('gift') || lowerInput.includes('return')) {
        botResponse = "We have exquisite options for gifts. Should I show you our luxury gifting collection under ₹5000?"
      } else if (lowerInput.includes('yes') || lowerInput.includes('sure') || lowerInput.includes('ok')) {
        botResponse = "Excellent. I've prepared some tailored recommendations for you. Take your time to explore!"
      } else if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
        botResponse = "Hello again! How can I assist you with your luxury shopping today?"
      } else {
        // Pseudo-random fallback so it doesn't repeat
        const fallbacks = [
          "I can certainly help you find the perfect piece. Could you tell me more about your color preferences?",
          "That sounds wonderful. Are you looking for clothing, or perhaps some accessories to match?",
          "I understand. What kind of fabric or material do you usually prefer?",
          "Got it. Feel free to browse our new arrivals, or let me know if you want specific recommendations."
        ]
        botResponse = fallbacks[Math.floor(Math.random() * fallbacks.length)]
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-[#D4AF37] text-black rounded-full shadow-2xl hover:scale-105 transition-transform ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open Styling Assistant"
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 max-h-[85vh] bg-[#0a0a0a] border border-[#FFFFFF]/20 shadow-2xl z-50 flex flex-col rounded-sm overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#111111] p-4 flex items-center justify-between border-b border-[#FFFFFF]/10 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#D4AF37]" />
              <h3 className="text-[#FFFFFF] font-serif text-sm">Styling Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#FFFFFF]/60 hover:text-[#FFFFFF]" aria-label="Close Chat">
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 min-h-[200px] overflow-y-auto p-4 flex flex-col gap-4 bg-[#000000]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 text-xs font-sans leading-relaxed ${msg.sender === 'user' ? 'bg-[#FFFFFF]/10 text-[#FFFFFF] rounded-l-md rounded-tr-md' : 'bg-[#111111] border border-[#FFFFFF]/10 text-[#FFFFFF]/80 rounded-r-md rounded-tl-md'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#111111] border border-[#FFFFFF]/10 p-3 rounded-r-md rounded-tl-md flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#FFFFFF]/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#FFFFFF]/40 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-1.5 h-1.5 bg-[#FFFFFF]/40 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#111111] border-t border-[#FFFFFF]/10 flex items-center gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for styling advice..." 
              className="flex-1 bg-transparent border border-[#FFFFFF]/10 rounded-sm px-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-[#D4AF37] text-black rounded-sm hover:bg-white transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
