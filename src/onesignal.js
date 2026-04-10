import OneSignal from 'react-onesignal'

// Init OneSignal une seule fois — exporté pour pouvoir l'awaiter ailleurs
export const initPromise = OneSignal.init({
  appId: '35189144-5872-41d0-91bb-f3e8197ffb7d',
  notifyButton: { enable: false },
  allowLocalhostAsSecureOrigin: true,
})
