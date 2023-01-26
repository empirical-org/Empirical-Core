import * as React from 'react';
import useWindowSize from '../../hooks/useWindowSize';

const SubNavbar = ({ activeTab, desktopTabs, mobileTabs }) => {
  const size = useWindowSize();

  function renderTabs() {
    const tabs = size.width < 800 ? mobileTabs : desktopTabs;
    return tabs.map(tab => {
      const { id, name, url } = tab;
      const tabClass = id === activeTab ? 'active' : '';
      return <li><a className={tabClass} href={url}>{name}</a></li>;
    });
  }

  return(
    <div className="tab-subnavigation-wrapper">
      <div className="container">
        <ul>{renderTabs()}</ul>
      </div>
    </div>
  )
}

export { SubNavbar }
