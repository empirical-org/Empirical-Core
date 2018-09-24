class CreditTransaction < ActiveRecord::Base
  belongs_to :user
  belongs_to :source, polymorphic: true

  def action
    if self.source_type == 'Subscription'
      'You subscribed to Quill Premium'
    elsif self.source_type == 'ReferralsUser' 
      'Someone you referred became a Quill user'
    end
  end
end
