/*
  Toast.js — Day 7.

  A lightweight toast notification system.
  Used for:
  - "Link copied to clipboard"
  - "Summary downloaded"
  - "Profile refreshed"

  Usage:
    import { useToast, ToastContainer } from './Toast';
    const { showToast } = useToast();
    showToast('Link copied!', 'success');

  Implementation:
  - React context so any component can trigger a toast
  - Stacks multiple toasts vertically
  - Auto-dismisses after 3 seconds
  - 3 types: success (green), info (blue), error (red)
*/

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts]  = useState([]);
  const counterRef           = useRef(0);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            onClick={() => dismiss(toast.id)}
            role="alert"
          >
            <span className="toast-dot" />
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => dismiss(toast.id)}>x</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
