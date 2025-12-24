import type { UseQueryOptions } from '@tanstack/react-query'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { type Extension, type OffsetPagination, listExtensions } from '@/service/shai/marketplace'

export type UseShaiExtensionsQueryParams = {
  category?: string
  name?: string
  page?: number
  size?: number
}

export const useShaiExtensionsQuery = (
  { category, name, page = 1, size = 32 }: UseShaiExtensionsQueryParams,
  options?: Omit<UseQueryOptions<OffsetPagination<Extension>>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<OffsetPagination<Extension>>({
    queryKey: ['shai', 'extensions', { category, name, page, size }],
    queryFn: () =>
      listExtensions({
        page,
        size,
        sort_by: 'label',
        sort_order: 'asc',
        ...(category ? { category: category as any } : {}),
        ...(name ? {label: name } : {}),
      }),
    staleTime: 30_000,
    retry: 1,
    ...options,
  })
}

export type UseShaiExtensionsInfiniteParams = Omit<UseShaiExtensionsQueryParams, 'page'>

export const useShaiExtensionsInfiniteQuery = (
  { category, name, size = 32 }: UseShaiExtensionsInfiniteParams,
) => {
  return useInfiniteQuery({
    queryKey: ['shai', 'extensions', 'infinite', { category, name, size }],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      listExtensions({
        page: pageParam as number,
        size,
        sort_by: 'label',
        sort_order: 'asc',
        ...(category ? { category: category as any } : {}),
        ...(name ? {label: name } : {}),
      }),
    getNextPageParam: (lastPage: OffsetPagination<Extension>, pages: OffsetPagination<Extension>[]) => {
      const loaded = pages.reduce((acc, p) => acc + p.items.length, 0)
      return loaded < lastPage.total ? pages.length + 1 : undefined
    },
    staleTime: 30_000,
    retry: 1,
  })
}
