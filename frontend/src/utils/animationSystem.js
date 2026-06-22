// Global animation easing and durations
export const EASING = [0.25, 0.4, 0.25, 1]; // Premium cubic-bezier

export const DURATIONS = {
    page: 0.3,
    card: 0.25,
    modal: 0.2,
    dropdown: 0.15,
    hover: 0.15
};

export const TRANSITIONS = {
    page: { duration: DURATIONS.page, ease: EASING },
    card: { duration: DURATIONS.card, ease: EASING },
    modal: { duration: DURATIONS.modal, ease: EASING },
    dropdown: { duration: DURATIONS.dropdown, ease: EASING },
    hover: { duration: DURATIONS.hover, ease: 'easeOut' }
};

export const GPU_ACCELERATION = {
    willChange: 'transform, opacity',
    transform: 'translate3d(0,0,0)'
};
