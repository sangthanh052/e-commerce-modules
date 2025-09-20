import { Link } from 'react-router-dom'

import NavHeader from '../NavHeader'

export default function Header() {
  return (
    <header className='bg-background/40 sticky z-9 top-0 w-full border-b-2 border-b-gray-100 backdrop-blur-lg'>
      <NavHeader />
      <div className='container m-auto px-3.5 py-2.5 text-sm lg:px-0'>
        <nav className='grid grid-cols-[1fr_4fr_1fr] items-center'>
          <div className=''>
            <Link to='/'>
              <img src='' className='w-24 lg:w-40' />
            </Link>
          </div>

          <div className='flex justify-center'>
            <form className='flex w-full max-w-4/5 items-center justify-between border border-gray-300 bg-gray-50 py-2 ps-4 pe-2 transition-all duration-300 ease-in-out focus-within:border-gray-400 focus-within:shadow-[0_2px_4px_4px] focus-within:shadow-black/6'>
              <input className='w-full flex-1 outline-none' type='text' placeholder='Tên sản phẩm, thương hiệu, ...' />

              <button type='submit'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1}
                  stroke='currentColor'
                  className='size-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                  />
                </svg>
              </button>
            </form>
          </div>
        </nav>
      </div>
    </header>
  )
}
