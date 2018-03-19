class SalesStage < ActiveRecord::Base
  belongs_to :sales_contact
  belongs_to :sales_stage_type

  def name
    "#{sales_stage_type.order}. #{sales_stage_type.name}"
  end

  def description
    sales_stage_type.description
  end

  def action
    "Automatic"
  end
end
