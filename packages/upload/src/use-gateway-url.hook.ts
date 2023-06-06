import { useAppUrl } from '@monstrs/react-app-links'

export const useGatewayUrl = (defaultUrl: string | null = null): string | null => {
  const url = useAppUrl({ subdomain: 'gateway' })

  return defaultUrl || url
}
