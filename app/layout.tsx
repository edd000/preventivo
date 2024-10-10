import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sistema de Mantenimiento Preventivo',
  description: 'Aplicación para gestionar el mantenimiento preventivo de máquinas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}