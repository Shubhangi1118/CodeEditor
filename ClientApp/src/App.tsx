import React from 'react';
import Editor from './components/Editor';
import Participant from './components/Participant';
import Home from './components/Home';
import Layout from './components/Layout';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {
    return (
        <Layout>
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/Editor" component={Editor} />
                    <Route path="/Participant" component={Participant} />
                </Switch>

            </Router>
        </Layout>
    );
}

export default App;