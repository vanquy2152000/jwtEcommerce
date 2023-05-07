import OrderDetail from '../../../components/common/Admin/Order/OrderDetail';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Col, Layout, Pagination, Row, Table, Typography } from 'antd'
import { useMemo } from 'react'
import { useState, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table'
import { IBooks } from '../../../types/book';
import { getListOrdersWithPaginations } from '../../../service/orderApi';
import { IOrders } from '../../../types/order';
import './OrderPage.scss'
import '../../../scss/custom-table.scss'

const Order = () => {
  const [loadings, setLoadings] = useState<boolean[]>([])
  const [queryOrders, setQueryOrders] = useState({ currentPage: 1, pageSize: 5, total: 0, filter: '', sortQuery: 'sort=-updatedAt' })
  const [listOrders, setListOrders] = useState<IOrders[]>([])
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)
  const [dataOrderDetail, setDataOrderDetail] = useState<IOrders>()

  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  };

  const fetchListBooks = async () => {
    let query = `current=${queryOrders.currentPage}&pageSize=${queryOrders.pageSize}`

    if (queryOrders.filter) {
      query += `&${queryOrders.filter}`
    }

    if (queryOrders.sortQuery) {
      query += `&${queryOrders.sortQuery}`
    }

    enterLoading(1)
    const res = await getListOrdersWithPaginations(query)
    console.log(res)

    if (res && res.data) {
      setQueryOrders({ ...queryOrders, total: res.data.meta.total })
      setListOrders(res.data.result)
    }
  }
  useEffect(() => {
    fetchListBooks()
  }, [queryOrders.currentPage, queryOrders.pageSize, queryOrders.filter, queryOrders.sortQuery])

  const baseIndex = useMemo(() => {
    return (queryOrders.currentPage - 1) * queryOrders.pageSize
  }, [queryOrders.currentPage, queryOrders.pageSize])


  const handlePageTableClick = (currentPage: number, pageSize: number) => {
    setQueryOrders({ ...queryOrders, currentPage: currentPage, pageSize: pageSize })
  }


  const handleViewBookDetail = (record: IOrders) => {
    setDataOrderDetail(record)
    setOpenViewDetail(true)
  }
  console.log(dataOrderDetail)

  const baseColumns: ColumnsType<IOrders> = [
    {
      title: "Id",
      width: "15%",
      render: (_, record, __) => {
        return (
          <Link
            to={'#'}
            onClick={() => handleViewBookDetail(record)}
          >
            {record._id}
          </Link>
        )
      }
    },
    {
      title: "Giá tiền",
      width: "25%",
      dataIndex: 'price',
      render: (_, record, __) => {
        return (
          <span> {record.totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
        )
      },
    },
    {
      title: "Tên",
      width: "15%",
      dataIndex: 'name',
      render: (_, record, __) => {
        return (
          <>
            <span> {record.name}</span>
          </>
        )
      },
    },
    {
      title: "Địa chỉ",
      width: "10%",
      dataIndex: 'address',
      sorter: true,
      render: (_, record, __) => {
        return (
          <span>{record.address}</span>
        )
      },
    },
    {
      title: "Số điện thoại",
      width: "10%",
      dataIndex: 'phone',
      render: (_, record, __) => {
        return (
          <>
            <span> {record.phone}</span>
          </>
        )
      },
    },
    {
      title: "Ngày cập nhật",
      width: "10%",
      dataIndex: 'updatedAt',
      sorter: true,
      render: (_, record, __) => {
        return (
          <>
            {moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
          </>
        )
      },
    },
  ]

  const numberColumns = useMemo(() => {
    return {
      title: "",
      dataIndex: "numericalOrder",
      render(_: any, __: IBooks, index: any) {
        return (
          <div style={{ textAlign: 'center' }}>
            {baseIndex + index + 1}
          </div>
        )
      },
      width: '4%'
    }
  }, [baseIndex])

  const columns = useMemo(() => {
    const result = [numberColumns, ...baseColumns]

    return result;
  }, [numberColumns])

  const handleTableChange = (_: any, __: any, sorter: any) => {
    if (sorter && sorter.field) {
      const sort = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
      setQueryOrders({ ...queryOrders, sortQuery: sort })
    }
  }

  const handleCloseViewDetail = () => {
    setOpenViewDetail(false)
    setDataOrderDetail(undefined)
  }

  return (
    <>
      <Layout className='book-container'>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Table
              bordered
              title={() => (<Typography.Title level={5} style={{ margin: '0' }}>Danh sách lịch sử đơn hàng</Typography.Title>)}
              rowKey={record => record._id}
              columns={columns}
              dataSource={listOrders}
              pagination={false}
              loading={loadings[1]}
              className='custom-table'
              style={{ borderRadius: '20px' }}
              onChange={handleTableChange}
            />
          </Col>
          <Col span={24}>
            <Pagination
              total={queryOrders.total}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} items`}
              pageSizeOptions={[5, 10, 15, 20]}
              style={{ marginTop: "50px", textAlign: "center" }}
              onChange={handlePageTableClick}
              current={queryOrders.currentPage}
              defaultCurrent={1}
              defaultPageSize={queryOrders.pageSize}
            />
          </Col>
        </Row >
      </Layout >

      <OrderDetail
        openViewDetail={openViewDetail}
        dataOrderDetail={dataOrderDetail}
        handleCloseViewDetail={handleCloseViewDetail}
      />
    </>
  )
}

export default Order
