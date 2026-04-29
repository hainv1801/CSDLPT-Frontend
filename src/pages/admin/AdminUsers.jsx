import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Table, Button, Input, Space, Tag, Popconfirm, message, Select, Modal, Form } from 'antd';
import { SearchOutlined, DeleteOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const fetchUsers = async (page = 1, pageSize = 10, filter = "") => {
    setLoading(true);
    try {
      const backendPage = page - 1;
      const query = `page=${backendPage}&size=${pageSize}${filter ? `&filter=${filter}` : ""}`;
      const res = await axiosClient.get(`/api/v1/users?${query}`);
      if (res.data && res.data.data) {
        setUsers(res.data.data.result);
        setMeta(res.data.data.meta);
      }
    } catch (error) {
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(meta.page, meta.pageSize);
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/api/v1/users/${id}`);
      message.success("Xóa người dùng thành công");
      fetchUsers(meta.page, meta.pageSize);
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  const handleSearch = () => {
    const filter = searchText ? `hoTen ~ '${searchText}' or email ~ '${searchText}'` : "";
    fetchUsers(1, meta.pageSize, filter);
  };
  const handleUpdateRole = async (values) => {
    try {
      // Gửi request PUT với query parameter `role`
      await axiosClient.put(`/api/v1/users/${editingUser.id}/role?role=${values.vaiTro}`);
      message.success("Cập nhật vai trò thành công");
      setIsModalOpen(false);
      fetchUsers(meta.page, meta.pageSize); // Tải lại danh sách
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({ vaiTro: user.vaiTro });
    setIsModalOpen(true);
  };
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Họ Tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'sdt', key: 'sdt' },
    {
      title: 'Vai Trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      render: (role) => (
        <Tag color={role === 'QUANLY' ? 'volcano' : 'geekblue'}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'var(--gold)', marginBottom: '20px' }}>
        <UserOutlined /> QUẢN LÝ NGƯỜI DÙNG
      </h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Input
          placeholder="Tìm theo tên hoặc email..."
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
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          current: meta.page,
          pageSize: meta.pageSize,
          total: meta.total,
          onChange: (page, pageSize) => fetchUsers(page, pageSize)
        }}
        className="admin-table"
      />
      <Modal
        title="Cập nhật vai trò"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateRole}>
          <Form.Item label="Người dùng">
            <Input value={editingUser?.hoTen} disabled />
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="vaiTro"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select>
              <Select.Option value="KHACHHANG">Khách hàng</Select.Option>
              <Select.Option value="NHANVIEN">Nhân viên</Select.Option>
              <Select.Option value="QUANLY">Quản lý</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;