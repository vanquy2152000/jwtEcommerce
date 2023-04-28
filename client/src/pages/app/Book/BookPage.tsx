import React from 'react'
import { useLocation } from 'react-router-dom'
import ViewDetail from '../../../components/common/App/Book/ViewDetail'
import { Layout } from 'antd'

type Props = {}

const Book = (props: Props) => {
  let location = useLocation()

  let params = new URLSearchParams(location.search)
  const id = params.get('id')

  return (
    <Layout >
      <ViewDetail />
    </Layout>
  )
}

export default Book