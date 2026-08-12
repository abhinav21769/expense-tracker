import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

const PULL_THRESHOLD = 70; // minimum pixels to pull to trigger refresh

export default function PullToRefresh({ onRefresh, children }) {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    // Only enable pull-to-refresh when scrolled to top
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === 0 || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0 && window.scrollY === 0) {
      // Damped pull distance for realistic spring feel
      const distance = Math.min(diff * 0.45, 110);
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(50); // Keep indicator visible while refreshing

      Promise.resolve(onRefresh()).finally(() => {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setStartY(0);
        }, 600);
      });
    } else {
      setPullDistance(0);
      setStartY(0);
    }
  };

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen"
    >
      {/* Pull To Refresh Indicator Badge */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-150 flex items-center justify-center"
          style={{
            top: `${Math.max(12, pullDistance * 0.7)}px`,
            opacity: Math.min(pullDistance / 20, 1)
          }}
        >
          <div className="glass-card px-3.5 py-2 rounded-full border border-indigo-500/40 shadow-2xl flex items-center gap-2 text-xs font-semibold text-indigo-300 light-mode:text-indigo-700">
            <RefreshCw
              className={`w-4 h-4 text-indigo-400 transition-transform ${
                isRefreshing ? 'animate-spin text-emerald-400' : ''
              }`}
              style={{
                transform: isRefreshing ? undefined : `rotate(${progress * 360}deg)`
              }}
            />
            <span>
              {isRefreshing
                ? 'Refreshing...'
                : pullDistance >= PULL_THRESHOLD
                ? 'Release to refresh'
                : 'Pull down to refresh'}
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area shifted downwards slightly while pulling */}
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance * 0.25}px)` : 'none',
          transition: pullDistance === 0 ? 'transform 0.25s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
}
