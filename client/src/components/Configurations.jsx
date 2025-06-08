import React, { useState, useEffect } from 'react';
import { 
  Table, Form,
  Button, 
  Tag, 
  Space, 
  Modal, 
  Input, 
  Switch, 
  Card, 
  Descriptions, 
  message, 
  Popconfirm,
  Drawer,
  Divider
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  PoweroffOutlined,
  CheckCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import { setLoading } from '../app/loaderSlice';
import { getAllConfigs, toggleActiveConfig, deleteConfig, updateConfig } from '../api/config';

// const { Option } = Select;

const Configurations = () => {
  const [form] = Form.useForm();
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.isLoading);
  
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const dayNames = {
    mon: 'Monday',
    tue: 'Tuesday', 
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
  };

  // Fetch configurations
  const fetchConfigs = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getAllConfigs();
      await new Promise((resolve) => setTimeout(resolve, 100));
        console.log('Existing configs:', response);
        setConfigs(response);
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  // Toggle active status
  const toggleActiveStatus = async (id) => {
    try {
      const response = await toggleActiveConfig(id);
      message.success('Status changed successfully');
      await fetchConfigs();
    } catch (error) {
      message.error(error.message);
    }
  };

  // Delete configuration
  const deleteExistingConfig = async (id) => {
    try {
      const response = await deleteConfig(id);
      message.success('Configuration deleted successfully');
      await fetchConfigs();
    } catch (error) {
      message.error(error.message);
    }
  };

  // Update configuration
  const handleUpdate = async (values) => {
  try {
    // Ensure we have the ID and clean data
    const updateData = {
      name: values.name,
      createdBy: values.createdBy,
      active: Boolean(values.active) // Ensure it's a boolean
    };

    const response = await updateConfig(editingConfig._id, updateData);
    message.success('Configuration updated successfully');
    setShowEditModal(false);
    setEditingConfig(null);
    form.resetFields();
    await fetchConfigs();
  } catch (error) {
    message.error(error.message);
  }
};

  // Show details
  const showDetails = (config) => {
    setSelectedConfig(config);
    setShowDetailsDrawer(true);
  };

  // Show edit modal
  const showEdit = (config) => {
  setEditingConfig({
    ...config,
    active: Boolean(config.active) // Ensure boolean
  });
  form.setFieldsValue({
    name: config.name,
    createdBy: config.createdBy,
    active: Boolean(config.active),
    dbp: config.dbp,
    dap: config.dap,
    tmf: config.tmf,
    wc: config.wc
  });
  setShowEditModal(true);
};

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-900">{text}</div>
          {record.active && (
            <Tag color="green" size="small" className="mt-1">
              <CheckCircleOutlined /> Active
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    },
    {
      title: 'Pricing Rules',
      key: 'rules',
      width: 200,
      render: (_, record) => (
        <div className="text-sm">
          <div>📅 Daily Pricing: {record.dbp?.length || 0} rules</div>
          <div>➕ Additional: {record.dap?.length || 0} rules</div>
          <div>⏰ Time Multiplier: {record.tmf?.length || 0} rules</div>
          <div>⏳ Waiting Charges: {record.wc?.length || 0} rules</div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={record.active ? 'green' : 'default'}>
          {record.active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEdit(record)}
            className="text-green-600 hover:text-green-800"
          />
          <Button
            type="text"
            icon={<PoweroffOutlined />}
            onClick={() => toggleActiveStatus(record._id)}
            className={record.active ? 'text-orange-600 hover:text-orange-800' : 'text-blue-600 hover:text-blue-800'}
          />
          <Popconfirm
            title="Delete Configuration"
            description="Are you sure you want to delete this configuration?"
            onConfirm={() => deleteExistingConfig(record._id)}
            okText="Yes"
            cancelText="No"
            disabled={record.active}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              disabled={record.active}
              className="text-red-600 hover:text-red-800 disabled:text-gray-400"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Existing Configurations</h1>
          <p className="text-gray-600">Refresh to see recently created configurations.</p>
        </div>

        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={configs}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} configurations`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Details Drawer */}
        <Drawer
          title="Configuration Details"
          placement="right"
          width={600}
          onClose={() => setShowDetailsDrawer(false)}
          open={showDetailsDrawer}
        >
          {selectedConfig && (
            <div className="space-y-6">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Name">{selectedConfig.name}</Descriptions.Item>
                <Descriptions.Item label="Created By">{selectedConfig.createdBy}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={selectedConfig.active ? 'green' : 'default'}>
                    {selectedConfig.active ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(selectedConfig.createdAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>

              <Card title="Distance Based Pricing" size="small">
                {selectedConfig.dbp?.map((item, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                    <strong>{dayNames[item.day]}:</strong> Up to {item.uptoKms} km - ₹{item.price}
                  </div>
                ))}
              </Card>

              <Card title="Distance Additional Pricing" size="small">
                {selectedConfig.dap?.map((item, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                    After {item.afterKms} km: ₹{item.pricePerKm} per km
                  </div>
                ))}
              </Card>

              <Card title="Time Multiplier Factors" size="small">
                {selectedConfig.tmf?.map((item, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                    {item.fromMinutes} - {item.toMinutes} minutes: {item.multiplier}x multiplier
                  </div>
                ))}
              </Card>

              <Card title="Waiting Charges" size="small">
                {selectedConfig.wc?.map((item, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                    After {item.afterMinutes} minutes: ₹{item.chargePerMinute} per minute
                  </div>
                ))}
              </Card>
            </div>
          )}
        </Drawer>

        {/* Edit Modal */}
        <Modal
          title="Edit Configuration"
          open={showEditModal}
          width={800}
          onCancel={() => {
            setShowEditModal(false);
            setEditingConfig(null);
            form.resetFields();
          }}
          footer={null}
        >
          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configuration Name *
                </label>
                <Input
                  value={editingConfig?.name || ''}
                  onChange={(e) => setEditingConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter configuration name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created By *
                </label>
                <Input
                  value={editingConfig?.createdBy || ''}
                  onChange={(e) => setEditingConfig(prev => ({ ...prev, createdBy: e.target.value }))}
                  placeholder="Enter creator name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active Status
                </label>
                <Switch
                  checked={editingConfig?.active || false}
                  onChange={(checked) => setEditingConfig(prev => ({ ...prev, active: checked }))}
                />
              </div>

              <Divider>Quick Edit - Basic Info Only</Divider>
              <div className="text-sm text-gray-600 mb-4">
                For detailed pricing rule edits, please use the main configuration form.
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button onClick={() => {
                  setShowEditModal(false);
                  setEditingConfig(null);
                }}>
                  Cancel
                </Button>
                <Button style={{backgroundColor: '#001529'}}
                  type="primary" 
                  onClick={() => handleUpdate({
                    id: editingConfig._id,
                    name: editingConfig.name,
                    createdBy: editingConfig.createdBy,
                    active: editingConfig.active || false
                  })}
                >
                  Update Configuration
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Configurations;