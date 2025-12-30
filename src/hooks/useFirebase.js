import { useState, useEffect } from 'react'
import { database } from '../utils/firebase'
import { ref, set, onValue, get } from 'firebase/database'

export function usePageViews() {
    const [views, setViews] = useState('Loading...')

    useEffect(() => {
        // Delay tracking to prioritize critical rendering
        const timer = setTimeout(() => {
            // Get visitor IP and track page view
            fetch('https://api.ipify.org?format=json')
                .then(res => res.json())
                .then(data => {
                    const ip = data.ip.replace(/\./g, '-')
                    const dbRef = ref(database, `page_views/${ip}`)
                    set(dbRef, { ip: data.ip })
                })
                .catch(err => console.error('Error tracking view:', err))

            // Listen to total views
            const viewsRef = ref(database, 'page_views')
            onValue(viewsRef, (snapshot) => {
                const count = snapshot.size || 0
                setViews(count)
            })
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return views
}

export function useProjectViews(projectId) {
    const [views, setViews] = useState(0)

    useEffect(() => {
        if (!projectId) return

        const dbRef = ref(database, `project_clicks/${projectId}`)

        // Get initial views
        get(dbRef).then((snapshot) => {
            setViews(snapshot.val() || 0)
        })

        // Listen for updates
        onValue(dbRef, (snapshot) => {
            setViews(snapshot.val() || 0)
        })
    }, [projectId])

    const incrementViews = () => {
        const dbRef = ref(database, `project_clicks/${projectId}`)
        const newViews = views + 1
        set(dbRef, newViews)
        setViews(newViews)
    }

    return [views, incrementViews]
}

export function useAllProjectViews() {
    const [viewsMap, setViewsMap] = useState({})

    useEffect(() => {
        const dbRef = ref(database, 'project_clicks')

        onValue(dbRef, (snapshot) => {
            const data = snapshot.val() || {}
            setViewsMap(data)
        })
    }, [])

    return viewsMap
}
