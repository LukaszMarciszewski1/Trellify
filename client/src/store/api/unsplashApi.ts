import axios from 'axios'
import unsplash from '../../config/unsplash'

const getImages = async () => {
  const page = Math.floor(Math.random() * 20 + 1)
  const numberPhotos = 14
  const urlImages = `https://api.unsplash.com/search/photos?page=${page}&per_page=${numberPhotos}&query=Landscape&client_id=${unsplash.clientKey}`

  const res = await axios.get(urlImages)
  const photos = res.data.results.map(
    (image: {
      id: any
      urls: { thumb: any; full: any }
      user: { username: any; links: { html: any } }
    }) => ({
      id: image.id,
      thumb: image.urls.thumb,
      full: image.urls.full,
      user: {
        username: image.user.username,
        link: image.user.links.html,
      },
    })
  )
  return photos
}

export default getImages
