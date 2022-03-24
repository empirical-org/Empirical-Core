import React from 'react';
import LandingPage from '../components/progress_reports/landing_page.jsx';

export default (props) => (<LandingPage classrooms={props.classrooms} flag={document.getElementById('current-user-testing-flag').getAttribute('content')} />);
