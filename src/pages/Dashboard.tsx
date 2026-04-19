import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  LogIn,
  Volume2,
  VolumeX,
  Pause,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';

export default function Dashboard() {
  const { profile, isLoggedIn } = useUser();
  
  // AI助手相关状态
  const [messages, setMessages] = useState<Array<{ 
    role: 'user' | 'assistant'; 
    content: string;
    isStreaming?: boolean;
    audioPlaying?: boolean;
  }>>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [recordingText, setRecordingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const aiModuleRef = useRef<HTMLDivElement>(null);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const firstName = profile.name.split(' ')[0];

  // 滚动到最新消息
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // 使用直接滚动，避免平滑滚动
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 清理超时
  useEffect(() => {
    return () => {
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // 语音合成功能 - 使用更自然的语音
  const speakText = (text: string, messageId: number) => {
    if (isMuted) return;
    
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synthRef.current = synth;
      
      // 停止之前的语音
      if (synth.speaking) {
        synth.cancel();
      }
      
      // 获取可用的语音列表，选择更自然的语音
      const voices = synth.getVoices();
      let selectedVoice = voices.find(voice => 
        voice.lang.includes('zh-CN') && voice.name.includes('Microsoft')
      ) || voices.find(voice => voice.lang.includes('zh-CN')) || voices[0];
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.voice = selectedVoice;
      
      // 开始播放
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageId ? { ...msg, audioPlaying: true } : msg
      ));
      setCurrentAudioId(`${messageId}`);
      
      utterance.onend = () => {
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageId ? { ...msg, audioPlaying: false } : msg
        ));
        setCurrentAudioId(null);
      };
      
      synth.speak(utterance);
    }
  };

  // 暂停/继续语音
  const toggleAudio = (messageId: number) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      
      if (synth.speaking) {
        synth.pause();
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageId ? { ...msg, audioPlaying: false } : msg
        ));
      } else if (synth.paused) {
        synth.resume();
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageId ? { ...msg, audioPlaying: true } : msg
        ));
      }
    }
  };

  // 发送消息到AI（模拟流式响应）
  const sendMessage = async (e: React.MouseEvent | React.KeyboardEvent) => {
    // 阻止默认行为
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputText('');
    setIsLoading(true);

    // 模拟流式响应
    const messageId = messages.length + 1;
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '', 
      isStreaming: true 
    }]);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || 'API调用失败');
      }

      const assistantMessage = data.choices[0].message.content;
      
      // 模拟流式输出
      let currentContent = '';
      const words = assistantMessage.split(' ');
      
      words.forEach((word, index) => {
        if (streamingTimeoutRef.current) {
          clearTimeout(streamingTimeoutRef.current);
        }
        
        streamingTimeoutRef.current = setTimeout(() => {
          currentContent += (index > 0 ? ' ' : '') + word;
          setMessages(prev => prev.map((msg, idx) => 
            idx === messageId ? { 
              ...msg, 
              content: currentContent,
              isStreaming: index < words.length - 1
            } : msg
          ));
          
          if (index === words.length - 1) {
            // 流式结束，开始语音播放
            setTimeout(() => {
              speakText(assistantMessage, messageId);
            }, 500);
          }
        }, index * 100);
      });
      
    } catch (error) {
      console.error('发送消息失败:', error);
      let errorMessage = '哎呀，暂时无法连接助手，请稍后再试~';
      
      // 根据错误类型给出不同的提示
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = '网络好像不太稳定，请检查一下网络后再试试';
        } else if (error.message.includes('limit')) {
          errorMessage = '今天的对话次数用完啦，明天再来和助手聊天吧';
        }
      }
      
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageId ? { 
          ...msg, 
          content: errorMessage,
          isStreaming: false
        } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // 语音识别功能 - 实时转文字
  const startVoiceRecording = (e: React.MouseEvent) => {
    // 阻止默认行为
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别功能');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingText('');
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setInputText(transcript);
          setRecordingText('');
        } else {
          setRecordingText(transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error);
      setIsRecording(false);
      setRecordingText('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (recordingText) {
        setInputText(recordingText);
        setRecordingText('');
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoiceRecording = (e: React.MouseEvent) => {
    // 阻止默认行为
    e.preventDefault();
    e.stopPropagation();

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // 切换静音状态
  const toggleMute = (e: React.MouseEvent) => {
    // 阻止默认行为
    e.preventDefault();
    e.stopPropagation();

    setIsMuted(!isMuted);
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setCurrentAudioId(null);
      setMessages(prev => prev.map(msg => ({
        ...msg,
        audioPlaying: false
      })));
    }
  };

  // 处理输入框点击（访客限制）
  const handleInputClick = (e: React.MouseEvent) => {
    // 阻止默认行为
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  };

  // 处理登录按钮点击
  const handleLoginClick = (e: React.MouseEvent) => {
    // 阻止默认行为
    e.preventDefault();
    e.stopPropagation();

    setShowLoginModal(true);
  };

  // 处理登录弹窗按钮点击
  const handleLoginModalClick = (e: React.MouseEvent) => {
    // 阻止默认行为
    e.preventDefault();
    e.stopPropagation();

    setShowLoginModal(false);
    // 跳转到登录页面
    window.location.href = '/login';
  };

  // 处理取消按钮点击
  const handleCancelClick = (e: React.MouseEvent) => {
    // 阻止默认行为
    e.preventDefault();
    e.stopPropagation();

    setShowLoginModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16" style={{ overflow: 'hidden' }}>
      {/* AI助手模块 - 固定定位 */}
      <motion.div
        ref={aiModuleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm w-full"
        style={{
          height: '600px',
          overflow: 'hidden'
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-black font-headline">AI助手</h2>
          </div>
          {isLoggedIn && (
            <button
              onClick={toggleMute}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isMuted ? 'bg-gray-100 text-gray-600' : 'bg-primary/10 text-primary'}`}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
        </div>

        {!isLoggedIn ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">注册后解锁AI助手功能</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              AI助手可以回答你的所有问题，支持中英文对话，帮助你学习和备考。
            </p>
            <button
              onClick={handleLoginClick}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <LogIn className="w-5 h-5" /> 立即注册/登录
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100%-120px)]">
            {/* 对话历史区 - 内部滚动 */}
            <div className="flex-1 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-2xl space-y-4" style={{ scrollBehavior: 'auto' }}>
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>你好！我是你的AI助手，有什么可以帮你的吗？</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} relative`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${message.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.role === 'assistant' && message.content && !message.isStreaming && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleAudio(index);
                          }}
                          className="mt-2 text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
                        >
                          {message.audioPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          {message.audioPlaying ? '暂停' : '播放'}
                        </button>
                      )}
                    </div>
                    {message.isStreaming && (
                      <div className="absolute -bottom-1 -right-1 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full animate-pulse">
                        正在输入中...
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 - 固定在底部 */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
                  onClick={handleInputClick}
                  placeholder={isRecording ? '正在录音...' : '输入你的问题...'}
                  className="w-full p-4 pl-12 pr-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  disabled={isLoading}
                />
                {isRecording && recordingText && (
                  <div className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {recordingText}
                  </div>
                )}
                <button
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={(e) => sendMessage(e)}
                disabled={!inputText.trim() || isLoading}
                className={`px-6 py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 ${!inputText.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Send className="w-5 h-5" />
                发送
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* 登录引导弹窗 */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleCancelClick}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-10 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black">解锁AI助手</h3>
                <p className="text-gray-600">
                  注册或登录后，即可使用AI助手进行对话、学习和备考。
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleLoginModalClick}
                    className="flex-1 py-3 bg-primary text-white rounded-2xl font-black hover:bg-primary/90 transition-all"
                  >
                    立即登录
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-2xl font-black hover:bg-gray-50 transition-all"
                  >
                    取消
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
