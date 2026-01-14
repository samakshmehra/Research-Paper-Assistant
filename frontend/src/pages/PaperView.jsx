import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { ArrowLeft, Maximize2, Minimize2, Share2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PaperView() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const title = searchParams.get('title');
    const sessionIdParam = searchParams.get('session_id');
    const pdfUrl = decodeURIComponent(id);

    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I\'m ready to discuss this paper with you. Ask me anything!' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPaperLoaded, setIsPaperLoaded] = useState(false);

    useEffect(() => {
        const loadPaper = async () => {
            if (!sessionIdParam) return;

            try {
                // Ensure paper is loaded in backend
                await fetch('/api/select-paper', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        session_id: sessionIdParam,
                        pdf_url: pdfUrl
                    })
                });
                setIsPaperLoaded(true);
            } catch (error) {
                console.error('Failed to load paper:', error);
            }
        };

        loadPaper();
    }, [sessionIdParam, pdfUrl]);

    const handleSendMessage = async (content) => {
        const newMessages = [...messages, { role: 'user', content }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            if (!sessionIdParam) throw new Error('No session ID found');

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionIdParam,
                    query: content
                }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error while processing your request.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* Top Bar */}
            <div className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 hover:bg-gray-100/80 rounded-xl text-gray-500 hover:text-gray-900 transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-gray-900 truncate text-lg" title={title || "Research Paper"}>
                            {title || "Research Paper"}
                        </h1>
                        <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">PDF Viewer & Chat</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.open(pdfUrl, '_blank')}
                        className="p-2.5 hover:bg-gray-100/80 rounded-xl text-gray-500 hover:text-gray-900 transition-all duration-200"
                        title="Download PDF"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2.5 hover:bg-gray-100/80 rounded-xl text-gray-500 hover:text-gray-900 transition-all duration-200 hidden md:block"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                    <button
                        className="p-2.5 hover:bg-gray-100/80 rounded-xl text-gray-500 hover:text-gray-900 transition-all duration-200 md:hidden"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex min-h-0 relative">
                {/* PDF Viewer */}
                <motion.div
                    layout
                    className={`flex-1 bg-gray-100/50 transition-all duration-500 ease-in-out relative ${isFullscreen ? 'w-full' : ''}`}
                >
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border-none"
                        title="Paper PDF"
                    />
                </motion.div>

                {/* Chat Panel */}
                <AnimatePresence mode="wait">
                    {!isFullscreen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '550px', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white border-l border-gray-200 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] relative z-10 block"
                        >
                            <div className="h-full">
                                <ChatInterface
                                    messages={messages}
                                    onSendMessage={handleSendMessage}
                                    isLoading={isLoading}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
