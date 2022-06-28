import { QueryClient } from 'react-query'

export class DefaultReactQueryClient extends QueryClient {
  constructor() {
    super({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          // all current query instances are manually refetched after data changes so no cache is needed (this option can be overridden in any useQuery instance)
          cacheTime: Infinity
        }
      }
    })
  }
}
