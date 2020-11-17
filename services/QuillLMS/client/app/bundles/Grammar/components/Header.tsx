import * as React from "react";
import { Layout, Row } from "antd";
import { Link } from "react-router-dom";
const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white.svg`;

interface HeaderProps {
  isTeacher?: boolean;
  previewShowing?: boolean;
  onTogglePreview?: () => void;
}

export const Header: React.SFC<HeaderProps> = ({ isTeacher, previewShowing, onTogglePreview }) => {
    const handleTogglePreview = () => {
      onTogglePreview();
    }
    return (
      <Layout.Header className="header">
        <Row align="middle" gutter={0} justify="space-between" style={{height: '100%', maxWidth: '800px', margin: 'auto'}} type="flex">
          {isTeacher && !previewShowing && <button className="quill-button medium secondary outlined focus-on-dark" onClick={handleTogglePreview} type="button">Show menu</button>}
          <a className="focus-on-dark" href={process.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>
          <a className="focus-on-dark" href={process.env.DEFAULT_URL}>Save and exit</a>
        </Row>
      </Layout.Header>
    );
};
