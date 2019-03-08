import React from 'react';
import {Link} from "react-router";

const ConceptManagerNav: React.SFC = () => {

  let activeLink = 'concepts'
  if (window.location.href.includes('find_and_replace')) {
    activeLink = 'find_and_replace'
  } else if (window.location.href.includes('new')) {
    activeLink = "new"
  }
  return <div className="concept-manager-nav">
    <div className="concept-manager-links">
      <Link className={activeLink === 'concepts' ? 'active': ''} to ="/">Concepts</Link>
      <Link className={activeLink === 'new' ? 'active': ''} to ="/new">Add Concepts</Link>
      <Link className={activeLink === 'find_and_replace' ? 'active': ''} to ="/find_and_replace">Find & Replace</Link>
    </div>
  </div>
}

export default ConceptManagerNav
