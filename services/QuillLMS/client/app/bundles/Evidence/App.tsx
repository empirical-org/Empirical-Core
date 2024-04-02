import * as React from "react";
import { QueryClientProvider } from 'react-query';
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { DefaultReactQueryClient } from '../Shared';
import { route } from "./routes";
import { configureStore, initStore } from "./store/configStore";

const store = configureStore();
store.dispatch(initStore());
const queryClient = new DefaultReactQueryClient();

class App extends React.Component<{user: string}, {}> {
  public render(): JSX.Element {
    const { user } = this.props;
    return (
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <Provider store={store}>
          <HashRouter basename="/">
            <CompatRouter>
              {route(user)}
            </CompatRouter>
          </HashRouter>
        </Provider>
      </QueryClientProvider>
    );
  }
}

export default App;
