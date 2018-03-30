class CreditTransaction < ActiveRecord::Base
  belongs_to :user
  belongs_to :source, polymorphic: true
end
