import React from 'react';
import { Route, Link } from "react-router-dom";

export function Topics({ match }) {
    return (
        <div>
            <h2>Topics</h2>
            <div>
                <pre>{ JSON.stringify(process.env, null, 2) }</pre>
            </div>            
            <ul>
                <li>
                    <Link to={`${match.url}/rendering`}>Rendering with React</Link>
                </li>
                <li>
                    <Link to={`${match.url}/components`}>Components</Link>
                </li>
                <li>
                    <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
                </li>
            </ul>

            <Route path={`${match.path}/:topicId`} component={Topic} />
            <Route
                exact
                path={match.path}
                render={() => <h3>Please select a topic.</h3>}
            />
        </div>
    );
}

export function Topic({ match }) {
    return (
        <div>
            <h3>{match.params.topicId}</h3>
        </div>
    );
}