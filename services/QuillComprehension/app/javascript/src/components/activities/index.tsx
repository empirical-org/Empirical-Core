import * as React from 'react';
import Article from './article'
export interface AppProps {
}

export default class AppComponent extends React.Component<AppProps, any> {
  render() {
    return (
      <div className="container">
        <Article activity_id={1} />
      </div>
    );
  }
}
