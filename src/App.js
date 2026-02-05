import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Stepper from '@/pages/Stepper';
import ProductListDemo from '@/pages/ProductListDemo';
import { AboutProvider } from './context/AboutContext';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <AboutProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ background: '#001529', display: 'flex', alignItems: 'center', gap: '30px' }}>
            <h1 style={{ color: 'white', margin: 0 }}>My App</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
              <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
              <Link to="/stepper" style={{ color: 'white', textDecoration: 'none' }}>Stepper</Link>
              <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</Link>
            </div>
          </Header>
          <Content style={{ padding: '20px' }}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/stepper" component={Stepper} />
              <Route exact path="/products" component={ProductListDemo} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            My Webpack React App ©2024
          </Footer>
        </Layout>
      </Router>
    </AboutProvider>
  );
}

export default App;
