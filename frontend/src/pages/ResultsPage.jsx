import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaperCard } from '../components/PaperCard';
import { Loader2, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export function ResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const navigate = useNavigate();

    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [intent, setIntent] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [loadingStep, setLoadingStep] = useState(0);

    const loadingSteps = [
        { icon: '🔍', text: 'Connecting to arXiv...', color: 'from-blue-500 to-cyan-500' },
        { icon: '🤖', text: 'Analyzing research papers...', color: 'from-purple-500 to-pink-500' },
        { icon: '⚡', text: 'Ranking by relevance...', color: 'from-orange-500 to-red-500' },
        { icon: '✨', text: 'Preparing results...', color: 'from-green-500 to-emerald-500' }
    ];

    useEffect(() => {
        let stepInterval;
        if (loading) {
            setLoadingStep(0);
            stepInterval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % loadingSteps.length);
            }, 1200);
        }
        return () => clearInterval(stepInterval);
    }, [loading]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchPapers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/search-papers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic: query }),
                    signal
                });

                if (!response.ok) throw new Error('Failed to fetch papers');

                const data = await response.json();
                const mappedPapers = data.papers.map(p => ({
                    ...p,
                    id: p.pdf_url
                }));

                setPapers(mappedPapers);
                setIntent(data.expanded_intent);
                setSessionId(data.session_id);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err.message);
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        if (query) {
            fetchPapers();
        }

        return () => {
            controller.abort();
        };
    }, [query]);

    const handlePaperClick = async (paper) => {
        navigate(`/paper/${encodeURIComponent(paper.pdf_url)}?title=${encodeURIComponent(paper.title)}&session_id=${sessionId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header - Only show when not loading */}
            {!loading && (
                <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-900"
                            title="Back to home"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        {/* Animated Icon Container */}
                        <motion.div
                            className="relative mb-12"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Outer glow ring */}
                            <div className="absolute inset-0 scale-150">
                                <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${loadingSteps[loadingStep].color} opacity-20 blur-2xl animate-pulse`}></div>
                            </div>

                            {/* Main icon container */}
                            <motion.div
                                key={loadingStep}
                                initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.6, type: "spring" }}
                                className={`relative w-32 h-32 rounded-3xl bg-gradient-to-br ${loadingSteps[loadingStep].color} shadow-2xl flex items-center justify-center`}
                            >
                                <span className="text-5xl filter drop-shadow-lg">
                                    {loadingSteps[loadingStep].icon}
                                </span>
                            </motion.div>

                            {/* Orbiting dots */}
                            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                                <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2 shadow-lg"></div>
                            </div>
                            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                                <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full -translate-x-1/2 shadow-lg"></div>
                            </div>
                        </motion.div>

                        {/* Loading text */}
                        <div className="text-center space-y-4">
                            <motion.p
                                key={loadingStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="text-xl font-semibold text-gray-800"
                            >
                                {loadingSteps[loadingStep].text}
                            </motion.p>

                            <p className="text-sm text-gray-500 font-medium">
                                Searching for <span className="text-blue-600 font-semibold">"{query}"</span>
                            </p>

                            {/* Progress dots */}
                            <div className="flex gap-2 justify-center pt-4">
                                {loadingSteps.map((_, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === loadingStep
                                            ? 'w-8 bg-gradient-to-r ' + loadingSteps[loadingStep].color
                                            : 'w-1.5 bg-gray-300'
                                            }`}
                                        animate={{
                                            scale: idx === loadingStep ? 1.1 : 1
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="max-w-lg mx-auto mt-20 p-8 bg-white rounded-3xl border border-red-100 shadow-xl text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-end justify-between border-b border-gray-200 pb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Research Results</h1>
                                <p className="text-gray-500 mt-1 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Found {papers.length} relevant papers for your search
                                </p>
                            </div>
                        </div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {papers.map((paper) => (
                                <PaperCard
                                    key={paper.id}
                                    paper={paper}
                                    onClick={() => handlePaperClick(paper)}
                                />
                            ))}
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
}
