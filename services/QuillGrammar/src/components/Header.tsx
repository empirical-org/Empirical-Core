import * as React from "react";
import { Layout, Row } from "antd";
import { Link } from "react-router-dom";
import '../styles/Header.scss'

export const Header: React.StatelessComponent<{}> = () => {
    return (
      <Layout.Header style={{
          height: '60px',
          width: "100%",
          backgroundColor: "#00c2a2",
          padding: "0 30px"}}
      >
        <Row align="middle" justify="space-between" style={{height: '100%', maxWidth: '56em', margin: 'auto'}} type="flex">
          <img src="https://d2t498vi8pate3.cloudfront.net/assets/home-header-logo-8d37f4195730352f0055d39f7e88df602e2d67bdab1000ac5886c5a492400c9d.png" style={{ height: '25px' }} />
          <a href={process.env.EMPIRICAL_BASE_URL} style={{color: 'white'}}>Save & Exit</a>
        </Row>
      </Layout.Header>
    );
};
