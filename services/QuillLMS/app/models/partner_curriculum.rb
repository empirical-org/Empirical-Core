class PartnerCurriculum < ActiveRecord::Base
  PARTNERS = [
    AMPLIFY = 'amplify'
  ]
  CURRICULUM_TYPES = [
    UNIT_TEMPLATE_TYPE = 'UnitTemplate'
  ]
  MAX_PARTNER_LENGTH = 50
  MAX_TYPE_LENGTH = 50

  belongs_to :curriculum, polymorphic: true

  validates :partner, presence: true, length: {maximum: MAX_PARTNER_LENGTH}, inclusion: {in: PARTNERS}
  validates :curriculum_type, presence: true, length: {maximum: MAX_TYPE_LENGTH}, inclusion: {in: CURRICULUM_TYPES}
  validates :curriculum_id, presence: true, uniqueness: {scope: [:curriculum_type, :partner]}

  scope :amplify, -> {where(partner: AMPLIFY)}
  scope :only_unit_templates, -> {where(curriculum_type: UNIT_TEMPLATE_TYPE)}
end
