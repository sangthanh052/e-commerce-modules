import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'

import productApi from '@/apis/product.api'
import purchaseApi from '@/apis/purchase.api'
import QuantityController from '@/components/QuantityController'
import Dialog from '@/components/ui/dialog'
import path from '@/constants/path'
import { purchaseStatus } from '@/constants/purchase'
import { formatCurrency, getIdFromNameId, rateSale } from '@/utils/utils'
import { useState } from 'react'

export default function ProductDetail() {
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)

  const [byCount, setByCount] = useState(1)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetails(id as string)
  })

  const addToCartMutation = useMutation({
    mutationFn: purchaseApi.addToCart
  })

  const handleByCount = (value: number) => {
    setByCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate(
      {
        buy_count: byCount,
        product_id: product?._id as string
      },
      {
        onSuccess: () => {
          setIsOpenDialog(true)
          queryClient.invalidateQueries({ queryKey: ['purchase', { status: purchaseStatus.inCart }] })
        }
      }
    )
  }

  const byNow = async () => {
    const res = await addToCartMutation.mutateAsync({
      buy_count: byCount,
      product_id: product?._id as string
    })
    const purchase = res.data.data

    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  const product = productDetailData?.data.data

  if (!product) return null

  return (
    <>
      <Dialog isOpen={isOpenDialog} setIsOpen={setIsOpenDialog}>
        <div className='grid size-15 place-items-center rounded-full bg-teal-600'>
          <svg xmlns='http://www.w3.org/2000/svg' width={30} height={30} viewBox='0 0 12 12' fill='#fff'>
            <path d='M5.2 10.9c-.2 0-.5-.1-.7-.2L.3 7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c.3-.4 1-.5 1.4-.2s.5 1 .2 1.4L6 10.6c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1' />
          </svg>
        </div>
        <span className='text-base'>Sản phẩm đã được thêm vào giỏ hàng</span>
      </Dialog>

      <div className='pb-5 text-sm'>
        <div className='container mx-auto'>
          <section className='grid lg:grid-cols-12'>
            <section className='lg:col-span-5 lg:p-3.5'>
              <div className='product-image relative w-full pt-[100%] shadow'>
                <AnimatePresence mode='wait'>
                  <motion.img
                    key={product.image} // Mỗi khi key thay đổi → animate lại
                    src={product.image}
                    alt={product.name}
                    className='absolute inset-0 object-cover'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>

              <div className='slider relative mt-3 mb-1.5 grid grid-flow-col place-items-center gap-1.5 hidden'>
                <div className='w-full'>
                  <div className='relative w-full pb-[100%]'>
                    <img src={product.image} alt='image' className='absolute inset-0' />
                    <div className='border-red-52c52 absolute inset-0 w-full border-2'></div>
                  </div>
                </div>

                <button className='absolute top-1/2 left-0 -translate-y-1/2 bg-black/20 text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={3}
                    stroke='currentColor'
                    className='h-8 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                <button className='absolute top-1/2 right-0 -translate-y-1/2 bg-black/20 text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={3}
                    stroke='currentColor'
                    className='h-8 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </section>

            <section className='lg:col-span-7 lg:p-5'>
              <h1 className='text-xl'>{product.name}</h1>

              <div className='group-price bg-gray-f9 flex items-center gap-2.5 px-5 py-4'>
                <span className='text-red-52c52 text-3xl first-letter:align-top first-letter:text-[26px]'>
                  {formatCurrency(product.price)}
                </span>

                <svg xmlns='http://www.w3.org/2000/svg' width={20} height={21} fill='none' viewBox='0 0 20 21'>
                  <path
                    fill='#EE4D2D'
                    fillRule='evenodd'
                    d='M14.583 17.167c-2.533 0-4.585-2.067-4.585-4.616 0-2.55 2.052-4.616 4.585-4.616S19.167 10 19.167 12.55s-2.052 4.616-4.585 4.616m1.774-6.365a.5.5 0 0 1 .729-.017.51.51 0 0 1 .017.699l-2.633 2.923-.028.04a.513.513 0 0 1-.76.06l-1.402-1.33a.51.51 0 0 1-.01-.732.504.504 0 0 1 .701-.013l1.043.97z'
                    clipRule='evenodd'
                  />
                  <path
                    fill='#EE4D2D'
                    d='M9.745 16.143H2.362a1.534 1.534 0 0 1-1.528-1.539v-3.462h.764a1.15 1.15 0 0 0 1.146-1.154 1.15 1.15 0 0 0-1.146-1.154H.834V5.372c0-.85.684-1.538 1.528-1.538h12.226c.844 0 1.529.688 1.529 1.538v1.325a6 6 0 0 0-1.147-.186V5.372a.383.383 0 0 0-.382-.384H6.443v1.718H5.425V4.988H2.362a.383.383 0 0 0-.382.384v2.34a2.304 2.304 0 0 1 1.91 2.276 2.304 2.304 0 0 1-1.91 2.277v2.34c0 .212.171.384.382.384h3.063v-1.512h1.018v1.512H9.08q.271.617.666 1.154'
                  />
                  <path fill='#EE4D2D' d='M5.425 9.579V7.732h1.018V9.58zm0 2.872v-1.847h1.018v1.847z' />
                </svg>

                <span className='text-gray-555/70 text-base line-through first-letter:align-top first-letter:text-sm'>
                  {formatCurrency(product.price_before_discount)}
                </span>
                <span className='text-normal bg-red-52c52 p-1 font-bold text-white uppercase'>
                  {rateSale(product.price_before_discount, product.price)} Giảm
                </span>
              </div>

              <button className='my-4 flex cursor-pointer items-center'>
                Bảng quy đổi kích cỡ
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-5 text-gray-400'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </button>

              <div className='group-quantity mt-4 flex items-center gap-3.5'>
                <h2 className='w-[100px]'>Số lượng</h2>
                <QuantityController
                  max={product.quantity}
                  value={byCount}
                  onIncrease={handleByCount}
                  onDecrease={handleByCount}
                  onType={handleByCount}
                />
                <div className='text-gray-555 uppercase'>{product.quantity} product:available</div>
              </div>

              <div className='mt-7.5 inline-flex items-center gap-3'>
                <button className='button' onClick={addToCart}>
                  Thêm vào giỏ hàng
                </button>
                <button className='border border-black bg-white text-black px-2 py-4 text-nowrap' onClick={byNow}>Mua ngay</button>
              </div>
            </section>
          </section>
        </div>
      </div>
    </>
  )
}
