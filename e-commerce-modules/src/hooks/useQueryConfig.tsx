import { sortBy } from '@/constants/product'
import type { ProductListConfig } from '@/types/product.type'
import useQueryParams from './useQueryParams'

export type QueryConfigType = {
  [key in keyof ProductListConfig]: string
}

export default function useQueryConfig() {
  const queryParams: QueryConfigType = useQueryParams()

  const queryConfig: QueryConfigType = {
    ...queryParams,
    page: queryParams.page || '1',
    limit: queryParams.limit || '20',
    sort_by: queryParams.sort_by || sortBy.view
  }

  return queryConfig
}
