import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RegisterPage from './components/register';
import HomePage from './pages/home';

window.api.receive("return-repo-resources", (response) => {
  console.log(response);
});

window.api.send("get-repo-resources", {});

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/register' component={RegisterPage}/>
          <Route exact path='/*' component={HomePage}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
