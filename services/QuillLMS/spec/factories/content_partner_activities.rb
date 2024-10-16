# frozen_string_literal: true

# == Schema Information
#
# Table name: content_partner_activities
#
#  id                 :integer          not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  activity_id        :integer
#  content_partner_id :integer
#
# Indexes
#
#  index_content_partner_activities_on_activity_id         (activity_id)
#  index_content_partner_activities_on_content_partner_id  (content_partner_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (content_partner_id => content_partners.id)
#
FactoryBot.define do
  factory :content_partner_activity do
    content_partner { ContentPartner.last || create(:content_partner) }
    activity { Activity.last || create(:activity) }
  end
end
