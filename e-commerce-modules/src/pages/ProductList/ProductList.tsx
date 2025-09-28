import { useInfiniteQuery } from '@tanstack/react-query'
// import { useEffect } from 'react'
// import { useInView } from 'react-intersection-observer'
import { AutoSizer, CellMeasurer, CellMeasurerCache, Grid, WindowScroller, type GridCellProps } from 'react-virtualized'

import productApi from '@/apis/product.api'
import useQueryConfig from '@/hooks/useQueryConfig'
import type { ProductListConfig } from '@/types/product.type'
import type { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer'
import ProductItem from './components/ProductItem/ProductItem'

// 👉 Cache để lưu kích thước cell
const cache = new CellMeasurerCache({
  defaultHeight: 400, // chiều cao tạm khi chưa đo
  fixedWidth: true // width fix theo columnWidth
})

export default function ProductList() {
  const queryConfig = useQueryConfig()
  // const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false })

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['products', queryConfig],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await productApi.getProducts({
        ...queryConfig,
        page: String(pageParam)
      } as ProductListConfig)
      await delay(1000)
      return res
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.data.pagination
      return pagination.page < pagination.page_size ? pagination.page + 1 : undefined
    }
  })

  // useEffect(() => {
  //   if (inView && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage()
  //   }
  // }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const products = productsData?.pages.flatMap((page) => page.data.data.products) ?? []

  const columnCount = 5
  const rowCount = Math.ceil(products.length / columnCount)

  const cellRenderer = ({
    columnIndex,
    rowIndex,
    key,
    style,
    parent
  }: GridCellProps & { parent: MeasuredCellParent }) => {
    const productIndex = rowIndex * columnCount + columnIndex
    if (productIndex >= products.length) return null
    const product = products[productIndex]

    return (
      <CellMeasurer key={key} cache={cache} parent={parent} columnIndex={columnIndex} rowIndex={rowIndex}>
        {({ measure, registerChild }) => (
          <div ref={registerChild} onLoad={measure} style={{ ...style, padding: '10px', boxSizing: 'border-box' }}>
            <ProductItem product={product} />
          </div>
        )}
      </CellMeasurer>
    )
  }

  return (
    <div className='py-6 text-sm'>
      <title>Vite + React + TS</title>

      <div className='container mx-auto'>
        <div className='grid grid-cols-12 gap-8'>
          <div className='col-span-2'>{/* <AsideFilter /> */}</div>
          <div className='col-span-10'>
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <Grid
                      autoHeight
                      cellRenderer={cellRenderer}
                      columnCount={columnCount}
                      columnWidth={width / columnCount}
                      height={height}
                      rowCount={rowCount}
                      rowHeight={cache.rowHeight} // 👈 lấy từ cache
                      deferredMeasurementCache={cache} // 👈 dùng cache
                      width={width}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                      onSectionRendered={({ rowStopIndex }) => {
                        // 👉 Tính index cuối cùng đang render
                        const lastVisibleIndex = (rowStopIndex + 1) * columnCount

                        // 👉 Nếu đang tới gần cuối -> fetchNextPage
                        if (
                          lastVisibleIndex >= products.length - columnCount && // còn khoảng 1 hàng cuối
                          hasNextPage &&
                          !isFetchingNextPage
                        ) {
                          fetchNextPage()
                        }
                      }}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>

            {/* {!isFetchingNextPage && hasNextPage && (
              <div ref={ref} className='button !w-fit mx-auto mt-10'>
                Load more
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
