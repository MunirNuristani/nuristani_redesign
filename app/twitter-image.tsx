import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mirza Taza Gul Khan Cultural Foundation'
export const size = {
  width: 1200,
  height: 600,
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
            fontSize: 50,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 25,
          }}
        >
          Nuristani Cultural Foundation
        </div>
        <div
          style={{
            fontSize: 28,
            textAlign: 'center',
            opacity: 0.9,
          }}
        >
          Language • Heritage • Culture
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}