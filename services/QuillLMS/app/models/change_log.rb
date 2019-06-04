class ChangeLog < ActiveRecord::Base
  belongs_to :changed_record, polymorphic: true
  belongs_to :user
end
