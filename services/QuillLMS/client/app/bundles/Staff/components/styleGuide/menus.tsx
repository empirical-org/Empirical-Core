import * as React from "react";
import { DropdownInput, Tooltip, informationIcon } from '../../../Shared/index';

const DROPDOWN_ONE = 'dropdownOne'
const DROPDOWN_TWO = 'dropdownTwo'
const DROPDOWN_THREE = 'dropdownThree'
const DROPDOWN_FOUR = 'dropdownFour'
const DROPDOWN_FIVE= 'dropdownFive'
const SIZE = 'size'
const STYLE = 'style'
const DISABLED = 'disabled'
const SEARCHABLE = 'searchable'
const ICON = 'icon'
const LABEL = 'label'

const BORDERLESS = 'borderless'
const WITH_LABEL = 'with label'
const WITHOUT_LABEL = 'without label'
const WITH_LABEL_AND_HELPER_TEXT = 'with label and helper text'

const menuOptions = [
  {value: 1, label: 'One'},
  {value: 2, label: 'Two'},
  {value: 3, label: 'Three'},
  {value: 4, label: 'Four'}
]

const menuOptionsWithIcons = [
  { value: 1, label: ('<p><img alt="" src="https://assets.quill.org/images/icons/xs/description-lessons.svg" /><span>One</span></p>') },
  { value: 2, label: ('<p><img alt="" src="https://assets.quill.org/images/icons/xs/description-lessons.svg" /><span>Two</span></p>') },
  { value: 3, label: ('<p><img alt="" src="https://assets.quill.org/images/icons/xs/description-lessons.svg" /><span>Three</span></p>') },
  { value: 4, label: ('<p><img alt="" src="https://assets.quill.org/images/icons/xs/description-lessons.svg" /><span>Four</span></p>') },
]

const sizeOptions = [
  {value: 'small', label: 'Small'},
  {value: 'medium', label: 'Medium'},
  {value: 'large', label: 'Large'}
]

const styleOptions = [
  {value: 'bordered', label: 'Bordered'},
  {value: '', label: 'Underlined'},
  {value: BORDERLESS, label: 'Borderless'}
]

const disabledOptions = [
  {value: '', label: 'False'},
  {value: 'disabled', label: 'True'}
]

const searchableOptions = [
  {value: '', label: 'False'},
  {value: 'true', label: 'True'}
]

const iconOptions = [
  {value: '', label: 'Without icon'},
  {value: 'icon', label: 'With icon'}
]

const labelOptions = [
  {value: WITHOUT_LABEL, label: 'Without label'},
  {value: WITH_LABEL, label: 'With label'},
  {value: WITH_LABEL_AND_HELPER_TEXT, label: 'Label + helper text'}
]

