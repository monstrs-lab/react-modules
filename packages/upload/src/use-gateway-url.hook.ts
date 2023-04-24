import { useAppUrl } from '@monstrs/react-app-links'

export const useGatewayUrl = (defaultUrl?: string) => {
  const url = useAppUrl({ subdomain: 'public.gateway' })

  return defaultUrl || url
}
