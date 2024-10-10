import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Sistema de Mantenimiento
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/registros" className="hover:text-gray-300">
              Registros
            </Link>
          </li>
          <li>
            <Link href="/calendario" className="hover:text-gray-300">
              Calendario
            </Link>
          </li>
          <li>
            <Link href="/alertas" className="hover:text-gray-300">
              Alertas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar