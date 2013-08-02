class Assignment < ActiveRecord::Base
  belongs_to :user
  belongs_to :chapter
  has_many :scores, dependent: :destroy

  class << self
    def temporary chapter
      assignment = new
      assignment.temporary = true
      assignment.chapter = chapter
      assignment.save!
      assignment
    end
  end
end
