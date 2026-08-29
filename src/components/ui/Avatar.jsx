import { useState } from 'react';

// Renders the user's avatar_url when present and loadable; falls back to the
// first letter of their name (existing behavior) if the URL is missing, or
// the image itself fails to load (broken link, 404, non-image content, etc).
// Shows a pulsing skeleton in the gap between "we have a URL" and "the image
// actually finished loading" instead of a blank/broken box.
const Avatar = ({ src, name, className = '' }) => {
    const [status, setStatus] = useState(src ? 'loading' : 'empty');
    const [trackedSrc, setTrackedSrc] = useState(src);
    const initial = (name || '?').charAt(0).toUpperCase();

    // Re-arm loading/error state if the URL itself changes (e.g. profile
    // photo updated mid-session) instead of getting stuck on a stale status.
    // Adjusted during render (React's documented pattern for resetting state
    // in response to a prop change) rather than in an effect, so there's no
    // extra render pass before the skeleton shows up.
    if (src !== trackedSrc) {
        setTrackedSrc(src);
        setStatus(src ? 'loading' : 'empty');
    }

    if (src && status !== 'error') {
        return (
            <div className={`relative overflow-hidden shrink-0 ${className}`}>
                {status === 'loading' && (
                    <div className="absolute inset-0 animate-pulse bg-gray-300 rounded-[inherit]" />
                )}
                <img
                    src={src}
                    alt={name || 'User avatar'}
                    onLoad={() => setStatus('loaded')}
                    onError={() => setStatus('error')}
                    className={`w-full h-full object-cover rounded-[inherit] transition-opacity duration-200 ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}
                />
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center shrink-0 ${className}`}>
            {initial}
        </div>
    );
};

export default Avatar;
