import React from 'react';
import {Link} from "react-router-dom";

const ConceptManagerNav: React.SFC = () => {

  let activeLink = 'concepts'
  if (window.location.href.includes('find_and_replace')) {
    activeLink = 'find_and_replace'
  } else if (window.location.href.includes('new')) {
    activeLink = "new"
  } else if (window.location.href.includes('change_log')) {
    activeLink = 'change_log'
  }
  return (
    <div className="cms-manager-nav">
      <div className="cms-manager-links">
        <Link className={activeLink === 'concepts' ? 'active': ''} to="/">Concepts</Link>
        <Link className={activeLink === 'new' ? 'active': ''} to="/new">Add Concepts</Link>
        <Link className={activeLink === 'find_and_replace' ? 'active': ''} to="/find_and_replace">Find & Replace</Link>
        <Link className={activeLink === 'change_log' ? 'active': ''} to="/change_log">Change Log</Link>
      </div>
    </div>
  )
}

export default ConceptManagerNav
