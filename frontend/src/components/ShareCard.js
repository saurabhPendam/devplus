/*
  ShareCard.js — Day 8 final.

  Three actions:
  1. Copy link     — copies ?u=username URL to clipboard
  2. Export PDF    — triggers browser print dialog with clean layout
  3. View on GitHub — external link

  PDF export uses window.print() via exportPDF() from utils/export.js.
  No libraries — the browser renders the real component tree as a PDF.
  The @media print rules in index.css control exactly what appears.
*/

import React, { useState } from 'react';
import { exportPDF } from '../utils/export';
import './ShareCard.css';

export default function ShareCard({ profile, score, languages, summary, onCopied, onDownloaded }) {
  const [copied,      setCopied]      = useState(false);
  const [exporting,   setExporting]   = useState(false);

  const shareUrl = `${window.location.origin}?u=${profile.login}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopied) onCopied();
    }).catch(() => {});
  };

  const handleExportPDF = () => {
    setExporting(true);
    exportPDF(profile.login);
    // Re-enable button after a moment — print dialog takes over
    setTimeout(() => setExporting(false), 1500);
    if (onDownloaded) onDownloaded();
  };

  return (
    <div className="share-card card fade-in">
      <div className="share-card-header">
        <div>
          <h2 className="share-title">Share profile</h2>
          <p className="share-sub">Copy link or export for job applications</p>
        </div>
      </div>

      {/* URL copy row */}
      <div className="share-url-row">
        <span className="share-url">{shareUrl}</span>
        <button className="share-copy-btn" onClick={handleCopyLink}>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      {/* Action buttons */}
      <div className="share-actions">
        <button
          className="share-action-btn"
          onClick={handleExportPDF}
          disabled={exporting}
          title="Opens browser print dialog — save as PDF"
        >
          {exporting ? 'Opening...' : 'Export PDF'}
        </button>
        <a
          className="share-action-btn share-action-btn--outline"
          href={profile.htmlUrl}
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </a>
      </div>

      {/* PDF hint */}
      <p className="share-pdf-hint">
        In the print dialog, choose "Save as PDF" and set margins to "Minimum"
      </p>
    </div>
  );
}
