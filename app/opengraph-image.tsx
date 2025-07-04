import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mirza Taza Gul Khan Cultural Foundation'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #92400e, #d97706)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          Mirza Taza Gul Khan
        </div>
        <div
          style={{
            fontSize: 40,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Cultural Foundation
        </div>
        <div
          style={{
            fontSize: 24,
            textAlign: 'center',
            opacity: 0.9,
          }}
        >
          Preserving Nuristani Heritage & Language
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}