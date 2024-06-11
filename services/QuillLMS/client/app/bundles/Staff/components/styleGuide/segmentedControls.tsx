import * as React from 'react';
import { DropdownInput, SegmentedControl } from '../../../Shared';
import { DropdownObjectInterface } from '../../interfaces/evidenceInterfaces';

// export const SegmentedControl = ({ activeTab, size, buttons }) => {
//   return (
//     <div className="segmented-control-container">
//       {buttons.map((button, i) => {
//         const { activeIconSrc, inactiveIconSrc, label, onClick } = button
//         let style = size
//         if (i === 0) {
//           style += ' left'
//         } else if (i === buttons.length - 1) {
//           style += ' right'
//         }
//         return (
//           <button className={`interactive-wrapper segmented-control-button ${style} ${label === activeTab ? 'active' : ''}`} key={`${label}-${i}`} onClick={onClick} value={label}>
//             {activeIconSrc && inactiveIconSrc && <img alt="" src={label === activeTab ? activeIconSrc : inactiveIconSrc} />}
//             <span>{label}</span>
//           </button>
//         )
//       })}
//     </div>
//   )
// }

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
    <div id="post-navigation-banners">
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
    </div>
  )
}

export default SegmentedControls
