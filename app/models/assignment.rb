class Assignment < ActiveRecord::Base
  belongs_to :user
  belongs_to :chapter
  has_many :scores, dependent: :destroy
  default_scope joins(:chapter).order("chapters.title ASC")

  class << self
    def temporary chapter, options = {}
      assignment = new
      assignment.temporary = true
      assignment.chapter = chapter
      score = assignment.scores.build(user: options[:user])
      assignment.save!
      [assignment, score]
    end
  end
end
