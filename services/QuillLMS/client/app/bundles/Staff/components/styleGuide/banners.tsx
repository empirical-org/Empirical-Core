import * as React from 'react';
import { Banner, DropdownInput } from '../../../Shared';
import { DropdownObjectInterface } from '../../interfaces/evidenceInterfaces';

const COLOR_OPTIONS = [
  { label: 'Quill Green', value: 'green' },
  { label: 'Quill Gold', value: 'gold' },
  { label: 'Quill Viridian', value: 'viridian' },
  { label: 'Quill Teal', value: 'teal' },
  { label: 'Quill Blue', value: 'blue' },
  { label: 'Quill Purple', value: 'purple' },
  { label: 'Quill Violet', value: 'violet' },
  { label: 'Quill Red', value: 'red' },
  { label: 'Quill Maroon', value: 'maroon' },
  { label: 'Quill Grey', value: 'grey' }
]

const Banners = () => {
  const [colorOption, setColorOption] = React.useState<DropdownObjectInterface>(COLOR_OPTIONS[0]);

  function handleColorOptionChange(option) {
    setColorOption(option)
  }

  return(
    <div id="banners">
      <h2 className="style-guide-h2">Banners</h2>
      <div className="element-container">
        <h3>Standard Banner with one button</h3>
        <pre>
          {
            `
  <Banner
    tagText="new"
    primaryHeaderText="Start of a new school year?"
    bodyText="Quickly archive last year's classes."
    icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/accounts/school-building.svg" }}
    buttons={[
      {
        className: "nonstandard-banner-button",
        href: "",
        text: "Archive Classes",
        target: "_blank"
      }
    ]}
    bannerStyle=${colorOption.value}
  />
            `
          }
        </pre>
        <DropdownInput
          className="color-options-dropdown"
          handleChange={handleColorOptionChange}
          isSearchable={true}
          label="Banner color options"
          options={COLOR_OPTIONS}
          value={colorOption}
        />
        <Banner
          tagText="new"
          primaryHeaderText="Start of a new school year?"
          bodyText="Quickly archive last year's classes."
          icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/accounts/school-building.svg" }}
          buttons={[
            {
              className: "nonstandard-banner-button",
              href: "",
              text: "Archive Classes",
              target: "_blank"
            }
          ]}
          bannerStyle={colorOption.value}
        />
      </div>
      <div className="element-container">
        <h3>Standard Banner with multiple buttons</h3>
      </div>
      <div className="element-container">
        <h3>Premium Banner</h3>
      </div>
    </div>
  )
}

export default Banners
