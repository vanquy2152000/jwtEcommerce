import { Button, Col, Form, Input, Row, theme } from 'antd'
import { RiSearchLine } from 'react-icons/ri'
import { MdOutlineClear } from 'react-icons/md'
import '../../../../scss/custom-button.scss'

type Props = {
    actionEnum: string
    handleSearch: (query: string) => void
    handleClear: () => void
}

const InputSearch = ({ actionEnum, handleSearch, handleClear }: Props) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        let query = ''
        if (actionEnum === 'USER') {
            if (values.fullName) {
                query += `&fullName=/${values.fullName}/i`
            }
            if (values.email) {
                query += `&email=/${values.email}/i`
            }
            if (values.phone) {
                query += `&phone=/${values.phone}/i`
            }
            if (query) {
                handleSearch(query)
            }
        }
        if (actionEnum === 'BOOK') {
            if (values.mainText) {
                query += `&mainText=/${values.mainText}/i`
            }
            if (values.author) {
                query += `&author=/${values.author}/i`
            }
            if (values.category) {
                query += `&category=/${values.category}/i`
            }
            if (query) {
                handleSearch(query)
            }

        }
    }

    const handleClearSearch = () => {
        form.resetFields()
        handleClear()
    }

    return (
        <Form
            form={form}
            name="advanced_search"
            onFinish={onFinish}
        >
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={actionEnum === 'USER' ? 'fullName' : 'mainText'}
                        label={actionEnum === 'USER' ? 'Name' : 'Tên sách'}
                    >
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={actionEnum === 'USER' ? 'email' : 'author'}
                        label={actionEnum === 'USER' ? 'Email' : 'Tên tác giả'}
                    >
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={actionEnum === 'USER' ? 'phone' : 'category'}
                        label={actionEnum === 'USER' ? 'Số điện thoại' : 'Thể loại'}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col span={1} offset={20} style={{ marginRight: '50px' }} >
                    <Button htmlType='submit' icon={<RiSearchLine />} className="btn-search">
                        Search
                    </Button>
                </Col>
                <Col span={1} >
                    <Button icon={<MdOutlineClear />} onClick={handleClearSearch} className="btn-clear" type="dashed">
                        Clear
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default InputSearch