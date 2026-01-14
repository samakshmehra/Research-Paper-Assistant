import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function PaperCard({ paper, onClick }) {
    return (
        <motion.div
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100/50 hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden"
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex justify-between items-start gap-4">
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {paper.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
                            <Calendar className="w-3.5 h-3.5" />
                            {paper.published}
                        </span>
                        <a
                            href={paper.pdf_url}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors z-10"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Source PDF
                        </a>
                    </div>
                </div>
                <div className="min-w-fit p-3 bg-blue-50/50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FileText className="w-6 h-6" />
                </div>
            </div>

            <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-3 relative">
                {paper.summary}
            </p>

            <div className="mt-5 pt-4 border-t border-gray-50 flex justify-end relative">
                <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                    Read & Chat
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <span className="text-lg leading-none mb-0.5">→</span>
                    </div>
                </span>
            </div>
        </motion.div>
    );
}
