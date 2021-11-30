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
class ContentPartnerActivity < ApplicationRecord
  belongs_to :content_partner
  belongs_to :activity
end
