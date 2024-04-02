import * as React from 'react';
import { components } from 'react-select';

const indeterminateSrc = 'https://assets.quill.org/images/icons/indeterminate.svg'
const smallWhiteCheckSrc = 'https://assets.quill.org/images/shared/check-small-white.svg'

const renderCheckbox = (props) => {
  const { selectProps, } = props
  const { value, options, inputValue } = selectProps
  const anyOptionsAreSelected = !!value.length
  const allOptionsAreSelected = !inputValue && value.length === (options.length - 1)
  let checkbox = <span className="quill-checkbox unselected" />
  if (props.isSelected || allOptionsAreSelected) {
    checkbox = (<span className="quill-checkbox selected">
      <img alt="check" src={smallWhiteCheckSrc} />
    </span>)
  } else if (props.value === 'All' && anyOptionsAreSelected) {
    checkbox = (<span className="quill-checkbox selected">
      <img alt="check" src={indeterminateSrc} />
    </span>)
  }
  return checkbox
}

export const CheckableDropdownOption = props => {
  const { data, } = props

  const passedProps = {...props}
  passedProps.innerProps.id = data.value

  // improves performance with very large lists, see https://github.com/JedWatson/react-select/issues/3128 for discussion
  delete passedProps.innerProps.onMouseMove
  delete passedProps.innerProps.onMouseOver

  return (
    <div className="checkable-dropdown-option">
      <components.Option {...passedProps}>
        {renderCheckbox(props)}
        <span>{data.label}</span>
      </components.Option>
    </div>
  );
};
