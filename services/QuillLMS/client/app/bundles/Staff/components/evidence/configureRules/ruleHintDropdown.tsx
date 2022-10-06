import * as React from "react";
import { useQuery,  } from 'react-query';

import { HintInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchHints, } from '../../../utils/evidence/hintAPIs';
import { DropdownInput, Error, } from '../../../../Shared/index';

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
    // eslint-disable-next-line
    <React.Fragment>
      <DropdownInput
        className='hint-selected'
        handleChange={handleOnHintChange}
        isSearchable={true}
        label="Hint"
        options={hintOptions}
        value={selectedHintOption}
      />
    </React.Fragment>
  );
};

export default RuleHintDropdown;
