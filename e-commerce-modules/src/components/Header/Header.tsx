import { createSearchParams, Link, useNavigate } from 'react-router-dom'

// import * as HoverCard from '@radix-ui/react-hover-card'
import * as Popover from '@radix-ui/react-popover'

import purchaseApi from '@/apis/purchase.api'
import path from '@/constants/path'
import { purchaseStatus } from '@/constants/purchase'
import { AppContext } from '@/contexts/app.context'
import useQueryConfig from '@/hooks/useQueryConfig'
import { formatCurrency } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import { useContext, useRef, useState } from 'react'
import NavHeader from '../NavHeader'

const MAX_PURCHASES = 5

export default function Header() {
  const { isAuthenticated } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<NodeJS.Timeout | null>(null)
  const [name, setName] = useState<string>('')
  const { order, sort_by, ...resqueryConfig } = useQueryConfig()
  const navigate = useNavigate()

  const { data: purchaseInCartData } = useQuery({
    queryKey: ['purchase', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart }),
    enabled: isAuthenticated
  })

  const handleSubmitSearch = (name: string) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...resqueryConfig,
        name
      }).toString()
    })
  }

  const handleOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }

  const handleClose = () => {
    // 👉 Delay 200ms trước khi đóng
    closeTimer.current = setTimeout(() => {
      setOpen(false)
    }, 200)
  }

  const purchaseInCart = purchaseInCartData?.data.data

  return (
    <header className='bg-background/40 sticky z-9 top-0 w-full border-b-2 border-b-gray-100 backdrop-blur-lg'>
      <NavHeader />
      <div className='container m-auto px-3.5 py-2.5 text-sm lg:px-0'>
        <nav className='grid grid-cols-[1fr_4fr_1fr] items-center'>
          <div className=''>
            <Link to='/'>
              <img src='#' className='w-24 lg:w-40' />
            </Link>
          </div>

          <div className='flex justify-center'>
            <form
              onSubmit={handleSubmitSearch(name)}
              className='flex w-full max-w-4/5 items-center justify-between border border-gray-300 bg-gray-50 py-2 ps-4 pe-2 transition-all duration-300 ease-in-out focus-within:border-gray-400 focus-within:shadow-[0_2px_4px_4px] focus-within:shadow-black/6'
            >
              <input
                className='w-full flex-1 outline-none'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Tên sản phẩm, thương hiệu, ...'
              />

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

          <div className='flex items-center'>
            <Popover.Root open={open} onOpenChange={setOpen}>
              <Popover.Trigger>
                <div
                  className='w-[70px] h-full flex items-center justify-end'
                  onMouseEnter={handleOpen}
                  onMouseLeave={handleClose}
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                    />
                  </svg>
                  <div className='bg-red-52c52 relative -top-2.5 -left-3 flex max-h-5 w-full max-w-6 items-center justify-center rounded-2xl border border-red-400 text-center text-white'>
                    {purchaseInCart?.length || 0}
                  </div>
                  {/* <div className='hidden md:inline-flex'>Giỏ hàng</div> */}
                </div>
              </Popover.Trigger>
              <Popover.Content
                className='popoverContent origin-top'
                align='center'
                sideOffset={0}
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
              >
                <div className='related text-normal max-w-[400px] rounded-sm bg-white shadow-md'>
                  {purchaseInCart ? (
                    <div className='p-2'>
                      <div className='p-2.5 text-gray-400 capitalize'>sản phẩm mới thêm</div>
                      <div>
                        {purchaseInCart.slice(0, MAX_PURCHASES).map((purchase) => (
                          <div key={purchase.product._id} className='flex items-center p-2.5' tabIndex={0}>
                            <div className='shrink-0 border border-gray-200'>
                              <img
                                className='max-w-10'
                                loading='lazy'
                                src={purchase.product.image}
                                alt='AF cổ bẻ khuy bấm , màu đen , cổ kẻ trắng #380 sz M'
                              ></img>
                            </div>
                            <div className='ml-2 grow overflow-hidden'>
                              <div className='truncate'>{purchase.product.name}</div>
                            </div>
                            <div className='ml-10 shrink-0'>
                              <div className='truncate'>{formatCurrency(purchase.product.price)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='flex items-center justify-between gap-3 p-2.5'>
                        {purchaseInCart.length > 0 ? (
                          <>
                            <div className='text-xs text-gray-700 capitalize'>
                              {purchaseInCart.length > MAX_PURCHASES ? purchaseInCart.length - MAX_PURCHASES : 0} thêm
                              vào giỏ hàng
                            </div>
                            <Link
                              to={path.cart}
                              className='grid h-8.5 place-items-center bg-black px-3.5 text-white hover:backdrop-opacity-80'
                            >
                              Xem giỏ hàng
                            </Link>
                          </>
                        ) : (
                          <div className='text-xs text-gray-700 capitalize'>Giỏ hàng trống</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='p-2'>
                      <div className='p-10 text-center text-gray-400 capitalize'>Hiện chưa có sản phẩm</div>
                    </div>
                  )}
                </div>
                <Popover.Arrow className='fill-black' width={21} height={10} />
              </Popover.Content>
            </Popover.Root>
          </div>
        </nav>
      </div>
    </header>
  )
}
