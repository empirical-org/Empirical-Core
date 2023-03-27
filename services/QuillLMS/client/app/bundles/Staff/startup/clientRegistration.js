import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

//import '../styles/styles.scss';
import BackpackIndex from '../containers/BackpackIndex.tsx';
import ActivityFormIndex from './ActivityFormIndex';
import AdminVerificationApp from './AdminVerificationApp';
import AttributesManagerIndex from './AttributesManagerIndex';
import ConceptsIndex from './ConceptsIndex.tsx';
import EvidenceIndex from './EvidenceIndex.tsx';
import NewAdminOrDistrictUserApp from './NewAdminOrDistrictUserApp';

ReactOnRails.register({
  ConceptsIndex,
  BackpackIndex,
  EvidenceIndex,
  AttributesManagerIndex,
  ActivityFormIndex,
  NewAdminOrDistrictUserApp,
  AdminVerificationApp,
});
