# frozen_string_literal: true

module AboutUsHelper
  ABOUT_US = 'About Us'
  IMPACT = 'Impact'
  PATHWAYS_INITIATIVE = 'Pathways Initiative'
  TEAM = 'Team'
  CAREERS = 'Careers'
  PRESS = 'Press'

  def about_us_tabs(large: true)
    [
      {
        id: ABOUT_US,
        name: large ? ABOUT_US : 'About',
        url: '/about'
      },
      {
        id: IMPACT,
        name: IMPACT,
        url: '/impact'
      },
      {
        id: PATHWAYS_INITIATIVE,
        name: large ? PATHWAYS_INITIATIVE : 'Pathways',
        url: '/pathways'
      },
      {
        id: TEAM,
        name: TEAM,
        url: '/team'
      },
      {
        id: CAREERS,
        name: CAREERS,
        url: '/careers'
      },
      {
        id: PRESS,
        name: PRESS,
        url: '/press'
      }
    ]
  end
end
