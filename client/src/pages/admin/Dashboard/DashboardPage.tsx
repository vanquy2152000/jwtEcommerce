import { Card, Col, Row, Statistic } from 'antd'
import CountUp from 'react-countup';
import { useState, useEffect } from 'react';
import { getDashboard } from '../../../service/dashboardApi';
import AppHelmet from '../../../components/common/Helmet/AppHelmet';


const DashboardPage = () => {
  const [dataDashboard, setDataDashboard] = useState({ countOrder: 0, countUser: 0 })
  const formatter = (value: any) => <CountUp end={value} separator=',' />

  useEffect(() => {
    const fetchDataDashboard = async () => {
      const res = await getDashboard()
      if (res && res.data) {
        setDataDashboard(res.data)
      }
    }
    fetchDataDashboard()
  }, [])

  return (
    <>
      <AppHelmet title="Dashboard" />
      <Row gutter={[40, 40]}>
        <Col span={12}>
          <Card title="" bordered={false}>
            <Statistic
              title='Tổng người dùng'
              value={dataDashboard.countUser ?? 0}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="" bordered={false}>
            <Statistic
              title='Tổng đơn hàng'
              value={dataDashboard.countOrder ?? 0}
              formatter={formatter}
            />
          </Card>

        </Col>
      </Row>
    </>
  )
}

export default DashboardPage