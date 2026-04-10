exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { title, body } = JSON.parse(event.body || '{}')

  if (!title || !body) {
    return { statusCode: 400, body: 'Missing title or body' }
  }

  const response = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: '35189144-5872-41d0-91bb-f3e8197ffb7d',
      included_segments: ['All'],
      headings: { en: title, fr: title },
      contents: { en: body, fr: body },
    }),
  })

  const data = await response.json()

  return {
    statusCode: response.ok ? 200 : 502,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}
