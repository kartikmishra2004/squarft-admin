import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertTriangle, HelpCircle, Info, X } from 'lucide-react';

const DialogContext = createContext(null);

const ICONS = {
    info: { Icon: Info, wrap: 'bg-blue-50 text-blue-600' },
    warning: { Icon: AlertTriangle, wrap: 'bg-amber-50 text-amber-600' },
    danger: { Icon: AlertTriangle, wrap: 'bg-rose-50 text-rose-600' },
    question: { Icon: HelpCircle, wrap: 'bg-[#6F4BFF]/10 text-[#6F4BFF]' },
};

/**
 * App-wide replacement for window.alert / window.confirm / window.prompt.
 * Mount <DialogProvider> once near the app root, then use the useDialog()
 * hook anywhere to show a styled, promise-based dialog instead of a native
 * browser popup.
 */
export const DialogProvider = ({ children }) => {
    const [dialogState, setDialogState] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const resolverRef = useRef(null);
    const inputRef = useRef(null);

    const openDialog = useCallback((config) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;
            setInputValue(config.defaultValue ?? '');
            setSubmitting(false);
            setDialogState(config);
        });
    }, []);

    const settle = useCallback((result) => {
        const resolve = resolverRef.current;
        resolverRef.current = null;
        setDialogState(null);
        if (resolve) resolve(result);
    }, []);

    // alert(message, { title, confirmText, variant })
    const alert = useCallback((message, options = {}) => (
        openDialog({
            type: 'alert',
            title: options.title ?? 'Notice',
            message,
            confirmText: options.confirmText ?? 'OK',
            variant: options.variant ?? 'info',
        })
    ), [openDialog]);

    // confirm(message, { title, confirmText, cancelText, danger }) -> Promise<boolean>
    const confirm = useCallback((message, options = {}) => (
        openDialog({
            type: 'confirm',
            title: options.title ?? 'Please Confirm',
            message,
            confirmText: options.confirmText ?? 'Confirm',
            cancelText: options.cancelText ?? 'Cancel',
            variant: options.danger ? 'danger' : (options.variant ?? 'question'),
            danger: !!options.danger,
        })
    ), [openDialog]);

    // prompt(message, defaultValueOrOptions) -> Promise<string|null>
    const prompt = useCallback((message, defaultValueOrOptions = {}) => {
        const options = typeof defaultValueOrOptions === 'string'
            ? { defaultValue: defaultValueOrOptions }
            : (defaultValueOrOptions || {});
        return openDialog({
            type: 'prompt',
            title: options.title ?? 'Input Required',
            message,
            defaultValue: options.defaultValue ?? '',
            placeholder: options.placeholder ?? '',
            confirmText: options.confirmText ?? 'Submit',
            cancelText: options.cancelText ?? 'Cancel',
            multiline: !!options.multiline,
            variant: options.variant ?? 'question',
        });
    }, [openDialog]);

    useEffect(() => {
        if (dialogState?.type === 'prompt' && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select?.();
        }
    }, [dialogState]);

    if (!dialogState) {
        return (
            <DialogContext.Provider value={{ alert, confirm, prompt }}>
                {children}
            </DialogContext.Provider>
        );
    }

    const { type, title, message, confirmText, cancelText, variant, placeholder, multiline } = dialogState;
    const { Icon, wrap } = ICONS[variant] || ICONS.info;

    const handleConfirm = () => {
        if (type === 'prompt') {
            settle(inputValue);
        } else {
            settle(true);
        }
    };

    const handleCancel = () => {
        if (type === 'prompt') {
            settle(null);
        } else if (type === 'alert') {
            settle(true);
        } else {
            settle(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        } else if (e.key === 'Enter' && type !== 'prompt') {
            e.preventDefault();
            handleConfirm();
        } else if (e.key === 'Enter' && type === 'prompt' && !multiline && !e.shiftKey) {
            e.preventDefault();
            handleConfirm();
        }
    };

    const confirmBtnClass = variant === 'danger'
        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 focus:ring-rose-500'
        : 'bg-[#6F4BFF] hover:bg-[#5936eb] text-white shadow-md shadow-[#6F4BFF]/20 focus:ring-[#6F4BFF]';

    return (
        <DialogContext.Provider value={{ alert, confirm, prompt }}>
            {children}
            <div
                className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                onMouseDown={(e) => { if (e.target === e.currentTarget) handleCancel(); }}
                onKeyDown={handleKeyDown}
                role="presentation"
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 border border-gray-100 flex flex-col"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="dialog-title"
                >
                    <div className="flex justify-between items-start gap-3 p-6 pb-4">
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${wrap}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 id="dialog-title" className="font-black text-lg text-gray-900 tracking-tight leading-tight">{title}</h3>
                                {message && (
                                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{message}</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {type === 'prompt' && (
                        <div className="px-6 pb-2">
                            {multiline ? (
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={placeholder}
                                    rows={3}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F4BFF] focus:border-transparent resize-none"
                                />
                            ) : (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6F4BFF] focus:border-transparent"
                                />
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 p-6 pt-4">
                        {type !== 'alert' && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={submitting}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={submitting}
                            className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmBtnClass}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </DialogContext.Provider>
    );
};

/**
 * useDialog() -> { alert, confirm, prompt }
 *  - alert(message, options?)   -> Promise<true>
 *  - confirm(message, options?) -> Promise<boolean>
 *  - prompt(message, defaultValueOrOptions?) -> Promise<string|null>
 */
export const useDialog = () => {
    const ctx = useContext(DialogContext);
    if (!ctx) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return ctx;
};

export default DialogProvider;
