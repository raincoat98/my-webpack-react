import React from 'react';
import { Button, Input, Card, Row, Col, Statistic } from 'antd';
import { PlusOutline, MinusOutline } from '@ant-design/icons';
import { useStore } from '@/store';

function Home() {
  const count = useStore((state) => state.count);
  const message = useStore((state) => state.message);
  const incrementCount = useStore((state) => state.incrementCount);
  const decrementCount = useStore((state) => state.decrementCount);
  const setMessage = useStore((state) => state.setMessage);
  const resetCount = useStore((state) => state.resetCount);

  return (
    <div>
      <Card title="Welcome to Home" style={{ marginBottom: '20px' }}>
        <p>This is a React 16 app with Webpack, Babel, React Router, Ant Design 3.x, and Zustand.</p>
      </Card>

      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card title="Counter (Zustand Store)">
            <Statistic value={count} style={{ marginBottom: '20px' }} />
            <Button
              type="primary"
              icon={<PlusOutline />}
              onClick={incrementCount}
              style={{ marginRight: '10px' }}
            >
              Increment
            </Button>
            <Button
              danger
              icon={<MinusOutline />}
              onClick={decrementCount}
              style={{ marginRight: '10px' }}
            >
              Decrement
            </Button>
            <Button onClick={resetCount}>Reset</Button>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Message">
            <Input
              placeholder="Enter a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <p><strong>Current Message:</strong> {message}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
