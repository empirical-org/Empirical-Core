import * as React from "react";
import { Card } from "antd";

class HomePage extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
          <Card bordered style={{ margin: "16px 16px"}} title="Hello React & Antd">
            <p>Happy coding!</p>
          </Card>
        );
    }
}

export default HomePage;
