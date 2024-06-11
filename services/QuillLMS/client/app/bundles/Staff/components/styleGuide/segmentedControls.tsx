import * as React from 'react';
import { DropdownInput, SegmentedControl } from '../../../Shared';
import { DropdownObjectInterface } from '../../interfaces/evidenceInterfaces';

const WHITE_STAR_ICON_SRC = 'https://assets.quill.org/images/icons/xs/star-white.svg'
const BLACK_STAR_ICON_SRC = 'https://assets.quill.org/images/icons/xs/star-green.svg'

const SIZE_OPTIONS = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' }
]

const SegmentedControls = () => {
  const [activeTab, setActiveTab] = React.useState<string>('Option One');
  const [sizeOption, setSizeOption] = React.useState<DropdownObjectInterface>(SIZE_OPTIONS[0]);

  function handleSizeOptionChange(option: DropdownObjectInterface) {
    setSizeOption(option)
  }

  function handleTabChange(e) {
    setActiveTab(e.currentTarget.value)
  }

  return (
    <div id="segmented-controls">
      <h2 className="style-guide-h2">Segmented Controls</h2>
      <div className="element-container">
        <h3>Standard Segmented Control</h3>
        <pre>
          {
            `
  <SegmentedControl
    activeTab="${activeTab}"
    size="${sizeOption.value}"
    buttons={[
      {
        label: "Option One",
        onClick: handleTabChange
      },
      {
        label: "Option Two",
        onClick: handleTabChange
      },
      {
        label: "Option Three",
        onClick: handleTabChange
      },
    ]}
  />
            `
          }
        </pre>
        <DropdownInput
          className="color-options-dropdown"
          handleChange={handleSizeOptionChange}
          isSearchable={true}
          label="Size options"
          options={SIZE_OPTIONS}
          value={sizeOption}
        />
        <SegmentedControl
          activeTab={activeTab}
          size={sizeOption.value}
          buttons={[
            {
              label: "Option One",
              onClick: handleTabChange
            },
            {
              label: "Option Two",
              onClick: handleTabChange
            },
            {
              label: "Option Three",
              onClick: handleTabChange
            },
          ]}
        />
      </div>
      <div className="element-container">
        <h3>Segmented Control with icons</h3>
        <pre>
          {
            `
  <SegmentedControl
    activeTab="${activeTab}"
    size="${sizeOption.value}"
    buttons={[
      {
        activeIconSrc: WHITE_STAR_ICON_SRC,
        inactiveIconSrc: BLACK_STAR_ICON_SRC,
        label: "Option One",
        onClick: handleTabChange
      },
      {
        activeIconSrc: WHITE_STAR_ICON_SRC,
        inactiveIconSrc: BLACK_STAR_ICON_SRC,
        label: "Option Two",
        onClick: handleTabChange
      },
      {
        activeIconSrc: WHITE_STAR_ICON_SRC,
        inactiveIconSrc: BLACK_STAR_ICON_SRC,
        label: "Option Three",
        onClick: handleTabChange
      },
      {
        activeIconSrc: WHITE_STAR_ICON_SRC,
        inactiveIconSrc: BLACK_STAR_ICON_SRC,
        label: "Option Four",
        onClick: handleTabChange
      },
      {
        activeIconSrc: WHITE_STAR_ICON_SRC,
        inactiveIconSrc: BLACK_STAR_ICON_SRC,
        label: "Option Five",
        onClick: handleTabChange
      }
    ]}
  />
            `
          }
        </pre>
        <SegmentedControl
          activeTab={activeTab}
          size={sizeOption.value}
          buttons={[
            {
              activeIconSrc: WHITE_STAR_ICON_SRC,
              inactiveIconSrc: BLACK_STAR_ICON_SRC,
              label: "Option One",
              onClick: handleTabChange
            },
            {
              activeIconSrc: WHITE_STAR_ICON_SRC,
              inactiveIconSrc: BLACK_STAR_ICON_SRC,
              label: "Option Two",
              onClick: handleTabChange
            },
            {
              activeIconSrc: WHITE_STAR_ICON_SRC,
              inactiveIconSrc: BLACK_STAR_ICON_SRC,
              label: "Option Three",
              onClick: handleTabChange
            },
            {
              activeIconSrc: WHITE_STAR_ICON_SRC,
              inactiveIconSrc: BLACK_STAR_ICON_SRC,
              label: "Option Four",
              onClick: handleTabChange
            },
            {
              activeIconSrc: WHITE_STAR_ICON_SRC,
              inactiveIconSrc: BLACK_STAR_ICON_SRC,
              label: "Option Five",
              onClick: handleTabChange
            }
          ]}
        />
      </div>
      <div className="element-container">
        <h3>Segmented Control with disabled option</h3>
        <pre>
          {
            `
  <SegmentedControl
    activeTab="${activeTab}"
    size="${sizeOption.value}"
    buttons={[
      {
        label: "Option One",
        onClick: handleTabChange
      },
      {
        label: "Option Two",
        onClick: handleTabChange
      },
      {
        label: "Option Three",
        onClick: handleTabChange
        disabled: true
      },
    ]}
  />
            `
          }
        </pre>
        <SegmentedControl
          activeTab={activeTab}
          size={sizeOption.value}
          buttons={[
            {
              label: "Option One",
              onClick: handleTabChange
            },
            {
              label: "Option Two",
              onClick: handleTabChange
            },
            {
              label: "Option Three",
              disabled: true,
              onClick: handleTabChange
            },
          ]}
        />
      </div>
    </div>
  )
}

export default SegmentedControls
