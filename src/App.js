import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RegisterPage from './components/register'
import HomePage from './components/home';

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={HomePage}/>
          <Route exact path='/register' component={RegisterPage}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
