import * as React from 'react';

interface pageHeaderProps {
  header: string,
  title: string,
  notes: string
}

export const PageHeader = ({ header, title, notes }: pageHeaderProps) => {
  return(
    <section className="comprehension-page-header-container">
      <h2>{header}</h2>
      <h3>{title}</h3>
      <h4>{notes}</h4>
    </section>
  );
}

export default PageHeader;
