import React, { useState } from "react";
import {
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
  Form, message,
  Space,
} from "antd";
import { calculatePrice } from "../api/pricing";
import { useDispatch } from "react-redux";
import { setLoading } from "../app/loaderSlice";
import Loader from "./Loader";

const Calculator = () => {
  const [form] = Form.useForm();
  const [price, setPrice] = useState(null);
  const dispatch = useDispatch();

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const { Title, Text } = Typography;

    const onFinish = async (values) => {
      console.log("Calculation input:", values);
      // Call backend or calculate price here
      dispatch(setLoading(true));
      try{
        setPrice(null);
        const data = await calculatePrice(values);
        setPrice(data.totalPrice);
      }catch(error){
        console.error("Error calculating price:", error);
        message.error("Failed to calculate price.")
      }finally{
        dispatch(setLoading(false));
      }
    };

    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
        <Title level={3}>Pricing Calculator</Title>
        <Text type="secondary">
          Calculate the final fare based on distance, time, and waiting charges
        </Text>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          style={{ marginTop: "2rem" }}
        >
          <Form.Item
            name="distance"
            label="Distance (KM)"
            rules={[{ required: true, message: "Please enter distance" }]}
          >
            <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="time"
            label="Total Time (Hours)"
            rules={[{ required: true, message: "Please enter time" }]}
          >
            <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="waitingTime"
            label="Waiting Time (Minutes)"
            rules={[{ required: true, message: "Please enter waiting time" }]}
          >
            <InputNumber min={0} step={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="day"
            label="Day of Week"
            rules={[{ required: true, message: "Please select a day" }]}
          >
            <Select placeholder="Select day">
              {daysOfWeek.map((day) => (
                <Select.Option key={day} value={day}>
                  {day}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              Calculate Price
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  
};

export default Calculator;
