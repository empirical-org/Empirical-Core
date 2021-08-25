import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import '../styles/styles.scss';
import ConceptsIndex from './ConceptsIndex.tsx';
import EvidenceIndex from './EvidenceIndex.tsx';
import BackpackIndex from '../containers/BackpackIndex.tsx'
import AttributesManagerIndex from './AttributesManagerIndex'
import ActivityFormIndex from './ActivityFormIndex'

ReactOnRails.register({
  ConceptsIndex,
  BackpackIndex,
  EvidenceIndex,
  AttributesManagerIndex,
  ActivityFormIndex,
});
