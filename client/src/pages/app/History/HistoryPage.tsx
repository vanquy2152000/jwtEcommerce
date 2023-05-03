import moment from 'moment'
import ReactJson from 'react-json-view'
import { Layout, Table, Tag, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { IHistories } from '../../../types/history'
import { useEffect, useState, useMemo } from 'react';
import { getHistoryOrder } from '../../../service/historyApi'
import './HistoryPage.scss'

type Props = {}

const HistoryPage = (props: Props) => {
    const [listHistoryOrders, setListHistoryOrders] = useState<IHistories[]>([])
    const [queryHistories, setQueryHistories] = useState({ currentPage: 1, pageSize: 5, total: 0 })


    const baseIndex = useMemo(() => {
        return (queryHistories.currentPage - 1) * queryHistories.pageSize
    }, [queryHistories.currentPage, queryHistories.pageSize])

    useEffect(() => {
        const fetchListHistories = async () => {
            const res = await getHistoryOrder()
            console.log(res)
            if (res && res.data) {
                setListHistoryOrders(res.data)
            }
        }
        fetchListHistories()
    }, [])
    console.log(listHistoryOrders)

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
                console.log(record)
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
                console.log(record)
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

    return (
        <Layout className='history-container'>
            <Table
                bordered
                title={() => (<Typography.Title level={5} style={{ margin: '0' }}>Lịch sử mua hàng</Typography.Title>)}
                rowKey={record => record._id}
                columns={columns}
                dataSource={listHistoryOrders}
                pagination={false}
                // loading={loadings[1]}
                className='custom-table'
                style={{ borderRadius: '20px' }}
            // onChange={handleTableChange}
            />
        </Layout>
    )
}

export default HistoryPage