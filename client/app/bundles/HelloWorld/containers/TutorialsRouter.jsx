import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import TutorialIndex from '../components/tutorials/TutorialIndex'

export default React.createClass({
	render: function() {
		return (
			<Router Router history={browserHistory}>
        <Route path="/tutorials" component={TutorialIndex}>
					<IndexRoute component={TutorialIndex}/>
					<Route path=":tool" component={TutorialIndex}/>
					<Route path=":tool/:slideNumber" component={TutorialIndex}/>
        </Route>
			</Router>
		);
	}
});
