import { Button, Card, Checkbox, Col, Divider, Form, Image, InputNumber, Layout, Pagination, Rate, Row, Spin, Tabs, TabsProps, Typography, message } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import { GrRefresh } from 'react-icons/gr'
import { useForm } from 'antd/es/form/Form'
import { getAllCategoriesBooks, getListBooksWithPaginate } from '../../../service/bookApi'
import { useEffect, useState } from 'react';
import { IBooks } from '../../../types/book'
import { debounce } from 'lodash';
import './HomePage.scss'
import '../../../scss/custom-button.scss'
import { useNavigate } from 'react-router-dom'

const items: TabsProps['items'] = [
    {
        key: 'sort=-sold',
        label: `Phổ Biến`,
        children: ``,
    },
    {
        key: 'sort=-updatedAt',
        label: `Hàng Mới`,
        children: ``,
    },
    {
        key: 'sort=price',
        label: `Giá Thấp Đến Giá Cao`,
        children: ``,
    },
    {
        key: 'sort=-price',
        label: `Giá Cao Đến Giá Thấp`,
        children: ``,
    },
];

const Home = () => {
    const navigate = useNavigate()
    const [form] = useForm()
    const [listCategories, setListCategories] = useState<[]>([])
    const [listBooks, setListBooks] = useState<IBooks[]>([])
    const [loadings, setLoadings] = useState<boolean[]>([])
    const [queryBooks, setQueryBooks] = useState({ currentPage: 1, pageSize: 12, total: 0, filter: '', sortQuery: 'sort=-sold' })

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

    const onFinish = (values: any) => {
        console.log(values)
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let queryFilter = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if (values?.category?.length) {
                const cate = values?.category.join(',')
                queryFilter += `&category=${cate}`
            }
            setQueryBooks({ ...queryBooks, filter: queryFilter })
        }

        if (values?.range?.from === null || values?.range?.to === null) {
            message.warning('Vui lòng đầy đủ nhập khoảng giá!')
            setQueryBooks({ ...queryBooks, filter: '' })
        }
    }

    const handleChangeFilter = debounce((changedValues: any, values: any) => {
        if (changedValues.category) {
            const cate = values.category
            if (cate && cate.length > 0) {
                const mer = cate.join(',')
                console.log(mer)
                setQueryBooks({ ...queryBooks, filter: `category=${mer}` })
            } else {
                setQueryBooks({ ...queryBooks, filter: '' })
            }
        }
    }, 200)

    // Tab
    const onChangeTab = (key: string) => {
        setQueryBooks({ ...queryBooks, sortQuery: key })
    };
    // paginate
    const handlePageClick = (currentPage: number, pageSize: number) => {
        setQueryBooks({ ...queryBooks, currentPage: currentPage, pageSize: pageSize })
    }
    const handleRefresh = () => {
        form.resetFields()
        setQueryBooks({ ...queryBooks, filter: '' })
    }

    // convert url slug
    const nonAccentVietnamese = (str: string) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str: string) => {
        str = nonAccentVietnamese(str)
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        var to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleRedirectBook = (book: IBooks) => {
        const slug = convertSlug(book.mainText)
        navigate(`/book/${slug}?id=${book._id}`)
    }

    return (
        <>
            <Layout className="home-container">
                <Row gutter={[20, 20]} wrap={false}>
                    <Col flex='auto' md={4} sm={0} xs={0} className='home-left-sidebar'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                            <div >
                                <FilterOutlined
                                    style={{ color: '#ea4c89', marginRight: 10 }}

                                />
                                <Typography.Text strong>
                                    Bộ lọc tìm kiếm
                                </Typography.Text>
                            </div>
                            <GrRefresh
                                style={{ cursor: 'pointer' }}
                                onClick={handleRefresh}
                            />
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
                                    <Button style={{ width: '100%' }} className='btn-search' htmlType='submit'>
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
                        <Spin spinning={loadings[1]} tip='Loading...'>
                            <Layout style={{ backgroundColor: '#fff' }}>
                                <Row>
                                    <Tabs
                                        items={items}
                                        onChange={onChangeTab}
                                        className='home-tab'
                                    />
                                </Row>
                                <Row className='home-card'>
                                    {listBooks.map((item) => {
                                        return (
                                            <Card
                                                hoverable
                                                style={{ width: 200 }}
                                                bordered
                                                key={item._id}
                                                onClick={() => handleRedirectBook(item)}
                                            >
                                                <Image
                                                    alt="card"
                                                    style={{ width: '100%', height: '100%', border: '1px solid f0f0f0' }}
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`}
                                                    preview={false}
                                                />
                                                <div style={{ width: '100%' }}>
                                                    <Typography.Paragraph ellipsis={{ rows: 3, expandable: false }} className="card-content-title">
                                                        {item.mainText}
                                                    </Typography.Paragraph>
                                                    <div className='card-content-price'>{item.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                                                    <div className='rating'>
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                        <span>Đã bán : {item.sold}</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </Row>
                            </Layout>
                        </Spin>
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