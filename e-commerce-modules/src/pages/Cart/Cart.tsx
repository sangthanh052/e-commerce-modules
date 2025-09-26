import { Link } from 'react-router-dom'

import QuantityController from '@/components/QuantityController'
import path from '@/constants/path'
import { formatCurrency, generateNameId } from '@/utils/utils'

export default function Cart() {
  return (
    <div className='py-16'>
      <div className='container mx-auto'>
        {true ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 border border-gray-200 bg-white p-5 px-9 py-5 text-sm text-gray-500 capitalize'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input type='checkbox' className='h-5 w-5 accent-black' />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                {Array(5)
                  .fill(0)
                  .map((purchase, index) => (
                    <div key={purchase._id} className='my-3 border border-gray-200 bg-white p-5'>
                      <div className='mb-5 grid grid-cols-12 items-center bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'>
                        <div className='col-span-6'>
                          <div className='flex'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input type='checkbox' className='h-5 w-5 accent-black' />
                            </div>
                            <div className='flex-grow'>
                              <div className='flex'>
                                <Link
                                  className='h-20 w-20 flex-shrink-0'
                                  to={`${path.home}`}
                                >
                                  <img alt={'purchase.product.name'} src={''} />
                                </Link>
                                <div className='flex-grow px-2 pt-1 pb-2'>
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: 'purchase.product.name',
                                      id: 'purchase.product._id'
                                    })}`}
                                    className='line-clamp-2 text-left'
                                  >
                                    {'purchase.product.name'}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center'>
                                <span className='text-gray-300 line-through'>
                                  ₫{formatCurrency(12)}
                                </span>
                                <span className='ml-3'>{formatCurrency(12)}</span>
                              </div>
                            </div>
                            <div className='col-span-1 mx-auto'>
                              <QuantityController
                                max={12}
                                value={1}
                              />
                              <span className='text-red-52c52 mt-2 block'>
                                Còn {1} sản phẩm
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <span className='text-orange'>
                                {formatCurrency(1)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <button className='hover:text-orange bg-none text-black transition-colors'>Xóa</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className='shadow-top sticky bottom-0 z-10 mt-8 flex flex-col border border-gray-200 bg-white p-5 sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input type='checkbox' className='h-5 w-5 accent-black' />
                </div>
                <button className='mx-3 border-none bg-none'>Chọn tất cả </button>
                <button className='mx-3 border-none bg-none'>Xóa</button>
              </div>

              <div className='mt-5 flex flex-col sm:mt-0 sm:ml-auto sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng cộng ({0} sản phẩm ):</div>
                    <div className='text-orange text-red-52c52 ml-2 text-2xl'>{formatCurrency(0)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='text-orange text-red-52c52 ml-6'>{formatCurrency(0)}</div>
                  </div>
                </div>
                {/* <Button className='mt-5 flex h-10 w-52 items-center justify-center bg-black text-sm text-white uppercase hover:opacity-80 sm:mt-0 sm:ml-4'>
                  Mua hàng
                </Button> */}
                <button className='mt-5 flex h-10 w-52 border border-white bg-black text-sm text-white uppercase sm:mt-0 sm:ml-4'>
                  Mua hàng
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <div className='mt-5 font-bold text-gray-400'>Chưa có sản phẩm trong giỏ hàng</div>
            <div className='mt-5 text-center'>
              <Link
                to={path.home}
                className='bg-orange hover:bg-orange/80 px-10 py-2 text-white uppercase transition-all'
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
