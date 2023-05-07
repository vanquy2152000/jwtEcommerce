import moment from 'moment'
import ReactJson from 'react-json-view'
import { Col, Layout, Pagination, Row, Table, Tag, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { IHistories } from '../../../types/history';
import { useEffect, useState, useMemo, useRef } from 'react';
import { getHistoryOrder } from '../../../service/historyApi'
import './HistoryPage.scss'

const HistoryPage = () => {
    const [listHistoryOrders, setListHistoryOrders] = useState<IHistories[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(5)

    const [loading, setLoading] = useState<boolean>(false)
    const history = useRef<IHistories[]>([])

    const baseIndex = useMemo(() => {
        return (currentPage - 1) * pageSize
    }, [currentPage, pageSize])

    useEffect(() => {
        const fetchListHistories = async () => {
            setLoading(true)
            const res = await getHistoryOrder()

            if (res && res.data) {
                setListHistoryOrders(res.data)
                history.current = res.data
            }
            setLoading(false)
        }
        fetchListHistories()
    }, [])

    const handlePageTableClick = (currentPage: number, pageSize: number) => {
        setCurrentPage(currentPage)
        setPageSize(pageSize)
        setListHistoryOrders(history.current)

    }
    const baseColumns: ColumnsType<IHistories> = [
        {
            title: "Thời gian",
            width: "10%",
            dataIndex: 'updatedAt',
            render: (_, record, __) => {
                return (
                    <>
                        {moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </>
                )
            },
        },
        {
            title: "Tổng số tiền",
            width: "10%",
            dataIndex: 'totalPrice',
            render: (_, record, __) => {
                return (
                    <span>
                        {record.totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                    </span>
                )
            },
        },
        {
            title: "Trạng thái",
            width: "10%",
            dataIndex: 'status',
            render: (_, record, __) => {
                return (
                    <span>
                        <Tag color="green">Thành công</Tag>
                    </span>
                )
            },
        },
    ]
    const numberColumns = useMemo(() => {
        return {
            title: "STT",
            dataIndex: "numericalOrder",
            align: "center",
            render(_: any, __: IHistories, index: any) {
                return (
                    <div style={{ textAlign: 'center' }}>
                        {baseIndex + index + 1}
                    </div>
                )
            },
            width: '4%'
        }
    }, [baseIndex])
    const jsonColumns = useMemo(() => {
        return {
            title: "Chi tiết",
            width: "30%",
            dataIndex: 'json',
            render: (_: any, record: IHistories, __: number) => (
                <ReactJson src={record.detail} name='Chi tiết đơn mua' collapsed={true} />
            )
        }
    }, [])
    const columns = useMemo(() => {
        const result = [numberColumns, ...baseColumns]

        result.push(jsonColumns)
        return result;
    }, [jsonColumns, numberColumns])
    console.log(listHistoryOrders)
    return (
        <Layout className='history-container'>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Table
                        bordered
                        title={() => (<Typography.Title level={5} style={{ margin: '0' }}>Lịch sử mua hàng</Typography.Title>)}
                        rowKey={record => record._id}
                        columns={columns}
                        dataSource={listHistoryOrders.filter((item, index) => {
                            const start = (currentPage - 1) * pageSize;
                            const end = start + pageSize;
                            return index >= start && index < end;
                        })}
                        pagination={false}
                        loading={loading}
                        className='custom-table'
                        style={{ borderRadius: '20px' }}
                    />
                </Col>
                <Col span={24}>
                    <Pagination
                        total={history.current.length}
                        showTotal={(total) => `Tổng ${total} đơn hàng`}
                        style={{ textAlign: "center", padding: 20 }}
                        onChange={handlePageTableClick}
                        current={currentPage}
                        defaultCurrent={1}
                        pageSize={pageSize}
                    />
                </Col>
            </Row>

        </Layout>
    )
}

export default HistoryPage