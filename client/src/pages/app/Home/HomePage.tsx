import { Button, Card, Checkbox, Col, Divider, Form, InputNumber, Layout, Pagination, Rate, Row, Tabs, TabsProps, Typography } from 'antd'
import './HomePage.scss'
import { FilterOutlined } from '@ant-design/icons'
import { GrRefresh } from 'react-icons/gr'
import { useForm } from 'antd/es/form/Form'
import { getAllCategoriesBooks, getListBooksWithPaginate } from '../../../service/bookApi'
import { useEffect, useState } from 'react';
import '../../../scss/custom-button.scss'
import { IBooks } from '../../../types/book'

const items: TabsProps['items'] = [
    {
        key: '1',
        label: `Phổ Biến`,
        children: ``,
    },
    {
        key: '2',
        label: `Hàng Mới`,
        children: ``,
    },
    {
        key: '3',
        label: `Giá Thấp Đến Giá Cao`,
        children: ``,
    },
    {
        key: '4',
        label: `Giá Cao Đến Giá Thấp`,
        children: ``,
    },
];

const Home = () => {
    const [form] = useForm()
    const [listCategories, setListCategories] = useState<[]>([])
    const [listBooks, setListBooks] = useState<IBooks[]>([])
    const [loadings, setLoadings] = useState<boolean[]>([])
    const [queryBooks, setQueryBooks] = useState({ currentPage: 1, pageSize: 12, total: 0, filter: '', sortQuery: 'sort=-updatedAt' })

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

    useEffect(() => {
        const fetchListCategories = async () => {
            const res = await getAllCategoriesBooks()
            if (res && res.data) {
                setListCategories(res.data)
            }
        }
        fetchListCategories()
    }, [])

    useEffect(() => {
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
        fetchListBooks()
    }, [queryBooks.currentPage, queryBooks.pageSize, queryBooks.filter, queryBooks.sortQuery])

    console.log(listBooks)

    const onFinish = (values: any) => {
        console.log(values)
    }

    const handleChangeFilter = (changedValues: any, values: any) => {

    }

    // Tab
    const onChange = (key: string) => {
        console.log(key);
    };
    // paginate
    const handlePageClick = (currentPage: number, pageSize: number) => {
        setQueryBooks({ ...queryBooks, currentPage: currentPage, pageSize: pageSize })
    }
    return (
        <>
            <Layout className="home-container">
                <Row gutter={[20, 20]} wrap={false}>
                    <Col flex='auto' md={4} sm={0} xs={0} className='home-left-sidebar'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                            <div >
                                <FilterOutlined style={{ color: '#ea4c89', marginRight: 10 }} />
                                <Typography.Text strong>
                                    Bộ lọc tìm kiếm
                                </Typography.Text>
                            </div>
                            <GrRefresh />
                        </div>
                        <Divider style={{ border: '1px solid #f0f0f0' }} />
                        <Form
                            form={form}
                            onFinish={onFinish}
                            onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                        >
                            <Form.Item
                                label={<Typography.Text strong>Danh mục sản phẩm</Typography.Text>}
                                name='category'
                                labelCol={{ span: 24 }}
                            >
                                <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {listCategories.map((value) => (
                                        <Row key={value}>
                                            <Col span={24}>
                                                <Checkbox value={value}>{value}</Checkbox>
                                            </Col>
                                        </Row>
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>
                            <Divider style={{ border: '1px solid #f0f0f0' }} />
                            <Form.Item
                                label={<Typography.Text strong>Khoảng giá</Typography.Text>}
                                labelCol={{ span: 24 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Form.Item name={['range', 'from']}>
                                        <InputNumber
                                            min={0}
                                            name='from'
                                            placeholder='đ TỪ'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                    <span>-</span>
                                    <Form.Item name={['range', 'to']}>
                                        <InputNumber
                                            min={0}
                                            name='to'
                                            placeholder="đ ĐẾN"
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Button style={{ width: '100%' }} className='btn-search'>
                                        Áp dụng
                                    </Button>
                                </div>
                            </Form.Item>
                            <Divider style={{ border: '1px solid #f0f0f0' }} />
                            <Form.Item
                                label={<Typography.Text strong>Đánh giá</Typography.Text>}
                                labelCol={{ span: 24 }}
                                name='rate'
                            >
                                <Rate defaultValue={5} disabled />
                                <div>
                                    <Rate defaultValue={4} disabled />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate defaultValue={3} disabled />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate defaultValue={2} disabled />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate defaultValue={1} disabled />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col md={20} xs={24} className='home-right-content'>
                        <Row>
                            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                        </Row>
                        <Row className='home-card'>
                            {listBooks.map((item) => {
                                return (
                                    <Card
                                        hoverable
                                        style={{ width: 200 }}
                                        cover={
                                            <img
                                                alt="card"
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`}
                                            />
                                        }
                                        key={item._id}
                                    >
                                        <div>
                                            <div>{item.mainText}</div>
                                            <div>{item.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                                            <div className='rating'>
                                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                <span>{item.sold}</span>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </Row>
                        <Divider />
                        <div style={{ justifyContent: "center", alignItems: "center" }}>
                            <Pagination
                                total={queryBooks.total}
                                showSizeChanger
                                showQuickJumper
                                showTotal={(total) => `Total ${total} items`}
                                pageSizeOptions={[5, 10, 15, 20]}
                                style={{ textAlign: "center" }}
                                onChange={handlePageClick}
                                current={queryBooks.currentPage}
                                defaultCurrent={1}
                                defaultPageSize={queryBooks.pageSize}
                            />
                        </div>
                    </Col>
                </Row >
            </Layout >
        </>
    )
}

export default Home