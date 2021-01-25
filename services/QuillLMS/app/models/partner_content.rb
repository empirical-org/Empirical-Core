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
class PartnerContent < ActiveRecord::Base
  PARTNERS = [
    AMPLIFY = 'amplify'
  ]
  CONTENT_TYPES = [
    UNIT_TEMPLATE_TYPE = 'UnitTemplate'
  ]
  MAX_PARTNER_LENGTH = 50
  MAX_TYPE_LENGTH = 50

  belongs_to :content, polymorphic: true

  validates :partner, presence: true, length: {maximum: MAX_PARTNER_LENGTH}, inclusion: {in: PARTNERS}
  validates :content_type, presence: true, length: {maximum: MAX_TYPE_LENGTH}, inclusion: {in: CONTENT_TYPES}
  validates :content_id, presence: true, uniqueness: {scope: [:content_type, :partner]}

  scope :amplify, -> {where(partner: AMPLIFY)}
  scope :only_unit_templates, -> {where(content_type: UNIT_TEMPLATE_TYPE)}
end
