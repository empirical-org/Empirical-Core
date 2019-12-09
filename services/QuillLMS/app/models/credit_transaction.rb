class CreditTransaction < ActiveRecord::Base
  belongs_to :user
  belongs_to :source, polymorphic: true

  def action
    if source_type == 'Subscription'
      'You subscribed to Quill Premium'
    elsif source_type == 'ReferralsUser'
      'Someone you referred became a Quill user'
    end
  end
end
