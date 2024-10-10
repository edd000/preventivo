import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="text-center">
      <Image src="/logo.jpg" alt="Logo" width={200} height={200} className="mx-auto mb-8" />
      <h1 className="text-4xl font-bold mb-8">Bienvenido al Sistema de Mantenimiento Preventivo</h1>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <Link href="/maquinas" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Máquinas
        </Link>
        <Link href="/actividades" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Actividades
        </Link>
        <Link href="/registros" className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          Registros
        </Link>
        <Link href="/calendario" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Calendario
        </Link>
      </div>
    </div>
  )
}