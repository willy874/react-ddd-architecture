import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '../services'

const USER_QUERY_KEY = 'user'

export const useUserStore = () => {
  return useQuery({
    queryKey: [USER_QUERY_KEY] as const,
    queryFn: fetchUser,
    select: (res) => res.data,
  })
}
