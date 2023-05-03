import ViewOrder from "../../../components/common/App/Order/ViewOrder"
import { useState } from 'react';
import { Button, Result, Steps } from "antd"
import { SmileOutlined } from "@ant-design/icons";
import './OrderPage.scss'
import '../../../scss/custom-button.scss'
import BookPage from "../../admin/Book/BookPage";
import PaymentOrder from "../../../components/common/App/Order/PaymentOrder";


const Order = () => {
  const [currentStep, setCurrentStep] = useState<number>(0)

  return (
    <div style={{ background: '#efefef', padding: '20px 0' }}>
      <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div className='order-steps'>
          <Steps
            size="small"
            current={currentStep}
            items={[
              {
                title: 'Đơn hàng',
              },
              {
                title: 'Đặt hàng',
              },
              {
                title: 'Thanh toán',
              },
            ]}
          />
        </div>
        {
          currentStep === 0 && <ViewOrder setCurrentStep={setCurrentStep} />
        }
        {
          currentStep === 1 && <PaymentOrder setCurrentStep={setCurrentStep} />
        }
        {
          currentStep === 2 &&
          <Result
            icon={<SmileOutlined style={{ color: '#ea4c89' }} />}
            title='Đơn hàng đã được đặt thành công!'
            extra={<Button htmlType="button" className='btn-history'>Xem Lịch Sử</Button>}
            style={{ backgroundColor: '#fff' }}
          />
        }
      </div>
    </div >
  )
}

export default Order 