
import React, { useContext } from 'react';
import { Card, List } from 'antd';
import { Icon } from 'antd';
import { AboutContext } from '@/context/AboutContext';

function About() {
  const { features, description, features_list } = useContext(AboutContext);

  return (
    <Card title={description.title}>
      <h3>{description.subtitle}</h3>

      <h2 style={{ marginTop: '20px' }}>Tech Stack</h2>
      <List
        dataSource={features}
        renderItem={(item) => (
          <List.Item>
            <Icon type="check-circle" style={{ color: '#52c41a', marginRight: '10px' }} />
            {item}
          </List.Item>
        )}
      />

      <h2 style={{ marginTop: '30px' }}>Features</h2>
      <ul>
        {features_list.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
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
