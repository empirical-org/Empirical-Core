import * as React from "react";
import { Layout, Row } from "antd";
import { Link } from "react-router-dom";

const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white.svg`

export const Header: React.StatelessComponent<{}> = () => {
    return (
      <Layout.Header className="header">
        <Row align="middle" justify="space-between" style={{height: '100%', maxWidth: '800px', margin: 'auto'}} type="flex">
          <a className="focus-on-dark" href={process.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>
          <a className="focus-on-dark" href={process.env.DEFAULT_URL}>Save and exit</a>
        </Row>
      </Layout.Header>
    );
};
