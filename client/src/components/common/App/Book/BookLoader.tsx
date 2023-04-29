import { Col, Layout, Row, Skeleton } from 'antd'

const BookLoader = () => {
    return (
        <Layout >
            <Row gutter={[20, 20]}>
                <Col md={10} sm={0} xs={0}>
                    <Skeleton.Input
                        active={true}
                        block={true}
                        style={{ width: '100%', height: 350, marginBottom: 10 }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                        <Skeleton.Image active={true} />
                        <Skeleton.Image active={true} />
                        <Skeleton.Image active={true} />
                    </div>
                </Col>

                <Col md={14} sm={24}>
                    <Col md={0} sm={24} xs={24}>
                        <Skeleton.Input
                            active={true}
                            block={true}
                            style={{ width: '100%', height: 350, marginBottom: 10 }}
                        />
                    </Col>
                    <Col span={24} style={{ display: 'flex', lineHeight: 2, flexDirection: 'column', gap: 10 }}>
                        <Skeleton
                            paragraph={{ rows: 3 }}
                            active={true}
                        />
                        <Skeleton
                            paragraph={{ rows: 2 }}
                            active={true}
                        />
                        <br />
                        <div style={{ display: 'flex', gap: 20, marginTop: 20, overflow: 'hidden' }}>
                            <Skeleton.Button active={true} style={{ width: '100%' }} />
                            <Skeleton.Button active={true} style={{ width: '100%' }} />
                        </div>
                    </Col>
                </Col>
            </Row>
        </Layout>
    )
}

export default BookLoader