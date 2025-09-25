import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import omit from 'lodash/omit'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import type { ObjectSchema } from 'yup'

import type { category } from '~/types/category.type'

import path from '~/constants/path'
import RatingStars from '../RatingStars'
import InputNumber from '~/components/InputNumber'
import { filterSchema, type FilterSchemaType } from '~/utils/rules'
import type { NoUndefinedField } from '~/types/utils.type'
import { ButtonMoving } from '~/components/ui/moving-border'
import type { QueryConfigType } from '~/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface AsideFilterType {
  queryConfig: QueryConfigType
  categories: category[]
}

type FormData = NoUndefinedField<Pick<FilterSchemaType, 'price_max' | 'price_min'>>

export default function AsideFilter({ queryConfig, categories }: AsideFilterType) {
  const { t } = useTranslation('home')
  const { category, price_min, price_max } = queryConfig
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
    // trigger,
    clearErrors,
    reset
  } = useForm<FormData>({
    defaultValues: {
      price_min: price_min || '',
      price_max: price_max || ''
    },
    resolver: yupResolver(filterSchema as ObjectSchema<FormData>),
    mode: 'onSubmit'
    // shouldFocusError: false
  })

  const onSubmit = handleSubmit(
    (data) => {
      navigate({
        pathname: path.home,
        search: createSearchParams({
          ...queryConfig,
          price_max: data.price_max,
          price_min: data.price_min
        }).toString()
      })
    }

    // (err) => {
    //   if (err.price_max?.ref && typeof err.price_max.ref.focus === 'function') {
    //     err.price_max.ref.focus()
    //     console.log('xxx')
    //   }
    // }
  )

  const handleRemoveAllFilter = () => {
    reset({ price_min: '', price_max: '' })
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['category', 'rating_filter', 'price_min', 'price_max'])).toString()
    })
  }

  return (
    <div className='py-4'>
      <Link to={path.home} className={`flex gap-2.5 ${!category && 'font-bold'}`}>
        <svg viewBox='0 0 12 10' className='w-3'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>

        <span>{t('aside filter.all categories')}</span>
      </Link>

      <div className='my-4 h-[1px] bg-gray-300' />

      <ul>
        {categories &&
          categories.map((categoryItem) => {
            const isActive = categoryItem._id === category

            return (
              <li key={categoryItem._id} className='py-2 pl-2'>
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      ...queryConfig,
                      category: categoryItem._id
                    }).toString()
                  }}
                  className={`px-2 ${isActive && 'relative font-semibold'}`}
                >
                  {isActive && (
                    <svg viewBox='0 0 4 7' className='absolute top-1 -left-2.5 h-2 w-2 fill-black'>
                      <polygon points='4 3.5 0 0 0 7' />
                    </svg>
                  )}
                  {categoryItem.name}
                </Link>
              </li>
            )
          })}
      </ul>

      <Link to={path.home} className='mt-4 flex gap-2.5 font-bold uppercase'>
        <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x={0} y={0} className='w-3 stroke-black'>
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('aside filter.filter search')}
      </Link>

      <div className='my-4 h-[1px] bg-gray-300' />

      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-center gap-3'>
            {/* <InputNumber
              name={'price_min'}
              type='text'
              className='grow'
              placeholder='₫ TỪ'
              classNameInput='p-1 text-normal w-full border border-neutral-d0d0d0 focus:border-gray-500'
            /> */}
            <Controller
              control={control}
              name={'price_min'}
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ TỪ'
                    classNameInput='p-1 text-normal w-full border border-neutral-d0d0d0 focus:border-gray-500'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      // trigger('price_max') //nếu chỉ handle min thì chỉ xóa lỗi ở min, max vẫn còn lỗi
                      clearErrors() //xóa lỗi khi onchange
                    }}
                  />
                )
              }}
            />

            {/* <InputV2
              control={control}
              name='price_min'
              type='number'
              className='grow'
              placeholder='₫ TỪ'
              classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              classNameError='hidden'
              onChange={() => {
                trigger('price_max')
              }}
            /> */}

            <div className='bg-neutral-d0d0d0 mx-2.5 h-[1px] w-2.5' />

            <Controller
              control={control}
              name={'price_max'}
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ ĐẾN'
                    classNameInput='p-1 text-normal w-full border border-neutral-d0d0d0 focus:border-gray-500'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      // trigger('price_min')
                      clearErrors() ////xóa lỗi khi onchange
                    }}
                  />
                )
              }}
            />
          </div>
          {errors.price_min?.message && errors.price_max?.message && (
            <div className='text-red-52c52 text-normal pt-5 pb-2.5 text-center'>{errors.price_min.message}</div>
          )}
          <ButtonMoving
            containerClassName='flex w-2/3 m-auto mt-5 hover:opacity-80'
            type='submit'
            className='cursor-pointer rounded-[1.75rem] bg-black p-2.5 text-sm text-white uppercase'
          >
            Áp dụng
          </ButtonMoving>
        </form>
      </div>

      <div className='my-4 h-[1px] bg-gray-300' />

      <div className='text-normal pb-2.5'>Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />

      <div className='my-4 h-[1px] bg-gray-300' />
      <ButtonMoving
        onClick={handleRemoveAllFilter}
        containerClassName='flex w-2/3 m-auto mt-5 hover:opacity-80'
        className='cursor-pointer rounded-[1.75rem] bg-black p-2.5 text-sm text-white uppercase'
      >
        Xóa tất cả
      </ButtonMoving>
    </div>
  )
}
