import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Hook to add scroll reveal animations to elements
 * @param {Object} options - Animation options
 * @returns {React.RefObject} - Ref to attach to the container element
 */
export const useScrollReveal = (options = {}) => {
    const containerRef = useRef(null)

    const defaultOptions = {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        start: 'top 85%',
        ...options
    }

    useEffect(() => {
        if (!containerRef.current) return

        const ctx = gsap.context(() => {
            // Animate direct children with data-reveal attribute or all children
            const elements = containerRef.current.querySelectorAll('[data-reveal]')
            const targets = elements.length > 0 ? elements : containerRef.current.children

            gsap.fromTo(
                targets,
                {
                    y: defaultOptions.y,
                    opacity: defaultOptions.opacity
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: defaultOptions.duration,
                    stagger: defaultOptions.stagger,
                    ease: defaultOptions.ease,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: defaultOptions.start,
                        toggleActions: 'play none none none'
                    }
                }
            )
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return containerRef
}

/**
 * Hook for parallax scroll effect
 */
export const useParallax = (speed = 0.5) => {
    const elementRef = useRef(null)

    useEffect(() => {
        if (!elementRef.current) return

        const ctx = gsap.context(() => {
            gsap.to(elementRef.current, {
                yPercent: -30 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: elementRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            })
        }, elementRef)

        return () => ctx.revert()
    }, [speed])

    return elementRef
}

/**
 * Hook for fade-in on scroll
 */
export const useFadeIn = (delay = 0) => {
    const elementRef = useRef(null)

    useEffect(() => {
        if (!elementRef.current) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                elementRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elementRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            )
        }, elementRef)

        return () => ctx.revert()
    }, [delay])

    return elementRef
}

export default useScrollReveal
