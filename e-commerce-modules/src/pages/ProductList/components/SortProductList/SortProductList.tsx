// import DropdownMenuCustom from '~/components/DropdownMenuCustom'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import omit from 'lodash/omit'

import HoverSelectBox, { type Option } from '~/components/HoverSelectBox/HoverSelectBox'
import path from '~/constants/path'
import { order, sortBy } from '~/constants/product'
import type { ProductListConfig } from '~/types/product.type'
import type { QueryConfigType } from '~/hooks/useQueryConfig'

interface SortProductListType {
  queryConfig: QueryConfigType
  pageSize: number
}

const initialSelectBox: Option[] = [
  { name: 'Giá: Thấp đến cao', value: order.asc },
  { name: 'Giá: Cao đến thấp', value: order.desc }
]

export default function SortProductList({ queryConfig, pageSize }: SortProductListType) {
  const navigate = useNavigate()

  const { sort_by = sortBy.view, order, page } = queryConfig
  const currentPage = Number(page)

  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrderSort = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-black/3 px-5 py-3.5'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center justify-between gap-2.5'>
          <div>Sắp xếp theo</div>
          <button
            onClick={() => handleSort(sortBy.view)}
            className={`${isActiveSortBy(sortBy.view) ? 'bg-black text-white' : 'bg-white text-black'} h-[34px] cursor-pointer px-4 shadow-xs shadow-black/5`}
          >
            Phổ Biến
          </button>
          <button
            onClick={() => handleSort(sortBy.createdAt)}
            className={`${isActiveSortBy(sortBy.createdAt) ? 'bg-black text-white' : 'bg-white text-black'} h-[34px] cursor-pointer px-4 shadow-xs shadow-black/5`}
          >
            Mới Nhất
          </button>
          <button
            onClick={() => handleSort(sortBy.sold)}
            className={`${isActiveSortBy(sortBy.sold) ? 'bg-black text-white' : 'bg-white text-black'} h-[34px] cursor-pointer px-4 shadow-xs shadow-black/5`}
          >
            Bán Chạy
          </button>

          {/* <DropdownMenuCustom placeHolder='Giá' options={initialSelectBox} /> */}

          <HoverSelectBox
            placeHolder='Giá'
            placeHolderColor='text-red-52c52'
            textColor='text-black'
            options={initialSelectBox}
            handlePriceOrderSort={handlePriceOrderSort}
            order={order}
          />
        </div>

        <div className='flex items-center gap-5'>
          <div>
            <span className='text-red-52c52'>{queryConfig.page}</span>
            <span>/{pageSize}</span>
          </div>

          <div className='flex items-center'>
            {currentPage === 1 ? (
              <button className='border-gray-f2 bg-gray-f9 pointer-events-none flex h-9 w-9 items-center rounded-tl-sm rounded-bl-sm border-r shadow-xs'>
                <svg viewBox='0 0 7 11' className='fill-gray-ccc m-auto h-2.5 w-2.5'>
                  <path
                    d='M4.694078 9.8185598L.2870824 5.4331785c-.1957415-.1947815-.1965198-.511363-.0017382-.7071046a.50867033.50867033 0 0 1 .000868-.0008702L4.7381375.2732784 4.73885.273991c.1411545-.127878.3284279-.205779.5338961-.205779.4393237 0 .7954659.3561422.7954659.7954659 0 .2054682-.077901.3927416-.205779.5338961l.0006632.0006632-.0226101.0226101a.80174653.80174653 0 0 1-.0105706.0105706L2.4680138 4.7933195c-.1562097.1562097-.1562097.4094757 0 .5656855a.45579485.45579485 0 0 0 .0006962.0006944l3.3930018 3.3763607-.0009482.0009529c.128869.1413647.2074484.3293723.2074484.5357331 0 .4393237-.3561422.7954659-.7954659.7954659-.2049545 0-.391805-.077512-.5328365-.2048207l-.0003877.0003896-.0097205-.0096728a.80042023.80042023 0 0 1-.0357234-.0355483z'
                    fillRule='nonzero'
                  />
                </svg>
              </button>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (currentPage - 1).toString()
                  }).toString()
                }}
                className='flex h-9 w-9 cursor-pointer items-center rounded-tr-sm rounded-br-sm bg-white shadow-xs'
              >
                <svg viewBox='0 0 7 11' className='fill-gray-555 m-auto h-2.5 w-2.5'>
                  <path
                    d='M4.694078 9.8185598L.2870824 5.4331785c-.1957415-.1947815-.1965198-.511363-.0017382-.7071046a.50867033.50867033 0 0 1 .000868-.0008702L4.7381375.2732784 4.73885.273991c.1411545-.127878.3284279-.205779.5338961-.205779.4393237 0 .7954659.3561422.7954659.7954659 0 .2054682-.077901.3927416-.205779.5338961l.0006632.0006632-.0226101.0226101a.80174653.80174653 0 0 1-.0105706.0105706L2.4680138 4.7933195c-.1562097.1562097-.1562097.4094757 0 .5656855a.45579485.45579485 0 0 0 .0006962.0006944l3.3930018 3.3763607-.0009482.0009529c.128869.1413647.2074484.3293723.2074484.5357331 0 .4393237-.3561422.7954659-.7954659.7954659-.2049545 0-.391805-.077512-.5328365-.2048207l-.0003877.0003896-.0097205-.0096728a.80042023.80042023 0 0 1-.0357234-.0355483z'
                    fillRule='nonzero'
                  />
                </svg>
              </Link>
            )}

            {currentPage === pageSize ? (
              <button className='border-gray-f2 bg-gray-f9 pointer-events-none flex h-9 w-9 items-center rounded-tl-sm rounded-bl-sm border-r shadow-xs'>
                <svg viewBox='0 0 7 11' className='fill-gray-ccc m-auto h-2.5 w-2.5'>
                  <path
                    d='M2.305922 9.81856l4.4069956-4.385381c.1957415-.194782.1965198-.511364.0017382-.707105a.26384055.26384055 0 0 0-.000868-.00087L2.2618625.273278 2.26115.273991C2.1199955.146113 1.9327221.068212 1.7272539.068212c-.4393237 0-.7954659.356142-.7954659.795466 0 .205468.077901.392741.205779.533896l-.0006632.000663.0226101.02261c.0034906.003557.0070143.00708.0105706.010571L4.5319862 4.79332c.1562097.156209.1562097.409475 0 .565685-.0002318.000232-.0004639.000463-.0006962.000694L1.1382882 8.73606l.0009482.000953c-.128869.141365-.2074484.329372-.2074484.535733 0 .439324.3561422.795466.7954659.795466.2049545 0 .391805-.077512.5328365-.204821l.0003877.00039.0097205-.009673c.012278-.011471.0241922-.023327.0357234-.035548z'
                    fillRule='nonzero'
                  />
                </svg>
              </button>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (currentPage + 1).toString()
                  }).toString()
                }}
                className='flex h-9 w-9 cursor-pointer items-center rounded-tr-sm rounded-br-sm bg-white shadow-xs'
              >
                <svg viewBox='0 0 7 11' className='fill-gray-555 m-auto h-2.5 w-2.5'>
                  <path
                    d='M2.305922 9.81856l4.4069956-4.385381c.1957415-.194782.1965198-.511364.0017382-.707105a.26384055.26384055 0 0 0-.000868-.00087L2.2618625.273278 2.26115.273991C2.1199955.146113 1.9327221.068212 1.7272539.068212c-.4393237 0-.7954659.356142-.7954659.795466 0 .205468.077901.392741.205779.533896l-.0006632.000663.0226101.02261c.0034906.003557.0070143.00708.0105706.010571L4.5319862 4.79332c.1562097.156209.1562097.409475 0 .565685-.0002318.000232-.0004639.000463-.0006962.000694L1.1382882 8.73606l.0009482.000953c-.128869.141365-.2074484.329372-.2074484.535733 0 .439324.3561422.795466.7954659.795466.2049545 0 .391805-.077512.5328365-.204821l.0003877.00039.0097205-.009673c.012278-.011471.0241922-.023327.0357234-.035548z'
                    fillRule='nonzero'
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
