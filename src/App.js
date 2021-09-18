import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RegisterPage from './components/register';

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/register' component={RegisterPage}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
