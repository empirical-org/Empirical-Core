# frozen_string_literal: true

FactoryBot.define do
  factory :partner_content do
    partner PartnerContent::AMPLIFY
    content { create(:unit_template) }
  end
end
