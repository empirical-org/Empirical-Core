class Lesson < ActiveRecord::Base
  attr_accessible :body, :chapter_id, :order, :rule_id
  belongs_to :chapter
  belongs_to :rule
end
