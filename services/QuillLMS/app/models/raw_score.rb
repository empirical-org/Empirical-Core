class RawScore < ActiveRecord::Base
  validates :name, presence: true
end
