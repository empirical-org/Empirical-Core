class Assignment < ActiveRecord::Base
  attr_accessible :chapter_id, :classcode, :due_date, :user_id
  belongs_to :user
  belongs_to :chapter
  has_many :scores, dependant: :destroy
end
