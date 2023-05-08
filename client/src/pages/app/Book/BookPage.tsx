import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ViewDetail from '../../../components/common/App/Book/ViewDetail'
import { Layout } from 'antd'
import { getBookDetail } from '../../../service/bookApi'
import { IBooks } from '../../../types/book'
import AppHelmet from '../../../components/common/Helmet/AppHelmet'

type Props = {}

const Book = (props: Props) => {
  const [dataBook, setDataBook] = useState<IBooks>()
  let location = useLocation()

  let params = new URLSearchParams(location.search)
  const id = params.get('id')

  const getImages = (raw: any) => {
    const images = []
    if (raw.thumbnail) {
      images.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
        originalClass: 'original-image',
        thumbnailClass: 'thumbnail-image'
      })
    }

    if (raw.slider) {
      raw?.slider?.map((item: any) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originalClass: 'original-image',
          thumbnailClass: 'thumbnail-image'
        })
      })
    }

    return images
  }

  useEffect(() => {
    const fetchDetailBook = async (id: string) => {
      const res = await getBookDetail(id!)
      console.log(res)

      if (res && res.data) {
        res.data.items = getImages(res.data)

        setTimeout(() => {
          setDataBook(res.data)
        }, 2000)
      }
    }
    fetchDetailBook(id!)
  }, [id])

  return (
    <>
      <AppHelmet title="Detail Book" />
      <Layout >
        <ViewDetail dataBook={dataBook} />
      </Layout>
    </>
  )
}

export default Book