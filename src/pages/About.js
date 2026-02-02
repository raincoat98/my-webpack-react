import React from 'react';
import { Card, List } from 'antd';
import { CheckCircleOutline } from '@ant-design/icons';

function About() {
  const features = [
    'React 16',
    'Webpack 5',
    'Babel 7',
    'Ant Design 3.x',
    'React Router v5',
    'Zustand',
  ];

  return (
    <Card title="About This Project">
      <h2>Tech Stack</h2>
      <List
        dataSource={features}
        renderItem={(item) => (
          <List.Item>
            <CheckCircleOutline style={{ color: '#52c41a', marginRight: '10px' }} />
            {item}
          </List.Item>
        )}
      />

      <h2 style={{ marginTop: '30px' }}>Features</h2>
      <ul>
        <li>Webpack bundler with dev server</li>
        <li>Babel transpiler for modern JavaScript</li>
        <li>React Router for client-side routing</li>
        <li>Ant Design 3.x UI components</li>
        <li>Zustand for state management</li>
      </ul>

      <h2 style={{ marginTop: '30px' }}>Getting Started</h2>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        yarn install
        yarn dev
      </pre>
    </Card>
  );
}

export default About;
