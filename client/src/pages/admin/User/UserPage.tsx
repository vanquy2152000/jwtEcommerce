import InputSearch from '../../../components/common/Admin/User/Search/InputSearch'
import UserDetail from '../../../components/common/Admin/User/UserDetail';
import { Link } from 'react-router-dom';
import { Button, Col, Layout, Modal, Pagination, Row, Table, Tooltip, Typography, message } from 'antd'
import { useMemo } from 'react'
import { deleteUser, getListUserWithPaginate } from '../../../service/userApi'
import { useState, useEffect } from 'react';
import { IUsers } from '../../../types/user';
import { BsPersonAdd, BsTrash } from 'react-icons/bs'
import { BiImport, BiExport } from 'react-icons/bi'
import { GrRefresh } from 'react-icons/gr'
import { AiOutlineEye } from 'react-icons/ai'
import { ColumnsType } from 'antd/es/table'
import './UserPage.scss'
import '../../../scss/custom-table.scss'
import { ExclamationCircleFilled } from '@ant-design/icons';

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
    cancelButtonProps: { className: "btn-close-modal" },
    className: "modal-container-action"
  })
}

const UserPage = () => {
  const [loadings, setLoadings] = useState<boolean[]>([])
  const [queryUsers, setQueryUsers] = useState({ currentPage: 1, pageSize: 5, total: 0, filter: '', sortQuery: '' })
  const [listUsers, setListUsers] = useState<IUsers[]>([])
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)
  const [dataUserDetail, setDataUserDetail] = useState<IUsers>()

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

  const fetchUser = async () => {
    let query = `current=${queryUsers.currentPage}&pageSize=${queryUsers.pageSize}`

    if (queryUsers.filter) {
      query += `&${queryUsers.filter}`
    }

    if (queryUsers.sortQuery) {
      query += `&${queryUsers.sortQuery}`
    }

    enterLoading(1)
    const res = await getListUserWithPaginate(query)

    if (res && res.data) {
      setQueryUsers({ ...queryUsers, total: res.data.meta.total })
      setListUsers(res.data.result)
    }

  }


  const baseIndex = useMemo(() => {
    return (queryUsers.currentPage - 1) * queryUsers.pageSize
  }, [queryUsers.currentPage, queryUsers.pageSize])

  useEffect(() => {
    fetchUser()
  }, [queryUsers.currentPage, queryUsers.pageSize, queryUsers.filter, queryUsers.sortQuery])


  const handleSearch = async (query: string) => {
    setQueryUsers({ ...queryUsers, currentPage: 1, filter: query })
  }

  const handlePageTableClick = (currentPage: number, pageSize: number) => {
    setQueryUsers({ ...queryUsers, currentPage: currentPage, pageSize: pageSize })
  }

  const handleClear = () => {
    setQueryUsers({ ...queryUsers, filter: '' })
  }

  const handleViewUserDetail = (record: IUsers) => {
    setDataUserDetail(record)
    setOpenViewDetail(true)
  }

  const getHandleDeleteUsersCallback = (record: IUsers) => {
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
    return (record: IUsers) => async () => {
      await deleteUser(record._id)
      enterLoading(1)
      setQueryUsers({ ...queryUsers, total: queryUsers.total - 1 })
      message.success("Xóa Thành Công")
      setListUsers(listUsers.filter((item) => item._id !== record._id))
    }
  }, [])


  // btn table
  const handleRefresh = () => {
    setQueryUsers({ ...queryUsers, filter: '', sortQuery: '' })
  }

  const baseColumns: ColumnsType<IUsers> = [
    {
      title: "Id",
      width: "15%",
      render: (_, record, __) => {
        return (
          <Link
            to={'#'}
            onClick={() => handleViewUserDetail(record)}
          >
            {record._id}
          </Link>
        )
      }
    },
    {
      title: "Tên hiển thị",
      width: "15%",
      dataIndex: 'fullName',
      sorter: true,
      render: (_, record, __) => {
        return (
          <span>{record.fullName}</span>
        )
      },
    },
    {
      title: "Email",
      width: "20%",
      dataIndex: 'email',
      sorter: true,
      render: (_, record, __) => {
        return (
          <span>{record.email}</span>
        )
      },
    },
    {
      title: "Số điện thoại",
      width: "20%",
      dataIndex: 'phone',
      sorter: true,
      render: (_, record, __) => {
        return (
          <span>{record.phone}</span>
        )
      },

    },
  ]

  const numberColumns = useMemo(() => {
    return {
      title: "",
      dataIndex: "numericalOrder",
      render(_: any, __: IUsers, index: any) {
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
      width: "10%",
      render: (_: any, record: IUsers, __: number) => (
        <Row style={{ gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          <Tooltip title="Chi tiết">
            <Button
              icon={<AiOutlineEye />}
              className="btn-edit-table"
              onClick={() => handleViewUserDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              icon={<BsTrash />}
              className="btn-delete-table"
              onClick={getHandleDeleteUsersCallback(record)}
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
      setQueryUsers({ ...queryUsers, sortQuery: sort })
    }
  }

  const handleCloseViewDetail = () => {
    setOpenViewDetail(false)
  }

  return (
    <>
      <Layout className='user-container'>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <InputSearch handleSearch={handleSearch} handleClear={handleClear} />
          </Col>
          <Col span={24}>
            <Table
              bordered
              title={() => (
                <Row justify="space-between" align={'middle'} >
                  <Col>
                    <Typography.Title level={5} style={{ margin: '0' }}>Danh sách người dùng</Typography.Title>
                  </Col>
                  <Col style={{ display: 'flex', gap: '10px' }}>
                    <Button className='btn-export' icon={<BiExport />}>Export</Button>
                    <Button className='btn-import' icon={<BiImport />}>Import</Button>
                    <Button className='btn-add' icon={<BsPersonAdd />}>Thêm mới</Button>
                    <Button type="text" icon={<GrRefresh />} onClick={handleRefresh} />
                  </Col>
                </Row>
              )}
              rowKey={record => record._id}
              columns={columns}
              dataSource={listUsers}
              pagination={false}
              loading={loadings[1]}
              className='custom-table'
              style={{ borderRadius: '20px' }}
              onChange={handleTableChange}
            />
          </Col>
          <Col span={24}>
            <Pagination
              total={queryUsers.total}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} items`}
              pageSizeOptions={[5, 10, 15, 20]}
              style={{ marginTop: "50px", textAlign: "center" }}
              onChange={handlePageTableClick}
              current={queryUsers.currentPage}
              defaultCurrent={1}
              defaultPageSize={queryUsers.pageSize}
            />
          </Col>
        </Row>
      </Layout>
      <UserDetail openViewDetail={openViewDetail} dataUserDetail={dataUserDetail} handleCloseViewDetail={handleCloseViewDetail} />
    </>
  )
}

export default UserPage
