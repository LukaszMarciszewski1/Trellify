/* eslint-disable no-useless-escape */
export const isFileImage = (url: string) => {
  if (typeof url !== 'string') {
    return false
  }
  return (
    url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp|webp)(\?(.*))?$/gim) !==
    null
  )
}
