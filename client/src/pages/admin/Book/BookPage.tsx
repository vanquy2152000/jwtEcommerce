import * as XLSX from 'xlsx';
import InputSearch from '../../../components/common/Admin/Search/InputSearch'
import moment from 'moment';
import BookDetail from '../../../components/common/Admin/Book/BookDetail';
import ModalBook from '../../../components/common/Admin/Book/ModalBook';
import { Link } from 'react-router-dom';
import { Button, Col, Layout, Modal, Pagination, Row, Table, Tooltip, Typography, message } from 'antd'
import { useMemo } from 'react'
import { useState, useEffect } from 'react';
import { BsPersonAdd, BsTrash } from 'react-icons/bs'
import { BiExport } from 'react-icons/bi'
import { GrRefresh } from 'react-icons/gr'
import { AiOutlineEdit } from 'react-icons/ai'
import { ColumnsType } from 'antd/es/table'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { IBooks } from '../../../types/book';
import { deleteBook, getListBooksWithPaginate } from '../../../service/bookApi';
import './BookPage.scss'
import '../../../scss/custom-table.scss'

const { confirm } = Modal;

type ConfirmationPopupParams = {
  message: string,
  icon: JSX.Element,
  onOk: () => any
}

const confirmationPopup = (param: ConfirmationPopupParams) => {
  confirm({
    ...param,
    title: 'Cảnh Báo',
    content: param.message,
    okText: 'Yes',
    okType: 'danger',
    centered: true,
    cancelText: 'Đóng',
    okButtonProps: { className: "btn-ok-modal" },
    cancelButtonProps: { className: "btn-cancel-modal" },
  })
}

