import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Check } from 'lucide-react'

const QUIZ_QUESTIONS = [
  {
    id: 'style',
    question: "How would you define your personal style?",
    options: ["Minimalist & Understated", "Bold & Avant-Garde", "Classic & Timeless", "Trend-Focused"]
  },
  {
    id: 'category',
    question: "What are you primarily shopping for today?",
    options: ["Bridal Couture", "Everyday Luxury", "Gifting", "Statement Jewelry"]
  },
  {
    id: 'budget',
    question: "What is your preferred budget range?",
    options: ["Under ₹50,000", "₹50,000 - ₹2,00,000", "Above ₹2,00,000", "No Budget Constraint"]
  },
  {
    id: 'color',
    question: "Which color palette speaks to you?",
    options: ["Monochrome (Blacks & Whites)", "Jewel Tones (Emerald, Ruby)", "Earthy Neutrals", "Pastels & Soft Hues"]
  }
]

export default function StyleQuizModal({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  
  useEffect(() => {
    const hasCompleted = localStorage.getItem('style_quiz_completed')
    if (!hasCompleted) {
      // Show quiz after 2.5 seconds of landing
      const timer = setTimeout(() => setIsOpen(true), 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
    
    // Automatically advance after a short delay
    setTimeout(() => {
      if (step < QUIZ_QUESTIONS.length - 1) {
        setStep(prev => prev + 1)
      } else {
        finishQuiz({ ...answers, [questionId]: option })
      }
    }, 500)
  }

  const finishQuiz = (finalAnswers) => {
    localStorage.setItem('style_quiz_completed', 'true')
    localStorage.setItem('style_preferences', JSON.stringify(finalAnswers))
    setIsOpen(false)
    if (onComplete) onComplete(finalAnswers)
  }

  const closeQuiz = () => {
    // If they skip, we still mark it as completed so it doesn't bug them again
    localStorage.setItem('style_quiz_completed', 'skipped')
    setIsOpen(false)
  }

  if (!isOpen) return null

  const currentQ = QUIZ_QUESTIONS[step]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1A1A1A] border border-[#FDFBF7]/10 w-full max-w-lg p-8 md:p-12 relative rounded-sm shadow-2xl"
        >
          <button onClick={closeQuiz} className="absolute top-6 right-6 text-[#FDFBF7]/40 hover:text-[#FDFBF7] transition-colors">
            <X size={20} />
          </button>

          <div className="flex gap-2 mb-8 justify-center">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 max-w-[40px] ${i <= step ? 'bg-[#C5A880]' : 'bg-[#FDFBF7]/10'}`} />
            ))}
          </div>

          <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#C5A880] mb-4 text-center">
            Personalize Your Experience
          </p>
          <h2 className="text-2xl md:text-3xl font-serif text-[#FDFBF7] mb-10 text-center leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.id] === opt
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(currentQ.id, opt)}
                  className={`relative p-5 text-left border rounded-sm transition-all duration-300 font-sans text-sm tracking-wide flex items-center justify-between group overflow-hidden ${
                    isSelected 
                      ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#C5A880]' 
                      : 'border-[#FDFBF7]/10 text-[#FDFBF7]/70 hover:border-[#FDFBF7]/40 hover:text-[#FDFBF7]'
                  }`}
                >
                  <div className="absolute inset-0 bg-[#C5A880]/0 group-hover:bg-[#C5A880]/5 transition-colors" />
                  <span className="relative z-10">{opt}</span>
                  {isSelected ? (
                    <Check size={18} className="text-[#C5A880] relative z-10" />
                  ) : (
                    <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FDFBF7]/40 relative z-10" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <button onClick={closeQuiz} className="text-[10px] font-sans tracking-widest text-[#FDFBF7]/40 hover:text-[#FDFBF7] uppercase underline underline-offset-4 transition-colors">
              Skip for now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
