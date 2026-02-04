import React, { useState } from 'react';
import { Button, Input, Card, Row, Col, Statistic, Drawer } from 'antd';
import { Icon } from 'antd';
import { useStore } from '@/store';

function Home() {
  const [drawerVisible, setDrawerVisible] = useState(false);
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
        <Button
          type="primary"
          onClick={() => setDrawerVisible(true)}
          icon={<Icon type="menu" />}
          style={{ marginTop: '10px' }}
        >
          Open Drawer
        </Button>
      </Card>

      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card title="Counter (Zustand Store)">
            <Statistic value={count} style={{ marginBottom: '20px' }} />
            <Button
              type="primary"
              icon={<Icon type="plus-circle" />}
              onClick={incrementCount}
              style={{ marginRight: '10px' }}
            >
              Increment
            </Button>
            <Button
              danger
              icon={<Icon type="minus-circle" />}
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

      <Drawer
        title="Drawer Title"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <p>This is Ant Design Drawer content.</p>
        <p>You can add any content here!</p>
        <Button type="primary" onClick={() => setDrawerVisible(false)}>
          Close Drawer
        </Button>
      </Drawer>
    </div>
  );
}

export default Home;
