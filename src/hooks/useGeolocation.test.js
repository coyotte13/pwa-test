import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGeolocation } from './useGeolocation'

const mockWatch = vi.fn()
const mockClear = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  Object.defineProperty(global.navigator, 'geolocation', {
    value: { watchPosition: mockWatch, clearWatch: mockClear },
    configurable: true,
  })
})

describe('useGeolocation', () => {
  it('démarre avec loading: true et position: null', () => {
    mockWatch.mockReturnValue(1)
    const { result } = renderHook(() => useGeolocation())
    expect(result.current.loading).toBe(true)
    expect(result.current.position).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('met à jour la position après succès GPS', () => {
    const mockPos = { coords: { latitude: 48.87, longitude: 2.29, accuracy: 5 } }
    mockWatch.mockImplementation((success) => { success(mockPos); return 1 })
    const { result } = renderHook(() => useGeolocation())
    expect(result.current.position).toEqual({ lat: 48.87, lng: 2.29, accuracy: 5 })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('capture une erreur si permission refusée', () => {
    const mockError = { code: 1, message: 'User denied Geolocation' }
    mockWatch.mockImplementation((_, error) => { error(mockError); return 1 })
    const { result } = renderHook(() => useGeolocation())
    expect(result.current.error).toBe('Permission de localisation refusée.')
    expect(result.current.loading).toBe(false)
  })

  it('appelle clearWatch au unmount', () => {
    mockWatch.mockReturnValue(42)
    const { unmount } = renderHook(() => useGeolocation())
    unmount()
    expect(mockClear).toHaveBeenCalledWith(42)
  })
})
