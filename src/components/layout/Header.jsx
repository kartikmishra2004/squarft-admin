import { ArrowRight } from 'lucide-react';

const Header = ({ title, showBack = false, onBack, rightContent = null }) => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-20 sticky top-0">
            <div className="flex items-center gap-4">
                {showBack && (
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors border border-gray-200 bg-white shadow-sm">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                )}
                <h1 className="text-2xl font-black text-gray-800 capitalize tracking-tight">
                    {title}
                </h1>
            </div>

            {rightContent && (
                <div className="flex items-center gap-6">
                    {rightContent}
                </div>
            )}
        </header>
    );
};

export default Header;
