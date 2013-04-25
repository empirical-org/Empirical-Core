class Rule < ActiveRecord::Base
  attr_accessible :body, :chapter_id, :order
  belongs_to :chapter
  has_many :lessons
end
