import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Table, Button, Input, Space, Tag, message, Select, Modal, Form, Drawer, Descriptions, Spin } from 'antd';
import { SearchOutlined, FileTextOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Cài thêm thư viện này nếu chưa có (npm install dayjs)

const InvoiceManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
    const [searchText, setSearchText] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [invoiceDetail, setInvoiceDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [form] = Form.useForm();

    const fetchInvoices = async (page = 1, pageSize = 10, filter = "") => {
        setLoading(true);
        try {
            const backendPage = page - 1;
            const query = `page=${backendPage}&size=${pageSize}&sort=ngayThanhToan,desc${filter ? `&filter=${filter}` : ""}`; const res = await axiosClient.get(`/api/payments?${query}`);
            if (res.data && res.data.data) {
                const invoicesData = res.data.data.result;
                invoicesData.sort((a, b) => new Date(b.ngayThanhToan) - new Date(a.ngayThanhToan));
                setInvoices(invoicesData);
                setMeta(res.data.data.meta);
            }
        } catch (error) {
            message.error("Không thể tải danh sách hóa đơn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices(meta.page, meta.pageSize);
    }, []);

    const handleSearch = () => {
        // Tìm kiếm theo ID hóa đơn (ví dụ ID là số, nên cần parse chính xác)
        const filter = searchText ? `id:${searchText}` : "";
        fetchInvoices(1, meta.pageSize, filter);
    };

    const handleUpdateStatus = async (values) => {
        try {
            await axiosClient.put(`/api/payments/${editingInvoice.idHoaDon}/status?status=${values.trangThai}`);
            message.success("Cập nhật trạng thái thành công");
            setIsModalOpen(false);
            fetchInvoices(meta.page, meta.pageSize);
        } catch (error) {
            message.error("Cập nhật thất bại");
        }
    };
    const fetchInvoiceDetail = async (id) => {
        setLoadingDetail(true);
        setIsDrawerOpen(true); // Mở Drawer lên trước cho mượt, data load sau
        try {
            const res = await axiosClient.get(`/api/payments/${id}`);
            if (res.data && res.data.data) {
                setInvoiceDetail(res.data.data);
                console.log(res.data.data);
            }
        } catch (error) {
            message.error("Không thể tải chi tiết hóa đơn");
            setIsDrawerOpen(false);
        } finally {
            setLoadingDetail(false);
        }
    };
    const openEditModal = (invoice) => {
        setEditingInvoice(invoice);
        console.log(invoice);
        form.setFieldsValue({ trangThai: invoice.trangThai });
        setIsModalOpen(true);
    };

    const columns = [
        { title: 'Mã HĐ', dataIndex: 'idHoaDon', key: 'idHoaDon', width: 80, render: (idHoaDon) => <b>#{idHoaDon}</b> },
        {
            title: 'Khách hàng',
            key: 'khachHang',
            render: (_, record) => record.email || 'Khách vãng lai'
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'ngayThanhToan',
            key: 'ngayThanhToan',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'N/A'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'tongTien',
            key: 'tongTien',
            render: (tien) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tien || 0)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (status) => {
                let color = 'gold';
                if (status === 'DATHANHTOAN' || status === 'PAID') color = 'green';
                if (status === 'DAHUY' || status === 'CANCELLED') color = 'red';
                return <Tag color={color}>{status || 'Chờ xử lý'}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {/* Nút xem chi tiết (bạn có thể phát triển thêm Drawer để show danh sách ghế) */}
                    <Button icon={<EyeOutlined />}
                        onClick={() => fetchInvoiceDetail(record.idHoaDon)}
                        title="Xem chi tiết" />
                    {/* Nút cập nhật trạng thái */}
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                        title="Đổi trạng thái"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: 'var(--gold)', marginBottom: '20px' }}>
                <FileTextOutlined /> QUẢN LÝ HÓA ĐƠN
            </h2>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <Input
                    placeholder="Nhập mã hóa đơn cần tìm..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{ width: 300 }}
                    suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
                />
                <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
            </div>

            <Table
                columns={columns}
                dataSource={invoices}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    onChange: (page, pageSize) => fetchInvoices(page, pageSize)
                }}
            />

            {/* Modal Cập nhật trạng thái */}
            <Modal
                title={`Cập nhật Hóa đơn #${editingInvoice?.idHoaDon}`}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
                    <Form.Item
                        label="Trạng thái đơn hàng"
                        name="trangThai"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            {/* <Select.Option value="Chờ thanh toán">Chờ thanh toán</Select.Option> */}
                            <Select.Option value="DATHANHTOAN">Đã thanh toán</Select.Option>
                            <Select.Option value="DAHUY">Đã hủy</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Drawer
                title={<span style={{ color: 'var(--gold)' }}>Chi tiết Hóa đơn #{invoiceDetail?.idHoaDon}</span>}
                placement="right"
                size="large"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
            >
                {loadingDetail ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
                ) : invoiceDetail ? (
                    <div>
                        {/* Cụm thông tin khách hàng & Giao dịch */}
                        <Descriptions title="Thông tin giao dịch" bordered column={1} size="small" style={{ marginBottom: '20px' }}>
                            <Descriptions.Item label="Khách hàng">{invoiceDetail.tenKhachHang}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={invoiceDetail.trangThai === 'Đã thanh toán' ? 'green' : 'gold'}>
                                    {invoiceDetail.trangThai}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">
                                <strong style={{ color: 'red' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoiceDetail.tongTien || 0)}
                                </strong>
                            </Descriptions.Item>
                            <Descriptions.Item label="Phương thức thanh toán">
                                {invoiceDetail.phuongThucThanhToan}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Cụm thông tin vé xem phim */}
                        <Descriptions title="Thông tin vé đặt" bordered column={1} size="small">
                            <Descriptions.Item label="Tên phim"><strong>{invoiceDetail.tenPhim || 'N/A'}</strong></Descriptions.Item>
                            <Descriptions.Item label="Rạp chiếu">{invoiceDetail.rapChieu || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Phòng chiếu">{invoiceDetail.phongChieu || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Suất chiếu">{invoiceDetail.gioChieu || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Vị trí ghế">
                                {invoiceDetail.danhSachGhe?.length > 0
                                    ? invoiceDetail.danhSachGhe.map((ghe, index) => <Tag color="blue" key={index}>{ghe}</Tag>)
                                    : 'Không có thông tin'}
                            </Descriptions.Item>

                        </Descriptions>
                    </div>
                ) : (
                    <p>Không có dữ liệu.</p>
                )}
            </Drawer>
        </div>
    );
};

export default InvoiceManagement;