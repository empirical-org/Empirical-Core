import React from 'react';

import LandingPage from '../components/progress_reports/landing_page.jsx';

export default () => (<LandingPage flag={document.getElementById('current-user-testing-flag').getAttribute('content')} />);
