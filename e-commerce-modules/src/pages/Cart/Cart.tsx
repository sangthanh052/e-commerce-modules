import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import keyBy from 'lodash/keyBy'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import purchaseApi from '@/apis/purchase.api'
import QuantityController from '@/components/QuantityController'
import path from '@/constants/path'
import { purchaseStatus } from '@/constants/purchase'
import { AppContext } from '@/contexts/app.context'
import type { Purchase } from '@/types/purchase.type'
import { formatCurrency, generateNameId } from '@/utils/utils'
import { toast } from 'react-toastify'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const location = useLocation()

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchase', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.byProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  const purchasesInCart = purchasesInCartData?.data.data
  const purchaseIdFromLocation = (location.state as { purchaseId: string | null })?.purchaseId
  console.log('purchaseIdFromLocation', purchaseIdFromLocation);
  const isCheckedAll = useMemo(
    () => extendedPurchases.length > 0 && extendedPurchases.every((purchase) => purchase.checked),
    [extendedPurchases]
  )
  const checkedPurchase = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchaseCount = checkedPurchase.length

  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchase.reduce((acc, current) => {
        return acc + current.product.price * current.buy_count
      }, 0),
    [checkedPurchase]
  )

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchase.reduce(
        (acc, current) => {
          return acc + (current.product.price_before_discount - current.product.price) * current.buy_count
        }, //callback (accumulator, currentValue, currentIndex, array)
        0
      ),
    [checkedPurchase]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendPurchaseObject = keyBy(prev, '_id')

      return (
        purchasesInCart?.map((purchase) => {
          const isPurchaseIdFromLocation = purchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isPurchaseIdFromLocation || Boolean(extendPurchaseObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, purchaseIdFromLocation, setExtendedPurchases])

  const handleChecked = (productIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[productIndex].checked = e.target.checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isCheckedAll
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enabled: boolean) => {
    if (enabled) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )

      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases((prev) => prev.map((p, i) => (i === purchaseIndex ? { ...p, buy_count: value } : p))) //nếu không dùng immer
  }

  const handleDelete = (purchaseId: string) => {
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteSelectedPurchase = () => {
    const purchaseIds = checkedPurchase.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  const handleBuyPurchases = () => {
    if (checkedPurchase.length > 0) {
      const body = checkedPurchase.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }

  return (
    <div className='py-16'>
      <div className='container mx-auto'>
        {extendedPurchases ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 border border-gray-200 bg-white p-5 px-9 py-5 text-sm text-gray-500 capitalize'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-black'
                          checked={isCheckedAll}
                          onChange={handleCheckedAll}
                        />
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
                {extendedPurchases.map((purchase, index) => (
                  <div key={purchase._id} className='my-3 border border-gray-200 bg-white p-5'>
                    <div className='mb-5 grid grid-cols-12 items-center bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'>
                      <div className='col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-black'
                              checked={purchase.checked}
                              onChange={handleChecked(index)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link className='h-20 w-20 flex-shrink-0' to={`${path.home}`}>
                                <img alt={purchase.product.name} src={purchase.product.image} />
                              </Link>
                              <div className='flex-grow px-2 pt-1 pb-2'>
                                <Link
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                  className='line-clamp-2 text-left'
                                >
                                  {purchase.product.name}
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
                                {formatCurrency(purchase.product.price_before_discount)}
                              </span>
                              <span className='ml-3'>{formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                          <div className='col-span-1 mx-auto'>
                            <QuantityController
                              max={purchase.product.quantity}
                              value={purchase.buy_count}
                              onType={handleTypeQuantity(index)}
                              onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                              onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                              onFocusOut={(value) =>
                                handleQuantity(
                                  index,
                                  value,
                                  value >= 1 &&
                                    value <= purchase.product.quantity &&
                                    value !== (purchasesInCart as Purchase[])[index].buy_count
                                )
                              }
                              disabled={purchase.disabled}
                            />
                            <span className='text-red-52c52 mt-2 block'>Còn {purchase.product.quantity} sản phẩm</span>
                          </div>
                          <div className='col-span-1'>
                            <span className='text-orange'>
                              {formatCurrency(purchase.buy_count * purchase.product.price)}
                            </span>
                          </div>
                          <div className='col-span-1'>
                            <button
                              className='hover:text-orange bg-none text-black transition-colors'
                              onClick={() => handleDelete(purchase._id)}
                            >
                              Xóa
                            </button>
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
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-black'
                    checked={isCheckedAll}
                    onChange={handleCheckedAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none'>Chọn tất cả </button>
                <button
                  className='mx-3 border-none bg-none'
                  onClick={handleDeleteSelectedPurchase}
                  disabled={!isCheckedAll}
                >
                  Xóa
                </button>
              </div>

              <div className='mt-5 flex flex-col sm:mt-0 sm:ml-auto sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng cộng ({checkedPurchaseCount || 0} sản phẩm ):</div>
                    <div className='text-orange text-red-52c52 ml-2 text-2xl'>
                      {formatCurrency(totalCheckedPurchasePrice)}
                    </div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='text-orange text-red-52c52 ml-6'>
                      {formatCurrency(totalCheckedPurchaseSavingPrice)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleBuyPurchases}
                  className='cursor-pointer mt-5 flex h-10 w-52 border border-white bg-black text-sm text-white uppercase sm:mt-0 sm:ml-4 p-3 items-center justify-center'
                >
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
