import * as React from 'react';
import { Provider } from 'react-redux'
import store from '../../lib/createStore'
import Article from './article'
export interface AppProps { 
  activity_id: string
}

export default class AppComponent extends React.Component<AppProps, any> {
  render() {
    return (
      <Provider store={store}>
        <div className="container">
          <Article activity_id={parseInt(this.props.activity_id)} />
        </div>
      </Provider>
    );
  }
}
