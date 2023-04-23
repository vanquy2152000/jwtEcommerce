import * as XLSX from 'xlsx';
import Dragger from 'antd/es/upload/Dragger'
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons'
import { Modal, Pagination, Table, Typography, UploadProps, message, notification } from 'antd'
import { postAddListUser } from '../../../../../service/userApi';
import templateFile from './templateFile.xlsx?url'
import '../../../../../scss/custom-button.scss'
import '../../../../../scss/custom-table.scss'

type Props = {
    openModal: boolean
    handleSaveModalImportUser: () => void
    handleCloseModalImportUser: () => void
}

const ModalImportUser = ({ openModal, handleSaveModalImportUser, handleCloseModalImportUser }: Props) => {
    const [dataExcel, setDataExcel] = useState<any[]>([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const handleSaveModal = async () => {
        const data = dataExcel.map(item => {
            item.password = '123456'
            return item
        })
        console.log("check", data)

        const res = await postAddListUser(data)
        if (res && res.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess},Error:${res.data.countError}`,
                message: 'Upload thành công'
            })
            setDataExcel([])
            if (handleSaveModalImportUser) {
                handleSaveModalImportUser()
            }
        } else {
            notification.error({
                description: res.message,
                message: 'Đã có lỗi xảy ra',
            })
        }
    }

    const handleCloseModal = async () => {
        setDataExcel([])
        setPagination({
            current: 1,
            pageSize: 5,
            total: 0,
        });
        if (handleCloseModalImportUser) {
            handleCloseModalImportUser()
        }
    }

    function handlePageChange(page: any, pageSize: any) {
        setPagination({
            current: page,
            pageSize: pageSize,
            total: dataExcel.length,
        });
    }
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const currentPageData = dataExcel.slice(start, end);


    const dummyRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            // Gọi API upload file ở đây
            // const response = await callApiUploadFile(file);
            // onSuccess(response, file);
            setTimeout(() => {
                onSuccess('ok')
            }, 1000)
        } catch (err) {
            onError(err);
        }
    };

    const propsPayload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        customRequest: dummyRequest,
        onChange(info: any) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'removed') {
                setDataExcel([])
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file: File = info.fileList[0].originFileObj;
                    const reader: FileReader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e: ProgressEvent<FileReader>) {
                        const data: Uint8Array = new Uint8Array(reader.result as ArrayBuffer)
                        let workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
                        // find the name of your sheet in the workbook first
                        let sheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];

                        // convert to json format
                        const json: any[] = XLSX.utils.sheet_to_json(sheet, {
                            header: ['fullName', 'email', 'phone'],
                            range: 1 // skip header row
                        });
                        console.log(json)

                        if (json && json.length > 0) {
                            setDataExcel(json)
                            setPagination({
                                current: 1,
                                pageSize: 5,
                                total: json.length,
                            });
                        }
                    }
                    message.success(`${info.file.name} file uploaded successfully.`);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Modal
            title={<Typography.Title level={4}>Import data user</Typography.Title>}
            open={openModal}
            okText='Import data'
            cancelText='Hủy'
            okButtonProps={{
                disabled: dataExcel.length < 1,
                className: dataExcel.length < 1 ? "btn-disabled" : "btn-ok-modal",
            }}
            cancelButtonProps={{ className: 'btn-cancel-modal' }}
            onOk={handleSaveModal}
            onCancel={handleCloseModal}
            width={800}
            maskClosable={false}
        >
            <Dragger {...propsPayload} style={{ border: '1px dashed #ea4c89' }} showUploadList={dataExcel.length === 0 ? false : true} >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: '#ea4c89' }} />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv, .xls, .xlsx . Or
                    &nbsp;
                    <a
                        onClick={e => e.stopPropagation()}
                        href={templateFile}
                        download
                        id="download"
                    >
                        Download Sample File
                    </a>
                </p>
            </Dragger>

            <div style={{ marginTop: '20px' }}>
                <Table
                    bordered
                    rowKey={(record) => `key-${record.id}`}
                    dataSource={currentPageData}
                    title={() => <Typography.Text strong style={{ margin: 0 }}>Dữ liệu upload:</Typography.Text>}
                    columns={[
                        { dataIndex: 'fullName', title: 'Tên hiển thị' },
                        { dataIndex: 'email', title: 'Email' },
                        { dataIndex: 'phone', title: 'Số điện thoại' },
                    ]}
                    pagination={false}
                />
            </div>
            <Pagination
                style={{ marginTop: "50px", textAlign: "center" }}
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                defaultCurrent={1}
                onChange={handlePageChange}
                showTotal={(total) => `Tổng ${total} người dùng`}
            />

        </Modal>
    )
}

export default ModalImportUser