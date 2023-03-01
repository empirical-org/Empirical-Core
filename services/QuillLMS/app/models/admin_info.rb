# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_infos
#
#  id                  :bigint           not null, primary key
#  approval_status     :string
#  approver_role       :string
#  sub_role            :string
#  verification_reason :text
#  verification_url    :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint           not null
#
# Indexes
#
#  index_admin_infos_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class AdminInfo < ApplicationRecord
  belongs_to :user
  has_many :admin_approval_requests

  validates :user_id, presence: true, uniqueness: true

  APPROVAL_STATUSES = [
    APPROVED = 'Approved',
    PENDING = 'Pending',
    DENIED = 'Denied',
    SKIPPED = 'Skipped'
  ]

  SUB_ROLES = [
    INSTRUCTIONAL_COACH = "Instructional coach",
    DEPARTMENT_HEAD = "Department head",
    SCHOOL_ADMINISTRATOR = "School administrator",
    DISTRICT_ADMINISTRATOR = "District administrator",
    TECH_COORDINATOR = "Tech coordinator",
    LIBRARIAN_SLASH_MEDIA_SPECIALIST = "Librarian/media specialist",
    BILLING_CONTACT = "Billing contact"
  ]

  APPROVER_ROLES = [
    User::ADMIN,
    User::STAFF
  ]

  validates :approval_status, :inclusion=> { :in => APPROVAL_STATUSES }, :allow_nil => true

  validates :sub_role, :inclusion=> { :in => SUB_ROLES }, :allow_nil => true

  validates :approver_role, :inclusion=> { :in => APPROVER_ROLES }, :allow_nil => true

  def admin
    user
  end

  def admin_id
    user_id
  end

  def admin=(value)
    self.user = value
  end

  def admin_id=(value)
    self.user_id = value
  end
end
