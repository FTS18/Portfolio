if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker is registered with scope: ', registration.scope);
            })
            .catch(err => {
                console.error('Registration failed: ', err);
            });
    });
};
