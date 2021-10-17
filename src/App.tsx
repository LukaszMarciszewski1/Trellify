import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Layout from './components/Layout';
import addTask from './views/addTask/addTask';
import doneTask from './views/doneTask/doneTask';
import toDoTask from './views/toDoTask/toDoTask';
import './App.css';

const App:React.FC = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/' component={toDoTask}/>
          <Route path='/zrobione' component={doneTask}/>
          <Route path='/dodaj-zadanie' component={addTask}/>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;