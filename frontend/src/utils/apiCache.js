// Shared in-memory cache for API requests
const cache = {};

export const apiCache = {
    get(key, ttl = 20000) { // Default 20 seconds Time-To-Live
        const entry = cache[key];
        if (entry && Date.now() - entry.timestamp < ttl) {
            return entry.data;
        }
        return null;
    },
    set(key, data) {
        cache[key] = {
            data,
            timestamp: Date.now()
        };
    },
    clear() {
        Object.keys(cache).forEach(k => delete cache[k]);
    }
};
