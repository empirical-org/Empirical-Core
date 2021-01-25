# == Schema Information
#
# Table name: sales_stages
#
#  id                  :integer          not null, primary key
#  completed_at        :datetime
#  created_at          :datetime
#  updated_at          :datetime
#  sales_contact_id    :integer          not null
#  sales_stage_type_id :integer          not null
#  user_id             :integer
#
# Indexes
#
#  index_sales_stages_on_sales_contact_id     (sales_contact_id)
#  index_sales_stages_on_sales_stage_type_id  (sales_stage_type_id)
#  index_sales_stages_on_user_id              (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (sales_contact_id => sales_contacts.id)
#  fk_rails_...  (sales_stage_type_id => sales_stage_types.id)
#  fk_rails_...  (user_id => users.id)
#
class SalesStage < ActiveRecord::Base
  validates :sales_stage_type, uniqueness: { scope: :sales_contact }
  validates :sales_stage_type, presence: true
  validates :sales_contact, presence: true

  belongs_to :sales_contact
  belongs_to :sales_stage_type
  belongs_to :user

  def name
    "#{sales_stage_type.order}. #{sales_stage_type.name}"
  end

  def name_param
    sales_stage_type.name_param
  end

  def description
    sales_stage_type.description
  end

  def trigger
    sales_stage_type.trigger
  end

  def number
    sales_stage_type.order
  end
end
