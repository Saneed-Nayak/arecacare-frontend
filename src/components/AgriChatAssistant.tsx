import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, X, Minimize2, Maximize2, HelpCircle, CheckCircle, Leaf } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestions?: string[];
}

interface AgriChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgriChatAssistant: React.FC<AgriChatAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Namaskara! I am your ArecaCare AI Smart Agronomist. Ask me anything about arecanut diseases, Bordeaux mixture preparation, fertilizer schedules, or monsoon disease prevention.',
      time: 'Just now',
      suggestions: [
        'How do I prepare 1% Bordeaux mixture?',
        'What are the first symptoms of Yellow Leaf Disease?',
        'How to prevent Mahali / Koleroga during heavy rain?',
        'Recommended NPK fertilizer dosage per palm'
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getAiResponse = (query: string): { text: string; suggestions?: string[] } => {
    const q = query.toLowerCase();

    if (q.includes('bordeaux') || q.includes('1%') || q.includes('mixture') || q.includes('copper')) {
      return {
        text: '🌿 **Preparation of 1% Bordeaux Mixture (Standard ICAR-CPCRI Method):**\n\n1. **Ingredients:** 1 kg Copper Sulphate (Neela Tutta) + 1 kg Quicklime (Sunna) + 100 Litres Clean Water.\n2. **Steps:**\n   - Dissolve 1 kg Copper Sulphate in 50L water in an earthen or plastic vessel (avoid iron/metal containers).\n   - Slake 1 kg Quicklime in another 50L water to prepare milk of lime.\n   - Slowly pour the Copper Sulphate solution into the lime solution while stirring continuously.\n3. **Knife Test:** Dip a clean iron knife or nail into the solution for 1 minute. If no copper deposits form on the blade, the mixture is neutral and safe for spraying.\n4. **Tip:** Add 100g of rosin adhesive sticker for better adhesion during monsoon rains!',
        suggestions: ['How to apply to nut bunches?', 'Can I store Bordeaux mixture overnight?']
      };
    }

    if (q.includes('yellow leaf') || q.includes('yld') || q.includes('kendu')) {
      return {
        text: '🍂 **Yellow Leaf Disease (YLD) Management Protocol:**\n\n- **Early Indicator:** Distinct golden-yellow chlorosis beginning on inner whorl leaflets with green central veins.\n- **Vector Management:** Spray Dimethoate 30 EC (1.5 ml/L) or Imidacloprid (0.3 ml/L) to control sap-sucking plant hoppers (*Proutista moesta*).\n- **Nutritional Support:** Apply 140g Potash (MOP) + 50g Magnesium Sulphate + 25g Zinc Sulphate per palm in split doses.\n- **Drainage:** Ensure 90cm deep drainage channels to prevent root zone waterlogging.',
        suggestions: ['Is there a cure for YLD?', 'Where can I get disease-free seedlings?']
      };
    }

    if (q.includes('mahali') || q.includes('koleroga') || q.includes('fruit rot') || q.includes('rain')) {
      return {
        text: '🌧️ **Mahali / Koleroga Emergency & Prophylactic Advisory:**\n\n- **Pre-Monsoon Spray:** Mandatory 1% Bordeaux mixture spray directly over nut bunches before monsoon onset (late May).\n- **Second Spray:** 40 days after first spray during a monsoon break.\n- **Non-Chemical Eco-option:** Tie 100-200 gauge UV polythene covers around nut bunches in early June before rains begin (98% efficacy).\n- **Active Outbreak:** If green nuts are already shedding, spray Metalaxyl-Mancozeb (Ridomil MZ @ 2.5 g/L) immediately.',
        suggestions: ['How to tie polythene covers?', 'How to dispose of fallen diseased nuts?']
      };
    }

    if (q.includes('fertilizer') || q.includes('npk') || q.includes('dosage') || q.includes('manure')) {
      return {
        text: '🌱 **Standard Annual Fertilizer Schedule (Per Bearing Palm):**\n\n- **Nitrogen (N):** 100g (equivalent to ~220g Urea)\n- **Phosphorus (P2O5):** 40g (equivalent to ~250g Rock Phosphate / SSP)\n- **Potassium (K2O):** 140g (equivalent to ~235g Muriate of Potash - MOP)\n- **Organic Matter:** 12-15 kg Farmyard Manure / Compost + 1-2 kg Neem Cake.\n\n**Application Splits:**\n1. First Split (1/3rd): September - October (Post-monsoon)\n2. Second Split (2/3rd): February - March (Under irrigation)',
        suggestions: ['How to apply fertilizer in root basin?', 'What micronutrients are needed?']
      };
    }

    if (q.includes('bud rot') || q.includes('spindle') || q.includes('suli')) {
      return {
        text: '⚠️ **Bud Rot (Spindle Rot) Urgent Intervention:**\n\n1. Inspect palm crown immediately when the central spindle leaf starts withering.\n2. Climb palm and gently remove all rotting, foul-smelling tissue from the central shoot until clean, healthy white tissue is visible.\n3. Swab the exposed shoot wound thoroughly with 10% thick Bordeaux paste.\n4. Protect the crown by placing a perforated plastic cover or leaf sheath over the treated bud to prevent rainwater ingress for 2 weeks.',
        suggestions: ['What causes bud rot?', 'How to protect neighboring trees?']
      };
    }

    return {
      text: `Thank you for asking about "${query}". In arecanut farming, timely preventative management (such as prophylactic Bordeaux spraying before monsoons, balanced 100:40:140g NPK nutrition, and maintaining 90cm field drainage) is essential for maintaining high yield. Would you like a detailed protocol on disease symptoms, organic control, or weather-based risk?`,
      suggestions: [
        'How do I prepare 1% Bordeaux mixture?',
        'What are the symptoms of Mahali?',
        'Yellow Leaf Disease treatment'
      ]
    };
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAiResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        time: 'Just now',
        suggestions: response.suggestions
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 650);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] h-[560px] animate-slideUp">
      {/* Top Header */}
      <div className="bg-[#0D3B24] text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#176B3A] flex items-center justify-center text-white">
            <Bot className="w-5 h-5 text-[#EAF5EC]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">ArecaCare Agro-AI</h3>
              <span className="w-2 h-2 rounded-full bg-[#4FAF68] animate-pulse"></span>
            </div>
            <p className="text-[11px] text-[#EAF5EC]/70">Expert Agronomic Advisory Assistant</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAFBF8] text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                m.sender === 'user'
                  ? 'bg-[#176B3A] text-white rounded-br-xs'
                  : 'bg-white text-[#17231B] border border-gray-200 rounded-bl-xs'
              }`}
            >
              {m.text}
            </div>

            {/* Quick Suggestion Pills */}
            {m.suggestions && m.suggestions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                {m.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] bg-white hover:bg-[#EAF5EC] text-[#176B3A] border border-[#176B3A]/20 px-2.5 py-1 rounded-full transition-all text-left shadow-2xs cursor-pointer"
                  >
                    💬 {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#66736A] p-2 bg-white rounded-xl border border-gray-200 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B3A] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B3A] animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B3A] animate-bounce delay-300" />
            <span className="text-[11px] italic">Agronomist is formulating guidance...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputVal);
        }}
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask a question on arecanut farming..."
          className="flex-1 bg-[#FAFBF8] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#17231B] focus:outline-none focus:ring-2 focus:ring-[#176B3A] focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="bg-[#176B3A] hover:bg-[#0D3B24] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
