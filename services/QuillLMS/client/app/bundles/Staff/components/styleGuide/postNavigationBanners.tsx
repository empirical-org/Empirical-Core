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

const PostNavigationBanners = () => {
  const [colorOption, setColorOption] = React.useState<DropdownObjectInterface>(COLOR_OPTIONS[0]);
  const [premiumOption, setPremiumOption] = React.useState<string>(PREMIUM_OPTIONS[0]);

  function handleColorOptionChange(option: DropdownObjectInterface) {
    setColorOption(option)
  }

  function handlePremiumOptionChange(e) {
    setPremiumOption(e.target.value)
  }

  const premiumStyle = premiumOption === DISTRICT_PREMIUM ? "district-premium" : "premium"

  return(
    <div id="post-navigation-banners">
      <h2 className="style-guide-h2">Banners</h2>
      <div className="element-container">
        <h3>Standard Banner with one button</h3>
        <pre>
          {
            `
  <PostNavigationBanner
    bannerStyle="${colorOption.value}"
    bodyText="Quickly archive last year's classes."
    buttons={[
      {
        href: "",
        standardButtonStyle: false,
        text: "Archive Classes",
        target: "_blank"
      }
    ]}
    icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/large-school-campus-${colorOption.value}.svg" }}
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
        <PostNavigationBanner
          bannerStyle={colorOption.value}
          bodyText="Quickly archive last year's classes."
          buttons={[
            {
              href: "",
              standardButtonStyle: false,
              text: "Archive Classes",
              target: "_blank"
            }
          ]}
          icon={{ alt: "Image of a school building", src: `https://assets.quill.org/images/banners/large-school-campus-${colorOption.value}.svg` }}
          primaryHeaderText="Start of a new school year?"
          tagText="new"
        />
      </div>
      <div className="element-container">
        <h3>Standard Banner with multiple buttons</h3>
        <pre>
          {
            `
  <PostNavigationBanner
    bannerStyle="${colorOption.value}"
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
    icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/large-school-campus-${colorOption.value}.svg" }}
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
        <PostNavigationBanner
          bannerStyle={colorOption.value}
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
          icon={{ alt: "Image of a school building", src: `https://assets.quill.org/images/banners/large-school-campus-${colorOption.value}.svg` }}
          primaryHeaderText="Provide reading texts that enable students to write with evidence"
          secondaryHeaderText="Quill Reading for Evidence"
          tagText="new tool"
        />
      </div>
      <div className="element-container">
        <h3>Premium Banner</h3>
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
