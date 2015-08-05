class Concept < ActiveRecord::Base
  include Uid
  belongs_to :parent, class_name: 'Concept', foreign_key: :parent_id
  validates :name, presence: true
end