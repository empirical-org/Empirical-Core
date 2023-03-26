import * as React from "react";
import { useQuery } from 'react-query';

import { DropdownInput } from '../../../../Shared/index';
import { fetchHints } from '../../../utils/evidence/hintAPIs';

const RuleHintDropdown = ({
  emptySelectionText,
  onHintChange,
  selectedHintId,
}) => {

  const { data: hintsData } = useQuery("hints", fetchHints);

  if(!hintsData) {
    return (<span />)
  }

  const hintOptions = (
    [{value: '', label: emptySelectionText}].concat(
      hintsData.hints.sort((a,b) => (
        (a.name || a.explanation) > (b.name || b.explanation) ? 1 : -1
      )).map((hint) => (
        {value: hint.id, label: (hint.name || hint.explanation)}
      ))
    )
  )

  const selectedHintOption = hintOptions.find((hintOption) => hintOption.value === selectedHintId) || hintOptions[0]

  const handleOnHintChange = (selection) => {
    const selectedHint = hintsData.hints.find((hint) => hint.id === selection.value)
    onHintChange(selectedHint)
  }

  return(
    <React.Fragment>
      <div className="form-subsection-label">Hint</div>
      <DropdownInput
        className='hint-selected'
        handleChange={handleOnHintChange}
        isSearchable={true}
        options={hintOptions}
        value={selectedHintOption}
      />
    </React.Fragment>
  );
};

export default RuleHintDropdown;
