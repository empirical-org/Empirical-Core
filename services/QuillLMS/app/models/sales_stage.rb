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
