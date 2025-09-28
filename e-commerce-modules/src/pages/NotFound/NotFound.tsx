import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className='flex h-screen w-full flex-col items-center justify-center'>
      <h1 className='text-9xl font-extrabold tracking-widest text-gray-900'>404</h1>
      <div className='bg-red-52c52 absolute rotate-12 rounded px-2 text-sm text-white'>Page Not Found</div>
      <button className='mt-5'>
        <Link
          to='/'
          className='group active:text-red-52c52 relative inline-block text-sm font-medium text-white focus:ring focus:outline-none'
        >
          <span className='absolute inset-0 translate-x-0.5 translate-y-0.5 bg-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-80' />
          <span className='relative block border border-current px-8 py-3'>
            <span>Go Home</span>
          </span>
        </Link>
      </button>
    </main>
  )
}
