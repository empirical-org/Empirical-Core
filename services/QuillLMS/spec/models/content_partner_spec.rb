require 'rails_helper'

describe ContentPartner do
  it {
    should validate_presence_of :name
    should have_many :content_partner_activities
  }
end
