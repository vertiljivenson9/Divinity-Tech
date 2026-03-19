import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DIVINITY SKY TOOLS',
  description: 'Tu catálogo digital de productos tecnológicos',
}

export default function Page() {
  return (
    <html lang="es">
      <head>
        <title>DIVINITY SKY TOOLS</title>
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1 style={{ color: '#2563EB', fontSize: '2.5rem', marginBottom: '10px' }}>
            DIVINITY <span style={{ color: '#FF6B35' }}>SKY TOOLS</span>
          </h1>
          <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '30px' }}>
            Tu catálogo digital de productos tecnológicos
          </p>
          <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>🚀 Proyecto Listo</h2>
            <p>El proyecto ha sido configurado correctamente.</p>
            <p><strong>Repositorio:</strong> <a href="https://github.com/vertiljivenson9/Divinity-Tech" style={{ color: '#2563EB' }}>GitHub</a></p>
            <h3 style={{ marginTop: '20px' }}>Credenciales:</h3>
            <p><strong>Admin:</strong> admin@divinityskytools.com / admin123</p>
            <p><strong>Usuario:</strong> user@divinityskytools.com / user123</p>
          </div>
        </div>
      </body>
    </html>
  )
}
