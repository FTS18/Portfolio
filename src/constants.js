// Application Constants
// Centralized place for magic strings and configuration values

// Base URLs
export const SITE_URL = 'https://ananay.netlify.app'
export const GITHUB_USERNAME = 'FTS18'

// Asset Paths
export const ASSETS = {
    images: '/assets/images',
    thumbs: '/assets/images/thumbs',
    screenshots: '/assets/images/screenshots',
    fonts: '/fonts',
    favicon: '/assets/images/favicon',
}

// Theme Names
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    BW: 'bw',
}

// Social Links
export const SOCIAL_LINKS = {
    github: `https://github.com/${GITHUB_USERNAME}`,
    linkedin: 'https://linkedin.com/in/ananaydubey',
    twitter: 'https://twitter.com/ananaydubey',
    email: 'mailto:ananay.dubey@example.com',
}

// API Endpoints
export const API = {
    ghChart: 'https://ghchart.rshah.org',
    guestbook: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
}

// Animation Durations (ms)
export const ANIMATION = {
    fast: 150,
    normal: 300,
    slow: 500,
    pageTransition: 600,
}

// Breakpoints (px) - match CSS
export const BREAKPOINTS = {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1200,
}

// Cache Keys
export const CACHE_KEYS = {
    theme: 'theme',
    guestbook: 'guestbook_messages',
    visitCount: 'visit_count',
}
