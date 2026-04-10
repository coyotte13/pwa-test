import { useState, useEffect } from 'react'

const ERROR_MESSAGES = {
  1: 'Permission de localisation refusée.',
  2: 'Position non disponible.',
  3: 'Délai de géolocalisation dépassé.',
}

export function useGeolocation() {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée par ce navigateur.')
      setLoading(false)
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setError(null)
        setLoading(false)
      },
      (err) => {
        setError(ERROR_MESSAGES[err.code] || 'Erreur de géolocalisation.')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return { position, error, loading }
}
