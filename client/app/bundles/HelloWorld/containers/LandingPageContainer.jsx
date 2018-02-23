import React from 'react'
import createReactClass from 'create-react-class';
import LandingPage from '../components/progress_reports/landing_page.jsx';

export default () => (<LandingPage flag={document.getElementById('current-user-flag').getAttribute('content')} />);
