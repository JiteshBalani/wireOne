import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Switch,
  message,
  Space,
  Collapse,
  Tag
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, SaveOutlined, ClearOutlined } from '@ant-design/icons';
import { createConfig } from '../api/config';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const NewConfig = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    { key: 'wed', label: 'Wednesday' },
    { key: 'thu', label: 'Thursday' },
    { key: 'fri', label: 'Friday' },
    { key: 'sat', label: 'Saturday' },
    { key: 'sun', label: 'Sunday' }
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Transform the form data to match backend expectations
      const configData = {
        name: values.name,
        createdBy: values.createdBy || 'Admin',
        active: values.active || false,
        dbp: daysOfWeek.map(day => ({
          day: day.key,
          uptoKms: values[`dbp_${day.key}_uptoKms`],
          price: values[`dbp_${day.key}_price`]
        })),
        dap: [{
          afterKms: values.dap_afterKms,
          pricePerKm: values.dap_pricePerKm
        }],
        tmf: values.tmf || [],
        wc: [{
          afterMinutes: values.wc_afterMinutes,
          chargePerMinute: values.wc_chargePerMinute
        }]
      };

      console.log('Config data to send:', configData);
      
      const result = await createConfig(configData);
      
      message.success('Configuration created successfully!');
      form.resetFields();
      
    } catch (error) {
      console.error('Error creating config:', error);
      message.error('Failed to create configuration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
    message.info('Form reset');
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={3}>Create New Pricing Configuration</Title>
          <Text type="secondary">
            Define pricing rules for distance, time, and waiting charges
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            active: false,
            dap_afterKms: 0,
            wc_afterMinutes: 5,
            tmf: [{ fromMinutes: 0, toMinutes: 60, multiplier: 1 }]
          }}
        >
          {/* Basic Information */}
          <Card size="small" title="Basic Information" style={{ marginBottom: '16px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Configuration Name"
                  rules={[{ required: true, message: 'Please enter configuration name' }]}
                >
                  <Input placeholder="e.g., Standard Pricing, Weekend Rates" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="createdBy"
                  label="Created By"
                  rules={[{ required: true, message: 'Please enter creator name' }]}
                >
                  <Input placeholder="Admin" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="active" label="Set as Active" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Distance Based Pricing */}
          <Card size="small" title="Distance Based Pricing (DBP)" style={{ marginBottom: '16px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              Set base pricing for each day of the week
            </Text>
            <Row gutter={[16, 16]}>
              {daysOfWeek.map(day => (
                <Col span={12} key={day.key}>
                  <Card size="small" style={{ backgroundColor: '#f9f9f9' }}>
                    <Tag color="blue" style={{ marginBottom: '8px' }}>{day.label}</Tag>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item
                          name={`dbp_${day.key}_uptoKms`}
                          label="Up to KMs"
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <InputNumber
                            min={0}
                            step={0.1}
                            style={{ width: '100%' }}
                            placeholder="e.g., 5"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={`dbp_${day.key}_price`}
                          label="Price (₹)"
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <InputNumber
                            min={0}
                            step={0.1}
                            style={{ width: '100%' }}
                            placeholder="e.g., 50"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Distance Additional Pricing */}
          <Card size="small" title="Distance Additional Pricing (DAP)" style={{ marginBottom: '16px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              Pricing for distance beyond the base kilometers
            </Text>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="dap_afterKms"
                  label="After KMs"
                  rules={[{ required: true, message: 'Please enter after KMs' }]}
                >
                  <InputNumber
                    min={0}
                    step={0.1}
                    style={{ width: '100%' }}
                    placeholder="e.g., 5"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dap_pricePerKm"
                  label="Price per KM (₹)"
                  rules={[{ required: true, message: 'Please enter price per KM' }]}
                >
                  <InputNumber
                    min={0}
                    step={0.1}
                    style={{ width: '100%' }}
                    placeholder="e.g., 12"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Time Multiplier Factors */}
          <Card size="small" title="Time Multiplier Factors (TMF)" style={{ marginBottom: '16px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              Apply multipliers based on ride duration
            </Text>
            <Form.List name="tmf">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} align="middle" style={{ marginBottom: '8px' }}>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'fromMinutes']}
                          label="From Minutes"
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'toMinutes']}
                          label="To Minutes"
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'multiplier']}
                          label="Multiplier"
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label=" ">
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                          >
                            Remove
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Time Multiplier
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          {/* Waiting Charges */}
          <Card size="small" title="Waiting Charges (WC)" style={{ marginBottom: '24px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              Charges applied for waiting time
            </Text>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="wc_afterMinutes"
                  label="Free Waiting (Minutes)"
                  rules={[{ required: true, message: 'Please enter free waiting time' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="e.g., 5"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="wc_chargePerMinute"
                  label="Charge per Minute (₹)"
                  rules={[{ required: true, message: 'Please enter charge per minute' }]}
                >
                  <InputNumber
                    min={0}
                    step={0.1}
                    style={{ width: '100%' }}
                    placeholder="e.g., 2"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Action Buttons */}
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
              >
                Create Configuration
              </Button>
              <Button
                onClick={onReset}
                icon={<ClearOutlined />}
                size="large"
              >
                Reset Form
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NewConfig;