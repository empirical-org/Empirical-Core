class ContentPartnerActivity < ActiveRecord::Base
  belongs_to :content_partner
  belongs_to :activity
end
