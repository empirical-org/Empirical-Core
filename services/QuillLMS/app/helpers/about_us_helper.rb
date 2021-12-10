# frozen_string_literal: true

module AboutUsHelper
  def about_us_tabs(large: true)
    [
      {name: large ? 'About Us' : 'About', url: 'about'},
      {name: 'Impact', url: 'impact'},
      {name: large ? 'Pathways Initiative' : 'Pathways', url: 'pathways'},
      {name: 'Team', url: 'team'},
      {name: 'Careers', url: 'careers'},
      {name: 'Press', url: 'press'}
    ]
  end
end
