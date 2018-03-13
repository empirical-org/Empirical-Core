class SalesAccount < ActiveRecord::Base
  belongs_to :school

  STAGES = [
    'quill_basic_subscription',
    'quill_teacher_subscription',
    'in_conversation',
    'quote_accepted',
    'purchase_order_received',
    'invoice_sent',
    'quill_premium_subscription',
    'professional_development_scheduled',
    'professional_development_completed'
  ]

  DEFAULT_STAGES_DATA = Hash.new.tap do |hash|
    STAGES.each do |stage|
      hash[stage] = nil
    end
  end

  def stages
    DEFAULT_STAGES_DATA.merge(data)
  end
end
