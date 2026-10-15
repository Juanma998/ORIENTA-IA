import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  FileText,
  User,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  FileSearch,
  PenTool,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { ChatMessage, DatosMinimos, ChecklistFinal } from '../types';
import { enviarMensajeOrienta } from '../services/chatService';
import { OrientaLogo } from './OrientaLogo';

interface ChatInterfaceProps {
  datos: DatosMinimos;
  onUpdateDatos: (nuevosDatos: DatosMinimos) => void;
  onChecklistGenerado: (checklist: ChecklistFinal) => void;
  onVerChecklist: () => void;
  onAbrirHerramientasIa?: (subTab: 'auditor' | 'redactor') => void;
}

const CASOS_HUMANOS = [
  'Negativa de afiliación o traspaso de obra social',
  'Falta de cobertura en medicamentos o tratamientos',
  'Problemas con el aumento o valor de las cuotas',
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  datos,
  onUpdateDatos,
  onChecklistGenerado,
  onVerChecklist,
  onAbrirHerramientasIa,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'bienvenida-humana',
      role: 'assistant',
      content: `Hola, soy **Orienta IA**, el asistente virtual oficial de la Superintendencia de Servicios de Salud (SSSalud).

Mi objetivo es guiarte paso a paso en tus trámites ante tu obra social o prepaga para evitar que pierdas tiempo presentándote con documentación incompleta.

Por favor, contame: **¿cuál es el inconveniente o problema que estás teniendo hoy?**`,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      quickReplies: CASOS_HUMANOS,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textoAEnviar?: string) => {
    const texto = (textoAEnviar || inputText).trim();
    if (!texto || isTyping) return;

    setInputText('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: texto,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const res = await enviarMensajeOrienta(texto, history, datos);

      onUpdateDatos(res.nuevosDatos);

      if (res.checklistGenerado) {
        onChecklistGenerado(res.checklistGenerado);
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: res.replyText,
        timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: res.quickReplies,
        checklist: res.checklistGenerado,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            'Disculpame, ocurrió un breve corte en la conexión del servicio oficial. Por favor reintentá en unos segundos.',
          timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const reiniciarConversacion = () => {
    onUpdateDatos({
      categoria: null,
      condicionLaboral: null,
      destinatario: null,
    });
    setMessages([
      {
        id: 'bienvenida-reset',
        role: 'assistant',
        content: `Reiniciamos la charla. Contame tranquilo/a: ¿cuál es el problema o trámite que necesitás consultar?`,
        timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: CASOS_HUMANOS,
      },
    ]);
  };

  const renderFormattedContent = (content: string) => {
    // If the message contains a code block with JSON
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      const preText = content.substring(0, jsonMatch.index).trim();
      const jsonStr = jsonMatch[1].trim();
      const postText = content.substring((jsonMatch.index || 0) + jsonMatch[0].length).trim();

      return (
        <div className="space-y-3 text-[15px] leading-relaxed">
          {preText && renderFormattedContent(preText)}
          <div className="bg-[#174A45] border border-[#205B53] text-[#E4F2EC] rounded-xl p-3.5 shadow-xs font-mono text-xs overflow-x-auto my-2">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/20 text-[10px] text-[#E4F2EC] font-sans uppercase font-bold tracking-wider">
              <span>Resumen Oficial Estructurado</span>
              <span className="text-[#E4F2EC]">✓ Validado SSSalud</span>
            </div>
            <pre className="text-white leading-relaxed whitespace-pre font-mono text-xs">
              {jsonStr}
            </pre>
          </div>
          {postText && renderFormattedContent(postText)}
        </div>
      );
    }

    const lines = content.split('\n');

    return (
      <div className="space-y-2 text-[15px] font-normal leading-relaxed text-[#263D38]">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (trimmed.startsWith('### ')) {
            return (
              <h4
                key={idx}
                className="text-[17px] font-bold text-[#174A45] uppercase tracking-wide pt-3 pb-1 border-b border-[#DDE5DF] flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#174A45]" />
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
            const itemText = trimmed.replace(/^[•-]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 text-[#263D38]">
                <span className="text-[#174A45] font-bold leading-5">•</span>
                <span
                  className="flex-1"
                  dangerouslySetInnerHTML={{
                    __html: itemText
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#174A45]">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>'),
                  }}
                />
              </div>
            );
          }

          if (trimmed.startsWith('> ') || trimmed.startsWith('💡 ')) {
            return (
              <div
                key={idx}
                className="p-3 bg-[#E4F2EC]/60 border-l-3 border-[#174A45] rounded-r-xl text-xs sm:text-sm text-[#174A45] my-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#174A45]">$1</strong>'),
                }}
              />
            );
          }

          if (trimmed === '') {
            return <div key={idx} className="h-1" />;
          }

          return (
            <p
              key={idx}
              className="text-[#263D38]"
              dangerouslySetInnerHTML={{
                __html: trimmed
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#174A45]">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>'),
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-175px)] min-h-[550px] max-w-5xl mx-auto px-2 sm:px-4 py-3">
      {/* Friendly Human Bar */}
      <div className="mb-2 bg-white px-3.5 py-2.5 rounded-xl border border-[#DDE5DF] flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 text-[#263D38]">
          <OrientaLogo size="sm" />
          <div>
            <span className="font-bold text-[#174A45] block leading-tight text-[14px]">
              Orienta • Atención Ciudadana
            </span>
            <span className="text-[12px] text-[#52645D]">
              Orientación personalizada y empática • SSSalud
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onAbrirHerramientasIa && (
            <>
              <button
                onClick={() => onAbrirHerramientasIa('auditor')}
                className="h-[36px] px-3.5 rounded-[9px] bg-white hover:bg-[#F0F7F3] text-[#174A45] border border-[#6FA99A] font-semibold flex items-center gap-2 transition-colors duration-200 cursor-pointer text-xs"
              >
                <FileSearch className="w-4 h-4 text-[#174A45]" />
                Revisar orden médica
              </button>
              <button
                onClick={() => onAbrirHerramientasIa('redactor')}
                className="h-[36px] px-3.5 rounded-[9px] bg-white hover:bg-[#F0F7F3] text-[#174A45] border border-[#6FA99A] font-semibold flex items-center gap-2 transition-colors duration-200 cursor-pointer text-xs"
              >
                <PenTool className="w-4 h-4 text-[#174A45]" />
                Redactar intimación
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chat scrollable feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white rounded-2xl p-4 sm:p-6 border border-[#DDE5DF] space-y-4 shadow-xs">
        {messages.map((msg) => {
          const isAsst = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAsst ? 'justify-start' : 'justify-end'}`}
            >
              {isAsst && (
                <OrientaLogo size="sm" />
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-2xs transition-all ${
                  isAsst
                    ? 'bg-white text-[#263D38] border border-[#DDE5DF] rounded-tl-sm'
                    : 'bg-[#174A45] text-white rounded-tr-sm'
                }`}
              >
                {/* Speaker tag and timestamp */}
                <div
                  className={`flex items-center justify-between text-[12px] mb-2 pb-1 border-b ${
                    isAsst
                      ? 'border-[#DDE5DF] text-[#52645D]'
                      : 'border-white/20 text-[#E4F2EC]'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1.5">
                    {isAsst ? (
                      <>
                        <span className="text-[#174A45] font-extrabold text-[13px]">Orienta</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E4F2EC] text-[#174A45] border border-[#DDE5DF]">
                          Asistente SSSalud
                        </span>
                      </>
                    ) : (
                      'Vos'
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px]">{msg.timestamp}</span>
                  </div>
                </div>

                {/* Message body */}
                {isAsst ? (
                  renderFormattedContent(msg.content)
                ) : (
                  <p className="text-[15px] font-normal leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}

                {/* If checklist was generated inside this message */}
                {msg.checklist && (
                  <div className="mt-4 pt-3 border-t border-[#DDE5DF] bg-[#E4F2EC] p-4 rounded-xl border border-[#DDE5DF]">
                    <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#174A45] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-[#174A45] block">
                            Tu Checklist Oficial está listo
                          </span>
                          <span className="text-[12px] text-[#52645D]">
                            {msg.checklist.docGeneral.length +
                              msg.checklist.docMedica.length +
                              msg.checklist.docLaboral.length}{' '}
                            requisitos organizados para presentar
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={onVerChecklist}
                        className="h-10 px-4 bg-[#174A45] hover:bg-[#205B53] text-white rounded-[9px] text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors duration-200 cursor-pointer whitespace-nowrap"
                      >
                        <FileText className="w-4 h-4" />
                        Abrir Checklist & Imprimir
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick replies chips */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-[#DDE5DF]">
                    <span className="text-[12px] font-semibold text-[#52645D] uppercase tracking-wider block mb-1.5">
                      Podés responder rápido con un clic:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (reply.includes('Descargar Checklist') || reply.includes('Ver instrucciones')) {
                              onVerChecklist();
                            } else if (reply.includes('Redactar nota') && onAbrirHerramientasIa) {
                              onAbrirHerramientasIa('redactor');
                            } else if (reply.includes('Auditar') && onAbrirHerramientasIa) {
                              onAbrirHerramientasIa('auditor');
                            } else {
                              handleSend(reply);
                            }
                          }}
                          className="px-3 py-1.5 rounded-[9px] bg-[#F0F7F3] hover:bg-[#E4F2EC] text-[#174A45] text-xs font-semibold border border-[#DDE5DF] hover:border-[#6FA99A] transition-colors duration-200 flex items-center gap-1 cursor-pointer text-left"
                        >
                          <span>{reply}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#174A45] shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isAsst && (
                <div className="w-9 h-9 rounded-full bg-[#E4F2EC] text-[#174A45] border border-[#DDE5DF] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                  <User className="w-4 h-4 text-[#174A45]" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#174A45] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm p-4 border border-[#DDE5DF] shadow-2xs flex items-center gap-2.5">
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#174A45] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#2E7166] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#6FA99A] animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs text-[#52645D] font-medium">
                Orienta está preparando tu respuesta con el equipo de la SSSalud...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="mt-3 bg-white p-2.5 rounded-2xl border border-[#DDE5DF] shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={reiniciarConversacion}
            className="p-2 text-[#52645D] hover:text-[#174A45] hover:bg-[#F0F7F3] rounded-[9px] transition-colors duration-200 cursor-pointer"
            title="Reiniciar conversación"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribí lo que te pasó con tus propias palabras (ej: 'No me quieren entregar la medicación...')..."
            className="flex-1 text-sm text-[#263D38] placeholder-[#52645D] px-3 py-2 bg-transparent focus:outline-none"
            disabled={isTyping}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`h-10 px-4 rounded-[9px] text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-xs ${
              inputText.trim() && !isTyping
                ? 'bg-[#174A45] hover:bg-[#205B53] text-white cursor-pointer'
                : 'bg-[#F0F7F3] text-[#52645D]/50 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Enviar</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
