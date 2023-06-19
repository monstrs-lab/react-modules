import { GraphQLClient } from 'graphql-request'
import { gql }           from 'graphql-request'
import { useMemo }       from 'react'

import { useGatewayUrl } from './use-gateway-url.hook.js'

const uploadMutation = gql`
  mutation CreateUpload($input: CreateUploadInput!) {
    createUpload(input: $input) {
      result {
        id
        url
      }
    }
  }
`
const confirmMutation = gql`
  mutation ConfirmUpload($input: ConfirmUploadInput!) {
    confirmUpload(input: $input) {
      result {
        id
        url
      }
    }
  }
`

const upload = async (url: string, file: File): Promise<void> => {
  try {
    await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })
    // eslint-disable-next-line no-empty
  } catch {}
}

export interface UseUploadProps {
  bucket: string
  endpoint?: string
}

export const useUpload = ({
  bucket,
  endpoint: defaultEndpoint,
}: UseUploadProps): ((file: File) => Promise<{ id: string; url: string }>) => {
  const endpoint = useGatewayUrl(defaultEndpoint)

  // eslint-disable-next-line consistent-return
  const client = useMemo(() => {
    if (endpoint)
      return new GraphQLClient(endpoint, {
        credentials: 'include',
      })
  }, [endpoint])!

  return async (file: File): Promise<{ id: string; url: string }> => {
    const {
      createUpload: { result },
    }: { createUpload: { result: { id: string; url: string } } } = await client.request(
      uploadMutation,
      {
        input: {
          bucket,
          name: file.name,
          size: file.size,
        },
      }
    )

    if (!result) {
      throw new Error('Upload not created')
    }

    await upload(result.url, file)

    const { confirmUpload }: { confirmUpload: { result: { id: string; url: string } } } =
      await client.request(confirmMutation, {
        input: { id: result.id },
      })

    return confirmUpload.result
  }
}
