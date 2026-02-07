// Request deduplication utility
const pendingRequests = new Map();

export async function deduplicateRequest(key, requestFn) {
    // If request is already pending, return the existing promise
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }

    // Create new request
    const promise = requestFn()
        .finally(() => {
            // Clean up after request completes
            pendingRequests.delete(key);
        });

    // Store the promise
    pendingRequests.set(key, promise);

    return promise;
}

// Clear all pending requests (useful for cleanup)
export function clearPendingRequests() {
    pendingRequests.clear();
}
