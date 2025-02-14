import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import env from '#start/env'



export async function uploadBase64ImageToAzureStorage(
  base64Image: string,
  imageName: string,
  accountName: string,
  accountKey: string,
  containerName: string
): Promise<string> {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  )

  const containerClient = blobServiceClient.getContainerClient(containerName)

  const matches = base64Image.match(/^data:image\/(\w+);base64,/)
  if (!matches) {
    throw new Error('Invalid base64 image string')
  }
  const extension = matches[1]

  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '')
  const bufferSize = Buffer.byteLength(base64Data, 'base64')
  const MAX_SIZE = 1024 * 1024 * 1024

  if (bufferSize > MAX_SIZE) {
    throw new Error('Image size exceeds the maximum allowed size of 1 GB')
  }
  const buffer = Buffer.from(base64Data, 'base64')

  try {
    const blockBlobClient = containerClient.getBlockBlobClient(imageName)
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: `image/${extension}`,
      },
    })
    return `https://${accountName}.blob.core.windows.net/${containerName}/${imageName}`
  } catch (error) {
    throw new Error('Failed to upload image to Azure Storage')
  }
}

export function generateRandomImageName(extension: string): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * 10))
  }
  return `${result}.${extension}`
}
