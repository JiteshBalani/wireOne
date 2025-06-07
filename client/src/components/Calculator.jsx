import React, { useState } from "react";
import {
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
  Form,
  message,
  Space,
} from "antd";
import { calculatePrice } from "../api/pricing";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../app/loaderSlice";
import Loader from "./Loader";
import TailwindLoader from "./TailwindLoader";

const Calculator = () => {
  const [form] = Form.useForm();
  const [price, setPrice] = useState(null);
  const [priceDetails, setPriceDetails] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.isLoading);

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
    dispatch(setLoading(true));
    try {
      setPriceDetails(null);
      setPrice(null);
      const data = await calculatePrice(values);
      await new Promise((resolve) => setTimeout(resolve, 5000)); 
      setPriceDetails(data);
      setPrice(data.totalPrice);
    } catch (error) {
      console.error("Error calculating price:", error);
      message.error("Failed to calculate price.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  console.log(price);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "1rem" }}>
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
          name="distanceKms" // Changed from "distance"
          label="Distance (KM)"
          rules={[{ required: true, message: "Please enter distance" }]}
        >
          <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="rideMinutes" // Changed from "time"
          label="Total Time (Minutes)"
          rules={[{ required: true, message: "Please enter time" }]}
        >
          <InputNumber min={1} step={0.1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="waitingMinutes" // Changed from "waitingTime"
          label="Waiting Time (Minutes)"
          rules={[{ required: true, message: "Please enter waiting time" }]}
        >
          <InputNumber min={0} step={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="rideDay" // Changed from "day"
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
          <Button style={{backgroundColor: '#001529'}} type="primary" htmlType="submit" block size="large">
            Calculate Price
          </Button>
        </Form.Item>
      </Form>
      {loading && <TailwindLoader/>}
      {priceDetails && priceDetails.details && (
        <div
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: "10px",
            padding: "1.5rem",
            marginTop: "2rem",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Total Fare
            </Title>
            <div
              style={{
                backgroundColor: "#001529",
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                fontWeight: "bold",
              }}
            >
              ₹{priceDetails.totalPrice}
            </div>
          </div>

          <Text type="secondary">
            Using configuration: {priceDetails.configUsed}
          </Text>

          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Distance Base Price</span>
              <span>₹{priceDetails.details.basePrice || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Additional Distance</span>
              <span>₹{priceDetails.details.additionalDistance || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Time Multiplier</span>
              <span>₹{priceDetails.details.timeCharges || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Waiting Charges</span>
              <span>₹{priceDetails.details.waitingCharges || 0}</span>
            </div>
            <div
              style={{
                borderTop: "1px solid #f0f0f0",
                marginTop: "1rem",
                paddingTop: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <span>Total</span>
              <span>₹{priceDetails.totalPrice?.toFixed(2) || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
