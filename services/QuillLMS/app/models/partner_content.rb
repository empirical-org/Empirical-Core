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