const BookPage = () => {
  const [loadings, setLoadings] = useState<boolean[]>([])
  const [queryBooks, setQueryBooks] = useState({ currentPage: 1, pageSize: 5, total: 0, filter: '', sortQuery: 'sort=-updatedAt' })
  const [listBooks, setListBooks] = useState<IBooks[]>([])
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)
  const [dataBookDetail, setDataBookDetail] = useState<IBooks>()
  const [openModalBook, setOpenModalBook] = useState<boolean>(false)
  const [actionModalBook, setActionModalBook] = useState<string>('CREATE')
  const actionEnum = 'BOOK'

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
    let query = `current=${queryBooks.currentPage}&pageSize=${queryBooks.pageSize}`

    if (queryBooks.filter) {
      query += `&${queryBooks.filter}`
    }

    if (queryBooks.sortQuery) {
      query += `&${queryBooks.sortQuery}`
    }

    enterLoading(1)
    const res = await getListBooksWithPaginate(query)

    if (res && res.data) {
      setQueryBooks({ ...queryBooks, total: res.data.meta.total })
      setListBooks(res.data.result)
    }
  }
  useEffect(() => {
    fetchListBooks()
  }, [queryBooks.currentPage, queryBooks.pageSize, queryBooks.filter, queryBooks.sortQuery])

  const baseIndex = useMemo(() => {
    return (queryBooks.currentPage - 1) * queryBooks.pageSize
  }, [queryBooks.currentPage, queryBooks.pageSize])


  // search
  const handleSearch = async (query: string) => {
    setQueryBooks({ ...queryBooks, currentPage: 1, filter: query })
  }
  const handleClear = () => {
    setQueryBooks({ ...queryBooks, filter: '' })
  }

  const handlePageTableClick = (currentPage: number, pageSize: number) => {
    setQueryBooks({ ...queryBooks, currentPage: currentPage, pageSize: pageSize })
  }


  const handleViewBookDetail = (record: IBooks) => {
    setDataBookDetail(record)
    setOpenViewDetail(true)
  }

  const getHandleDeleteBooksCallback = (record: IBooks) => {
    return () => {
      confirmationPopup({
        message: 'Người dùng này sẽ bị xóa, bạn có muốn tiếp tục?',
        icon: <ExclamationCircleFilled />,
        onOk: getOnOkDeleteCallback(record)
      })
    }
  }

  // onOk call back
  const getOnOkDeleteCallback = useMemo(() => {
    return (record: IBooks) => async () => {
      await deleteBook(record._id)
      enterLoading(1)
      setQueryBooks({ ...queryBooks, total: queryBooks.total - 1 })
      message.success("Xóa Thành Công")
      fetchListBooks()
    }
  }, [])


  // btn table
  const handleRefresh = () => {
    setQueryBooks({ ...queryBooks, filter: '', sortQuery: '' })
  }

  // Modal
  const handleModalAddBook = () => {
    setActionModalBook('CREATE')
    setOpenModalBook(true)
  }
  const handleEditBookCallback = (record: IBooks) => {
    return () => {
      setActionModalBook('UPDATE')
      setOpenModalBook(true)
      setDataBookDetail(record)
    }
  }

  const handleSaveModalBook = () => {
    setOpenModalBook(false)
    fetchListBooks()
  }

  const handleCloseModalBook = () => {
    setOpenModalBook(false)
  }


  // export excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(listBooks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "Danh sách book.csv");
  }

  const baseColumns: ColumnsType<IBooks> = [
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
      title: "Tên sách",
      width: "25%",
      dataIndex: 'mainText',
      sorter: true,
      render: (_, record, __) => {
        return (
          <span style={{ lineHeight: '2' }}>{record.mainText}</span>
        )
      },
    },
    {
      title: "Tên tác giả",
      width: "15%",
      dataIndex: 'author',
      sorter: true,
      render: (_, record, __) => {
        return (
          <>
            <span> {record.author}</span>
          </>
        )
      },
    },
    {
      title: "Thể loại",
      width: "10%",
      dataIndex: 'category',
      sorter: true,
      render: (_, record, __) => {
        return (
          <span>{record.category}</span>
        )
      },
    },
    {
      title: "Giá tiền",
      width: "10%",
      dataIndex: 'price',
      sorter: true,
      render: (_, record, __) => {
        return (
          <>
            <span> {record.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
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

  const actionColumns = useMemo(() => {
    return {
      title: "Hành động",
      width: "20%",
      render: (_: any, record: IBooks, __: number) => (
        <Row style={{ gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          <Tooltip title="Xóa">
            <Button
              icon={<BsTrash />}
              className="btn-delete-table"
              onClick={getHandleDeleteBooksCallback(record)}
            />
          </Tooltip>
          <Tooltip title="Chi tiết">
            <Button
              icon={<AiOutlineEdit />}
              className="btn-edit-table"
              onClick={handleEditBookCallback(record)}
            />
          </Tooltip>
        </Row>
      )
    }
  }, [])

  const columns = useMemo(() => {
    const result = [numberColumns, ...baseColumns]

    result.push(actionColumns)
    return result;
  }, [actionColumns, numberColumns])

  const handleTableChange = (_: any, __: any, sorter: any) => {
    if (sorter && sorter.field) {
      const sort = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
      setQueryBooks({ ...queryBooks, sortQuery: sort })
    }
  }

  const handleCloseViewDetail = () => {
    setOpenViewDetail(false)
    setDataBookDetail(undefined)
  }

  return (
    <>
      <Layout className='book-container'>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <InputSearch actionEnum={actionEnum} handleSearch={handleSearch} handleClear={handleClear} />
          </Col>
          <Col span={24}>
            <Table
              bordered
              title={() => (
                <Row justify="space-between" align={'middle'} >
                  <Col>
                    <Typography.Title level={5} style={{ margin: '0' }}>Danh sách sản phẩm</Typography.Title>
                  </Col>
                  <Col style={{ display: 'flex', gap: '10px' }}>
                    <Button className='btn-export' icon={<BiExport />} onClick={handleExportExcel}>Export</Button>
                    <Button className='btn-add' icon={<BsPersonAdd />} onClick={handleModalAddBook}>Thêm mới</Button>
                    <Button type="text" icon={<GrRefresh />} onClick={handleRefresh} />
                  </Col>
                </Row>
              )}
              rowKey={record => record._id}
              columns={columns}
              dataSource={listBooks}
              pagination={false}
              loading={loadings[1]}
              className='custom-table'
              style={{ borderRadius: '20px' }}
              onChange={handleTableChange}
            />
          </Col>
          <Col span={24}>
            <Pagination
              total={queryBooks.total}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} items`}
              pageSizeOptions={[5, 10, 15, 20]}
              style={{ marginTop: "50px", textAlign: "center" }}
              onChange={handlePageTableClick}
              current={queryBooks.currentPage}
              defaultCurrent={1}
              defaultPageSize={queryBooks.pageSize}
            />
          </Col>
        </Row >
      </Layout >
      <BookDetail
        openViewDetail={openViewDetail}
        dataBookDetail={dataBookDetail}
        handleCloseViewDetail={handleCloseViewDetail}
      />
      <ModalBook
        openModal={openModalBook}
        actionModal={actionModalBook}
        dataBookDetail={dataBookDetail}
        handleSaveModalBook={handleSaveModalBook}
        handleCloseModalBook={handleCloseModalBook}
      />
    </>
  )
}

export default BookPage
