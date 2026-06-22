import React, { useRef, useEffect, useCallback } from 'react';

const ITEM_HEIGHT = 36;
const VISIBLE_ITEMS = 5;
const PADDING = Math.floor(VISIBLE_ITEMS / 2);

export default function ScrollWheelPicker({ items, value, onChange, label }) {
    const listRef = useRef(null);
    const isAnimating = useRef(false);
    const currentIndex = useRef(Math.max(0, items.indexOf(value)));

    /* ── Scroll the container to a specific index ── */
    const scrollToIndex = useCallback((index, behavior = 'smooth') => {
        if (!listRef.current) return;
        listRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior });
    }, []);

    /* ── Jump to current value on mount ── */
    useEffect(() => {
        const idx = Math.max(0, items.indexOf(value));
        currentIndex.current = idx;
        scrollToIndex(idx, 'instant');
    }, []); // eslint-disable-line

    /* ── Sync if value prop changes externally ── */
    useEffect(() => {
        const idx = Math.max(0, items.indexOf(value));
        if (idx !== currentIndex.current) {
            currentIndex.current = idx;
            scrollToIndex(idx, 'smooth');
        }
    }, [value]); // eslint-disable-line

    /* ── Intercept wheel: move EXACTLY one step per event ── */
    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        const onWheel = (e) => {
            e.preventDefault(); // block native scroll completely
            e.stopPropagation();

            if (isAnimating.current) return; // ignore while smooth-scrolling

            const direction = e.deltaY > 0 ? 1 : -1;
            const next = Math.max(0, Math.min(currentIndex.current + direction, items.length - 1));

            if (next === currentIndex.current) return; // already at edge

            currentIndex.current = next;
            onChange(items[next]);

            isAnimating.current = true;
            scrollToIndex(next, 'smooth');

            // unlock after the smooth scroll settles (~200ms)
            setTimeout(() => { isAnimating.current = false; }, 200);
        };

        // passive:false is required to allow preventDefault()
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [items, onChange, scrollToIndex]);

    /* ── Touch: track finger movement, snap one item at a time ── */
    const touchStartY = useRef(0);
    const touchMoved = useRef(false);

    const onTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
        touchMoved.current = false;
    };

    const onTouchMove = (e) => {
        e.preventDefault();
        const dy = touchStartY.current - e.touches[0].clientY;
        if (Math.abs(dy) < 10 || touchMoved.current) return;
        touchMoved.current = true;

        const direction = dy > 0 ? 1 : -1;
        const next = Math.max(0, Math.min(currentIndex.current + direction, items.length - 1));
        if (next === currentIndex.current) return;

        currentIndex.current = next;
        onChange(items[next]);
        scrollToIndex(next, 'smooth');
        touchStartY.current = e.touches[0].clientY; // reset for next move segment
    };

    /* ── Click an item directly ── */
    const handleItemClick = (index) => {
        if (index === currentIndex.current) return;
        currentIndex.current = index;
        onChange(items[index]);
        scrollToIndex(index, 'smooth');
    };

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {label}
                </span>
            )}

            <div
                className="relative rounded-xl overflow-hidden"
                style={{
                    height: ITEM_HEIGHT * VISIBLE_ITEMS,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: 'inset 0 2px 16px rgba(0,0,0,0.35)',
                }}
            >
                {/* Top fade mask */}
                <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
                    style={{
                        height: ITEM_HEIGHT * PADDING,
                        background: 'linear-gradient(to bottom, rgba(13,17,30,0.97) 0%, rgba(13,17,30,0.2) 80%, transparent 100%)',
                    }} />

                {/* Bottom fade mask */}
                <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
                    style={{
                        height: ITEM_HEIGHT * PADDING,
                        background: 'linear-gradient(to top, rgba(13,17,30,0.97) 0%, rgba(13,17,30,0.2) 80%, transparent 100%)',
                    }} />

                {/* Centre highlight band */}
                <div className="absolute inset-x-0 z-10 pointer-events-none"
                    style={{
                        top: ITEM_HEIGHT * PADDING,
                        height: ITEM_HEIGHT,
                        background: 'rgba(249,115,22,0.09)',
                        borderTop: '1px solid rgba(249,115,22,0.38)',
                        borderBottom: '1px solid rgba(249,115,22,0.38)',
                    }} />

                {/* Left accent */}
                <div className="absolute left-0 z-20 pointer-events-none rounded-r"
                    style={{ top: ITEM_HEIGHT * PADDING, height: ITEM_HEIGHT, width: 3, background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.8)' }} />

                {/* Right accent */}
                <div className="absolute right-0 z-20 pointer-events-none rounded-l"
                    style={{ top: ITEM_HEIGHT * PADDING, height: ITEM_HEIGHT, width: 3, background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.8)' }} />

                {/* Scrollable list — overflow hidden visually, scroll via JS only */}
                <div
                    ref={listRef}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    className="absolute inset-0 overflow-y-scroll"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Top spacer */}
                    <div style={{ height: ITEM_HEIGHT * PADDING }} />

                    {items.map((item, index) => {
                        const dist = Math.abs(index - currentIndex.current);
                        const isActive = index === currentIndex.current;
                        return (
                            <div
                                key={item}
                                onClick={() => handleItemClick(index)}
                                style={{
                                    height: ITEM_HEIGHT,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    opacity: dist === 0 ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.28 : 0.10,
                                    transform: `scale(${dist === 0 ? 1 : dist === 1 ? 0.90 : 0.82})`,
                                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                                    willChange: 'transform, opacity',
                                    color: isActive ? '#f97316' : '#e2e8f0',
                                    fontWeight: isActive ? 700 : 400,
                                    fontSize: isActive ? '14px' : '13px',
                                }}
                            >
                                {item}
                            </div>
                        );
                    })}

                    {/* Bottom spacer */}
                    <div style={{ height: ITEM_HEIGHT * PADDING }} />
                </div>
            </div>
        </div>
    );
}
