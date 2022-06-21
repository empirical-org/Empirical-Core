// https://react-query.tanstack.com/reference/QueryClient

export const defaultQueryClientOptions = {
  queries: {
    staleTime: Infinity,
    // all current query instances are manually refetched after data changes so no cache is needed (this option can be overridden in any useQuery instance)
    cacheTime: Infinity
  }
}
