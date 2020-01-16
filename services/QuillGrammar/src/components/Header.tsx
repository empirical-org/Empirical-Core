import * as React from "react";
import { Layout, Row } from "antd";
import { Link } from "react-router-dom";
import '../styles/Header.scss'

const quillLogoSrc = `${process.env.QUILL_CDN_URL}/images/logos/quill-logo-white.svg`

export const Header: React.StatelessComponent<{}> = () => {
    return (
      <Layout.Header style={{
          height: '64px',
          width: "100%",
          backgroundColor: "#06806b",
          padding: "0 30px"}}
      >
        <Row align="middle" justify="space-between" style={{height: '100%', maxWidth: '800px', margin: 'auto'}} type="flex">
          <img alt="Quill logo" src={quillLogoSrc} style={{ height: '32px' }} />
          <a href={process.env.EMPIRICAL_BASE_URL} style={{color: 'white', fontWeight: 600}}>Save and exit</a>
        </Row>
      </Layout.Header>
    );
};
