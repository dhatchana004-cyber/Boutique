import { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'

export default function VoiceSearch({ onResult }) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const reco = new SpeechRecognition()
        reco.continuous = false
        reco.interimResults = false
        reco.lang = 'en-US'

        reco.onstart = () => {
          setIsListening(true)
        }

        reco.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          onResult(transcript)
          setIsListening(false)
        }

        reco.onerror = (event) => {
          console.error('Voice search error:', event.error)
          setIsListening(false)
        }

        reco.onend = () => {
          setIsListening(false)
        }

        setRecognition(reco)
      }
    }
  }, [onResult])

  const toggleListening = () => {
    if (!recognition) {
      alert("Your browser does not support Voice Search. Please try Chrome or Safari.")
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  if (!recognition) return null

  return (
    <button 
      onClick={toggleListening} 
      type="button"
      className={`p-1.5 rounded-full transition-all ${isListening ? 'bg-[#D4AF37]/20 text-[#D4AF37] animate-pulse' : 'text-[#FFFFFF]/60 hover:text-[#FFFFFF]'}`}
      aria-label="Voice Search"
    >
      {isListening ? <Mic size={14} /> : <MicOff size={14} />}
    </button>
  )
}
