import ReactOnRails from 'react-on-rails';
import 'antd/dist/antd.css';

import '../styles/styles.scss';
import ConceptsIndex from './ConceptsIndex.tsx';
import StyleGuideIndex from '../containers/StyleGuideIndex.tsx'

ReactOnRails.register({ ConceptsIndex, StyleGuideIndex, });
