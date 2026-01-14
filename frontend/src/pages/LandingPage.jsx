import { SearchBar } from '../components/SearchBar';
import { Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-3xl animate-pulse" />
                <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center space-y-8 max-w-2xl relative z-10"
            >
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full shadow-sm text-sm text-blue-600 mb-4 hover:bg-white hover:shadow-md transition-all cursor-default"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className="font-medium">AI-Powered Research Assistant</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight">
                        What do you want to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient bg-300%">
                            read today?
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-gray-500 max-w-lg mx-auto leading-relaxed"
                    >
                        Discover, read, and chat with millions of research papers.
                        Just type a topic to get started.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                    className="w-full relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                        <SearchBar />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="pt-8 flex justify-center gap-8 text-gray-400"
                >
                    <div className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-300">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-medium">100M+ Papers</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-purple-600 transition-colors duration-300">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-medium">Smart Summaries</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
