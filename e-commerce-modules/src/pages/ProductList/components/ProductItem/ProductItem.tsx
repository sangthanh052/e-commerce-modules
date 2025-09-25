import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

import ImageLoading from '@/components/ui/image-loading'
import path from '@/constants/path'
import type { Product } from '@/types/product.type'
import { formatCurrency, generateNameId } from '@/utils/utils'
import type React from 'react'

interface ProductItemType {
  product: Product
  style?: React.CSSProperties
}

export default function ProductItem(props: ProductItemType) {
  const { product, style } = props

  return (
    <Link
    to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}
    style={style}
      className='relative flex flex-col items-center justify-center rounded-sm border shadow-lg border-gray-300 hover:-translate-y-1 duration-200'
    >
      <div className='relative overflow-hidden rounded-lg bg-transparent h-full w-full pt-[100%]'>
        {product.image ? (
          <LazyLoadImage
            placeholderSrc='asdas'
            alt='image'
            className='h-full w-full scale-[1.15] object-cover absolute top-0 bottom-0'
            src={product.image}
          />
        ) : (
          <ImageLoading />
        )}
      </div>

      <div className='flex flex-col justify-between p-2'>
        <div className='mb-4 flex flex-col justify-between gap-1'>
          <div className='line-clamp-2'>{product.name}</div>
          <div
            className='box-border flex h-5 items-center self-auto overflow-hidden text-[0.625rem]'
            aria-hidden='true'
          >
            <div className='shadow-flag pointer-events-none relative m-[1px] flex h-4 max-w-full items-center overflow-hidden rounded-xs px-1 py-0.5 text-[0.625rem] leading-4 text-ellipsis'>
              <span className='text-red-52c52 truncate'>Rẻ Vô Địch</span>
            </div>
          </div>
        </div>

        <div className='visible flex items-center'>
          <div className='text-shopee-primary mr-1 flex max-w-full flex-shrink-0 flex-grow-1 items-center truncate font-medium'>
            <span data-testid='a11y-label' aria-label='promotion price' />
            <div className='flex items-baseline truncate'>
              {/* <span className='text-xs/sp14 text-red-52c52 mr-px font-medium'>₫</span> */}
              <span className='text-red-52c52 text-normal/5 truncate font-medium'>{formatCurrency(product.price)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
