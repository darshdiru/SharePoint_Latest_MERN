import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import SelectDataSource from './SelectDataSource'
import Form from './Form'
import BoxForm from './BoxForm'
import OnDemandSync from './OnDemandSync'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={SelectDataSource} />
          <Route path="/sharepoint" component={Form} />
          <Route path="/box" component={BoxForm} />
          <Route path="/ondemandsync-page" component={OnDemandSync} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
