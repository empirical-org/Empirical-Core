class ChangeLog < ActiveRecord::Base
  belongs_to :changed, polymorphic: true
  belongs_to :user
end
