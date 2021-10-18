import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Layout from './components/Layout';
import View2 from './views/View2/View2';
import View1 from './views/View1/View1';
import toDoList from './views/toDoList/toDoList';
import './App.css';

const App:React.FC = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/' component={toDoList}/>
          <Route path='/View-1' component={View1}/>
          <Route path='/View-2' component={View2}/>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;