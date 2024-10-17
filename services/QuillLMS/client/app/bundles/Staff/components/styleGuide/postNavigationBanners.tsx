import * as React from 'react';
import { PostNavigationBanner, DropdownInput } from '../../../Shared';
import { DropdownObjectInterface } from '../../interfaces/evidenceInterfaces';

const SCHOOL_OR_TEACHER_PREMIUM = 'School or Teacher Premium'
const DISTRICT_PREMIUM = 'District Premium'
const PREMIUM_OPTIONS = [ SCHOOL_OR_TEACHER_PREMIUM, DISTRICT_PREMIUM ]
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
const DARK_MODE = 'dark-mode'
const LIGHT_MODE = 'light-mode'
const SHADE_OPTIONS = [LIGHT_MODE, DARK_MODE]

const PostNavigationBanners = () => {
  const [colorOption, setColorOption] = React.useState<DropdownObjectInterface>(COLOR_OPTIONS[0]);
  const [premiumOption, setPremiumOption] = React.useState<string>(PREMIUM_OPTIONS[0]);
  const [shadeOption, setShadeOption] = React.useState<string>(SHADE_OPTIONS[0]);

  function handleColorOptionChange(option: DropdownObjectInterface) {
    setColorOption(option)
  }

  function handlePremiumOptionChange(e) {
    setPremiumOption(e.target.value)
  }

  function handleShadeOptionChange(e) {
    setShadeOption(e.target.value)
  }

  function renderShadeOptionsElement() {
    return(
      <div className="radio-options">
        <div className="radio">
          <label id="light-mode">
            <input aria-labelledby="light-mode" checked={shadeOption === LIGHT_MODE} onChange={handleShadeOptionChange} type="radio" value={LIGHT_MODE} />
            Light Mode
          </label>
        </div>
        <div className="radio">
          <label id="dark-mode">
            <input aria-labelledby="dark-mode" checked={shadeOption === DARK_MODE} onChange={handleShadeOptionChange} type="radio" value={DARK_MODE} />
            Dark Mode
          </label>
        </div>
      </div>
    )
  }

  const premiumStyle = premiumOption === DISTRICT_PREMIUM ? "district-premium" : "premium"
  const shadeContainerStyle = `shade-container ${shadeOption === DARK_MODE ? colorOption.value : ''}`
  const iconUrl = shadeOption === DARK_MODE ? "https://assets.quill.org/images/icons/l/school-campus-transparent.svg" : `https://assets.quill.org/images/banners/large-school-campus-${colorOption.value}.svg`

  return(
    <div id="post-navigation-banners">
      <h2 className="style-guide-h2">Banners</h2>
      <div className="element-container">
        <h3>Primary (One Button)</h3>
        <pre>
          {
            `
  // color will default to green if no bannerColor prop is passed

  <PostNavigationBanner
    bannerColor="${colorOption.value}"
    bannerStyle="${shadeOption}"
    bodyText="Quickly archive last year's classes."
    buttons={[
      {
        href: "",
        standardButtonStyle: false,
        text: "Archive Classes",
        target: "_blank"
      }
    ]}
    icon={{ alt: "Image of a school building", src: "${iconUrl}" }}
    primaryHeaderText="Start of a new school year?"
    tagText="new"
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
        {renderShadeOptionsElement()}
        <div className={shadeContainerStyle}>
          <PostNavigationBanner
            bannerColor={colorOption.value}
            bannerStyle={shadeOption}
            bodyText="Quickly archive last year's classes."
            buttons={[
              {
                href: "",
                standardButtonStyle: false,
                text: "Archive Classes",
                target: "_blank"
              }
            ]}
            icon={{ alt: "Image of a school building", src: iconUrl }}
            primaryHeaderText="Start of a new school year?"
            tagText="new"
          />
        </div>
      </div>
      <div className="element-container">
        <h3>Primary (Multiple Buttons)</h3>
        <pre>
          {
            `
  <PostNavigationBanner
    bannerColor="{colorOption.value}"
    bannerStyle="{shadeOption}"
    bodyText="Quickly archive last year's classes."
    buttons={[
      {
        href: "",
        standardButtonStyle: true,
        text: "Learn more",
        target: "_blank"
      },
      {
        href: "",
        standardButtonStyle: true,
        text: "View activities",
        target: "_blank"
      },
      {
        href: "",
        standardButtonStyle: false,
        text: "See tool demo",
        target: "_blank"
      },
      {
        href: "",
        standardButtonStyle: false,
        text: "Get the Teacher Handbook",
        target: "_blank"
      },
    ]}
    icon={{ alt: "Image of a school building", src: "${iconUrl}" }}
    primaryHeaderText="Provide reading texts that enable students to write with evidence"
    secondaryHeaderText="Quill Reading for Evidence"
    tagText="new tool"
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
        {renderShadeOptionsElement()}
        <div className={shadeContainerStyle}>
          <PostNavigationBanner
            bannerColor={colorOption.value}
            bannerStyle={shadeOption}
            bodyText="Quickly archive last year's classes."
            buttons={[
              {
                href: "",
                text: "Learn more",
                standardButtonStyle: true,
                target: "_blank"
              },
              {
                href: "",
                text: "View activities",
                standardButtonStyle: true,
                target: "_blank"
              },
              {
                href: "",
                text: "See tool demo",
                standardButtonStyle: false,
                target: "_blank"
              },
              {
                href: "",
                text: "Get the Teacher Handbook",
                standardButtonStyle: false,
                target: "_blank"
              },
            ]}
            icon={{ alt: "Image of a school building", src: `${iconUrl}` }}
            primaryHeaderText="Provide reading texts that enable students to write with evidence"
            secondaryHeaderText="Quill Reading for Evidence"
            tagText="new tool"
          />
        </div>
      </div>
      <div className="element-container">
        <h3>Minimal</h3>
        <pre>
          {
            `
  <PostNavigationBanner
    bannerColor={colorOption.value}
    bannerStyle="minimal ${shadeOption}"
    bodyText="Quickly archive last year's classes."
    buttons={[
      {
        href: "",
        className: "extra-small contained",
        standardButtonStyle: true,
        text: "Action",
        target: "_blank"
      },
      {
        href: "",
        className: "extra-small outlined ${shadeOption === DARK_MODE ? 'transparent' : ''}",
        standardButtonStyle: true,
        text: "Action",
        target: "_blank"
      }
    ]}
    primaryHeaderText="Start of a new school year?"
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
        {renderShadeOptionsElement()}
        <div className={shadeContainerStyle}>
          <PostNavigationBanner
            bannerColor={colorOption.value}
            bannerStyle={`minimal ${shadeOption}`}
            bodyText="Quickly archive last year's classes"
            buttons={[
              {
                href: "",
                className: "extra-small contained",
                standardButtonStyle: true,
                text: "Action",
                target: "_blank"
              },
              {
                href: "",
                className: `extra-small outlined ${shadeOption === DARK_MODE ? 'transparent' : ''}`,
                standardButtonStyle: true,
                text: "Action",
                target: "_blank"
              }
            ]}
            primaryHeaderText="Start of the new school year?"
          />
        </div>
      </div>
      <div className="element-container">
        <h3>Premium</h3>
        <pre>
          {
            `
  <PostNavigationBanner
    bannerStyle="${premiumStyle}"
    bodyText="Quickly archive last year's classes."
    buttons={[
      {
        className: "nonstandard-banner-button",
        href: "",
        text: "Archive Classes",
        target: "_blank"
      }
    ]}
    icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/${premiumStyle}-large.svg" }}
    primaryHeaderText="Start of a new school year?"
    tagText="new"
  />
            `
          }
        </pre>
        <div className="premium-options-container">
          <h4>Premium options</h4>
          <div className="radio-options">
            <div className="radio">
              <label id={SCHOOL_OR_TEACHER_PREMIUM}>
                <input aria-labelledby={SCHOOL_OR_TEACHER_PREMIUM} checked={premiumOption === SCHOOL_OR_TEACHER_PREMIUM} onChange={handlePremiumOptionChange} type="radio" value={SCHOOL_OR_TEACHER_PREMIUM} />
                {SCHOOL_OR_TEACHER_PREMIUM}
              </label>
            </div>
            <div className="radio">
              <label id={DISTRICT_PREMIUM}>
                <input aria-labelledby={DISTRICT_PREMIUM} checked={premiumOption === DISTRICT_PREMIUM} onChange={handlePremiumOptionChange} type="radio" value={DISTRICT_PREMIUM} />
                {DISTRICT_PREMIUM}
              </label>
            </div>
          </div>
        </div>
        <PostNavigationBanner
          bannerStyle={premiumStyle}
          bodyText="Premium subscriptions for schools and districts interested in priority technical support, additional reporting, and support from Quill's professional learning team--plus an option for individual teachers"
          buttons={[
            {
              href: "",
              standardButtonStyle: true,
              text: "Explore Premium",
              target: "_blank"
            }
          ]}
          icon={{ alt: "Image of a school building", src: `https://assets.quill.org/images/banners/${premiumStyle}-large.svg` }}
          primaryHeaderText="Learn More About Quill Premium"
        />
      </div>
    </div>
  )
}

export default PostNavigationBanners
