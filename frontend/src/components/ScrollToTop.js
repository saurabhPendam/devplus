/*
  ScrollToTop.js — Day 7.

  A small button that appears after the user scrolls 400px down.
  Clicking it smoothly scrolls back to the top.

  Why this matters:
  The profile page is very long — heatmap, charts, repos, topics.
  On mobile especially, getting back to the top is annoying.
  This is the kind of small polish detail that shows care.

  Implementation: IntersectionObserver on a sentinel div at the top
  is the modern approach, but simpler is better here — we just
  check window.scrollY on a scroll event.
*/

import React, { useState, useEffect } from 'react';
import './ScrollToTop.css';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <button
      className="scroll-top-btn"
      onClick={scrollUp}
      aria-label="Scroll to top"
      title="Back to top"
    >
      up
    </button>
  );
}
