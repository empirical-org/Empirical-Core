import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import ContentPartnersTable from './contentPartnersTable';

import { requestGet, requestPost, requestPut } from '../../../../../modules/request/index';
import { defaultSnackbarTimeout, Snackbar } from '../../../../Shared/index';

const ARCHIVED = 'archived'

const ContentPartners = ({ match, location, }) => {
  const [contentPartners, setContentPartners] = React.useState([])
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  React.useEffect(() => {
    getInitialData();
  }, []);

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

  function getInitialData() {
    getContentPartners()
  }

  function getContentPartners() {
    requestGet('/cms/content_partners',
      (data) => {
        setContentPartners(data.content_partners);
      }
    )
  }

  function saveContentPartnerChanges(contentPartner) {
    requestPut(`/cms/content_partners/${contentPartner.id}`, { content_partner: contentPartner, },
      (data) => {
        getInitialData()
        setShowSnackbar(true)
      }
    )
  }

  function createNewContentPartner(contentPartner) {
    requestPost(`/cms/content_partners`, { content_partner: contentPartner, },
      (data) => {
        getInitialData()
        setShowSnackbar(true)
      }
    )
  }

  let activeLink

  [ARCHIVED].forEach(path => {
    if (location.pathname.includes(path)) {
      activeLink = path
    }
  })

  const sharedProps = {
    path: `${match.path}`,
    saveContentPartnerChanges,
    contentPartners
  }

  return (
    <div className="content-partners-manager">
      <Snackbar text="Changes saved" visible={showSnackbar} />
      <div className="cms-tabs">
        <Link className={activeLink ? '': 'active'} to={`${match.path}`}>Live</Link>
        <Link className={activeLink === ARCHIVED ? 'active': ''} to={`${match.path}/${ARCHIVED}`}>Archived</Link>
      </div>
      <Switch>
        <Route
          component={() => (
            <ContentPartnersTable
              {...sharedProps}
              visible={false}
            />
          )}
          path={`${match.path}/${ARCHIVED}`}
        />
        <Route
          component={() => (
            <ContentPartnersTable
              {...sharedProps}
              createNewContentPartner={createNewContentPartner}
              visible={true}
            />
          )}
          path={match.path}
        />
      </Switch>
    </div>
  )
}

export default ContentPartners
