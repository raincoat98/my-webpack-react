import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Home from '@/pages/Home';
import About from '@/pages/About';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#001529', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ color: 'white', margin: 0, flex: '0 0 auto' }}>My App</h1>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: '1 1 auto', marginLeft: '40px' }}>
            <Menu.Item key="1">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/about">About</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '20px' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          My Webpack React App ©2024
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
