/* eslint-disable no-constant-condition */
import path from '@/constants/path'
import * as Popover from "@radix-ui/react-popover";
import { Link } from 'react-router-dom'

export default function NavHeader() {
  return (
    <div className='inset-shadow-[0_0_1rem_0] inset-shadow-gray-200'>
      <div className='text-normal container mx-auto flex cursor-pointer items-center justify-center gap-3.5 py-1.5 sm:justify-end'>
        {/* hỗ trợ */}
        <div className='flex cursor-pointer items-center'>
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
              d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z'
            />
          </svg>

          <span className='mx-1'>Hỗ trợ</span>
        </div>

        {/* ngôn ngữ */}
        <Popover.Root>
          <Popover.Trigger>
            <div className='flex cursor-pointer items-center'>
              <div>
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
                    d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
                  />
                </svg>
              </div>
              <span className='mx-1'>Tieng Viet</span>
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1}
                  stroke='currentColor'
                  className='size-5'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                </svg>
              </div>
            </div>
          </Popover.Trigger>
          <Popover.Content className="popoverContent origin-top" align='center' sideOffset={5}>
            <div className='text-normal relative flex flex-col bg-white shadow-md'>
              <button className='px-6 py-2 opacity-80 hover:bg-gray-50 hover:text-teal-500'>Tieng Viet</button>
              <button className='px-6 py-2 opacity-80 hover:bg-gray-50 hover:text-teal-500'>Tieng Anh</button>
            </div>
            <Popover.Arrow className="fill-black" width={21} height={10} />
          </Popover.Content>
        </Popover.Root>

        {/* tài khoản */}
        {true ? (
          <Popover.Root>
            <Popover.Trigger>
              {' '}
              <div className='flex cursor-pointer'>
                <div>
                  {true ? (
                    <img src='{profile?.avatar} ' className='size-5' alt='' />
                  ) : (
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
                        d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                      />
                    </svg>
                  )}
                </div>
                <span className='mx-1'>{'profile?.name'}</span>
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1}
                    stroke='currentColor'
                    className='size-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                  </svg>
                </div>
              </div>
            </Popover.Trigger>
            <Popover.Content>
              <div className='text-normal relative flex flex-col bg-white shadow-md'>
                <Link
                  to={path.profile}
                  className='cursor-pointer px-6 py-2 opacity-80 hover:bg-gray-50 hover:text-teal-500'
                >
                  Tài khoản
                </Link>
                <Link
                  to={path.historyPurchase}
                  className='cursor-pointer px-6 py-2 opacity-80 hover:bg-gray-50 hover:text-teal-500'
                >
                  Đơn mua
                </Link>
                <button className='cursor-pointer px-6 py-2 opacity-80 hover:bg-gray-50 hover:text-teal-500'>
                  Đăng xuất
                </button>
              </div>
            </Popover.Content>
          </Popover.Root>
        ) : (
          <>
            <Link to={path.register} className='flex-shrink-0 cursor-pointer'>
              Đăng ký
            </Link>
            <span className='h-3.5 border-r border-gray-400'></span>
            <Link to={path.login} className='cursor-pointer'>
              Đăng nhập
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
