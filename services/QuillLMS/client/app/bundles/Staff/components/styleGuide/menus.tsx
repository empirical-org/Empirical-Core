import * as React from "react";
import { DropdownInput } from '../../../Shared/index';

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

const WITH_LABEL = 'with label'
const WITHOUT_LABEL = 'without label'
const WITH_LABEL_AND_HELPER_TEXT = 'with label and helper text'
const WITH_LABEL_HELPER_TEXT_AND_CHARACTER_COUNT = 'with label, helper text and character count'

const menuOptions = [
  {value: 1, label: 'One'},
  {value: 2, label: 'Two'},
  {value: 3, label: 'Three'},
  {value: 4, label: 'Four'}
]

const sizeOptions = [
  {value: 'small', label: 'Small'},
  {value: 'medium', label: 'Medium'},
  {value: 'large', label: 'Large'}
]

const styleOptions = [
  {value: 'bordered', label: 'Bordered'},
  {value: '', label: 'Underlined'},
  {value: 'borderless', label: 'Borderless'}
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
  {value: WITH_LABEL_AND_HELPER_TEXT, label: 'Label + helper text'},
  {value: WITH_LABEL_HELPER_TEXT_AND_CHARACTER_COUNT, label: 'Label + helper text + character count'}
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

  const customizableMenuStyle = `${sizeOption.value} ${styleOption.value} ${disabledOption.value} ${iconOption.value}`
  const showHelperText = labelOption.value === WITH_LABEL_AND_HELPER_TEXT || labelOption.value === WITH_LABEL_HELPER_TEXT_AND_CHARACTER_COUNT

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
                <DropdownInput
                  handleChange={(e) => { changeSavedValues(LABEL, e) }}
                  isSearchable={true}
                  label="Label"
                  options={labelOptions}
                  value={labelOption}
                />
              </div>
            </div>
          </div>
          <div className="customizable-menu-container">
            <DropdownInput
              className={`customizable-menu ${customizableMenuStyle}`}
              handleChange={(e) => { changeSavedValues(DROPDOWN_ONE, e)}}
              helperText={showHelperText && 'Helper text'}
              isSearchable={!!searchableOption.value}
              label={labelOption.value === WITHOUT_LABEL ? '' : 'Label'}
              options={menuOptions}
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
