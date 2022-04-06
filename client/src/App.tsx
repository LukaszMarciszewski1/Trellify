import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Layout from './components/Layout';
import TasksPage from './views/TasksPage/TasksPage';
import View2 from './views/View2/View2';
import View3 from './views/View3/View3';
import View4 from './views/View4/View4';
import Calculator from './views/Calculator/Calculator';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/' component={TasksPage} />
          <Route path='/calculator' component={Calculator} />
          <Route path='/View-2' component={View2} />
          <Route path='/View-3' component={View3} />
          <Route path='/View-4' component={View4} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;