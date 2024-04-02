# frozen_string_literal: true

# == Schema Information
#
# Table name: partner_contents
#
#  id           :integer          not null, primary key
#  content_type :string(50)
#  order        :integer
#  partner      :string(50)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  content_id   :integer
#
# Indexes
#
#  index_partner_contents_on_content_type_and_content_id  (content_type,content_id)
#  index_partner_contents_on_partner                      (partner)
#
FactoryBot.define do
  factory :partner_content do
    partner { PartnerContent::AMPLIFY }
    content { create(:unit_template) }
  end
end