export const Menus = () => {

  const [dropdownOne, setDropdownOne] = React.useState<any>(menuOptions[0]);
  const [dropdownTwo, setDropdownTwo] = React.useState<any>(null);
  const [dropdownThree, setDropdownThree] = React.useState<any>(menuOptions[1]);
  const [dropdownFour, setDropdownFour] = React.useState<any>([]);
  const [dropdownFive, setDropdownFive] = React.useState<any>([]);
  const [sizeOption, setSizeOption] = React.useState<any>(sizeOptions[0]);
  const [styleOption, setStyOption] = React.useState<any>(styleOptions[0]);
  const [disabledOption, setDisabledOption] = React.useState<any>(disabledOptions[0]);
  const [searchableOption, setSearchableOption] = React.useState<any>(searchableOptions[0]);
  const [iconOption, setIconOption] = React.useState<any>(iconOptions[0]);
  const [labelOption, setLabelOption] = React.useState<any>(labelOptions[0]);

  React.useEffect(() => {
    if(styleOption.value === BORDERLESS) {
      setLabelOption(labelOptions[0])
    }
  }, [styleOption])

  React.useEffect(() => {
    if(iconOption.value) {
      const option = menuOptionsWithIcons.filter(option => option.value === dropdownOne.value)[0]
      setDropdownOne(option)
      setSearchableOption(searchableOptions[0])
    } else {
      const option = menuOptions.filter(option => option.value === dropdownOne.value)[0]
      setDropdownOne(option)
    }
  }, [iconOption])

  // TODO: fix styling issue where input with icon that is also searchable causes weird formatting (just a note, we don't current have any searchable DropdownInput instances that also have icon options)
  // this issue is being mitigated by the input { display: none } rule under &.icon in services/QuillLMS/client/app/bundles/Shared/styles/input.scss
  React.useEffect(() => {
    if(iconOption.value && searchableOption.value) {
      const option = menuOptions.filter(option => option.value === dropdownOne.value)[0]
      setDropdownOne(option)
      setIconOption(iconOptions[0])
      setSearchableOption(searchableOptions[0])
    }
  }, [iconOption, searchableOption])

  const setterFunctions = {
    [DROPDOWN_ONE]: setDropdownOne,
    [DROPDOWN_TWO]: setDropdownTwo,
    [DROPDOWN_THREE]: setDropdownThree,
    [DROPDOWN_FOUR]: setDropdownFour,
    [DROPDOWN_FIVE]: setDropdownFive,
    [SIZE]: setSizeOption,
    [STYLE]: setStyOption,
    [DISABLED]: setDisabledOption,
    [SEARCHABLE]: setSearchableOption,
    [ICON]: setIconOption,
    [LABEL]: setLabelOption,
  }

  function changeSavedValues(key, option) {
    const setterFunction = setterFunctions[key]
    setterFunction(option)
  }

  const dropdownOptions = iconOption.value ? menuOptionsWithIcons : menuOptions
  const customizableMenuStyle = `${sizeOption.value} ${styleOption.value} ${disabledOption.value} ${iconOption.value}`.trim().replace(/\s+/g, ' ')
  const showHelperText = labelOption.value === WITH_LABEL_AND_HELPER_TEXT
  const labelDropdownStyle = styleOption.value === BORDERLESS ? 'disabled' : ''

  return (
    <div id="menus">
      <h2 className="style-guide-h2">Menus</h2>
      <div className="element-container">
        <h3 className="style-guide-h3">Dropdown Menu</h3>
        <div className="element-row first">
          <div className="upper-container">
            <pre>
              {`const menuOptions = ${JSON.stringify(menuOptions)}

<DropdownInput
  className="${customizableMenuStyle}"
  label="Label"
  options={menuOptions}
  handleChange={(e) => {changeSavedValues(DROPDOWN_ONE, e)}}
  isSearchable={false}
  value={dropdownOne}
/>`}
            </pre>
            <div className="customization-options-container">
              <div className="left-side-container">
                <DropdownInput
                  handleChange={(e) => { changeSavedValues(SIZE, e) }}
                  isSearchable={true}
                  label="Size"
                  options={sizeOptions}
                  value={sizeOption}
                />
                <DropdownInput
                  handleChange={(e) => { changeSavedValues(STYLE, e) }}
                  isSearchable={true}
                  label="Style"
                  options={styleOptions}
                  value={styleOption}
                />
                <DropdownInput
                  handleChange={(e) => { changeSavedValues(DISABLED, e) }}
                  isSearchable={true}
                  label="Disabled"
                  options={disabledOptions}
                  value={disabledOption}
                />
              </div>
              <div className="right-side-container">
                <DropdownInput
                  handleChange={(e) => { changeSavedValues(SEARCHABLE, e) }}
                  isSearchable={true}
                  label="Searchable"
                  options={searchableOptions}
                  value={searchableOption}
                />
                <DropdownInput
                  handleChange={(e) => { changeSavedValues(ICON, e) }}
                  isSearchable={true}
                  label="Icon"
                  options={iconOptions}
                  value={iconOption}
                />
                <div className="label-dropdown-container">
                  <DropdownInput
                    className={labelDropdownStyle}
                    disabled={styleOption.value === BORDERLESS}
                    handleChange={(e) => { changeSavedValues(LABEL, e) }}
                    isSearchable={true}
                    label="Label"
                    options={labelOptions}
                    value={labelOption}
                  />
                  <Tooltip
                    tooltipText="Note: The borderless variant does not include Labels + Helper Text. Only the Bordered and Underlined variants should be used with Labels + Helper Text."
                    tooltipTriggerText={<img alt={informationIcon.alt} className="information-icon" src={informationIcon.src} />}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="customizable-menu-container">
            <DropdownInput
              className={`customizable-menu ${customizableMenuStyle}`}
              disabled={!!disabledOption.value}
              handleChange={(e) => { changeSavedValues(DROPDOWN_ONE, e)}}
              helperText={showHelperText && 'Helper text'}
              isSearchable={!!searchableOption.value}
              label={labelOption.value === WITHOUT_LABEL ? '' : 'Label'}
              options={dropdownOptions}
              usesCustomOption={!!iconOption.value}
              value={dropdownOne}
            />
          </div>
        </div>
        <h3 className="style-guide-h3">Exposed Editable Dropdown Menu</h3>
        <div className="element-row">
          <div className="big-element">
            <pre>
              {`const menuOptions = ${JSON.stringify(menuOptions)}

<DropdownInput
  label="Label"
  options={menuOptions}
  handleChange={(e) => {changeSavedValues(DROPDOWN_TWO, e)}}
  value={dropdownTwo}
  isSearchable={true}
  placeholder="Value goes here"
/>`}
            </pre>
            <DropdownInput
              handleChange={(e) => { changeSavedValues(DROPDOWN_TWO, e)}}
              isSearchable={true}
              label="Label"
              options={menuOptions}
              placeholder="Value goes here"
              value={dropdownTwo}
            />
          </div>
          <div className="big-element">
            <pre>
              {`const menuOptions = ${JSON.stringify(menuOptions)}

<DropdownInput
  label="Label"
  value={dropdownThree}
  isSearchable={true}
  options={menuOptions}
  handleChange={(e) => {changeSavedValues(DROPDOWN_THREE, e)}}
/>`}
            </pre>
            <DropdownInput
              handleChange={(e) => {changeSavedValues(DROPDOWN_THREE, e)}}
              isSearchable={true}
              label="Label"
              options={menuOptions}
              value={dropdownThree}
            />
          </div>
        </div>
        <h3 className="style-guide-h3">Uneditable Checkbox Dropdown Menu</h3>
        <div className="element-row">
          <div className="big-element">
            <pre>
              {`const menuOptions = ${JSON.stringify(menuOptions)}

<DropdownInput
  value={dropdownFour}
  isMulti={true}
  isSearchable={false}
  options={menuOptions}
  optionType='option'
  handleChange={(e) => {changeSavedValues(DROPDOWN_FOUR, e)}}
/>`}
            </pre>
            <DropdownInput
              handleChange={(e) => {changeSavedValues(DROPDOWN_FOUR, e)}}
              isMulti={true}
              isSearchable={false}
              options={menuOptions}
              optionType='option'
              value={dropdownFour}
            />
          </div>
        </div>
        <h3 className="style-guide-h3">Editable Checkbox Dropdown Menu</h3>
        <div className="element-row">
          <div className="big-element">
            <pre>
              {`const menuOptions = ${JSON.stringify(menuOptions)}

<DropdownInput
  value={dropdownFive}
  isMulti={true}
  isSearchable={true}
  options={menuOptions}
  optionType='option'
  handleChange={(e) => {changeSavedValues(DROPDOWN_FIVE, e)}}
/>`}
            </pre>
            <DropdownInput
              handleChange={(e) => {changeSavedValues(DROPDOWN_FIVE, e)}}
              isMulti={true}
              isSearchable={true}
              options={menuOptions}
              optionType='option'
              value={dropdownFive}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Menus
