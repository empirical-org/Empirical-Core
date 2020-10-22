class ActivityClassification < ActiveRecord::Base

  include Uid

  has_many :activities, dependent: :destroy
  has_many :concept_results

  validates :key, presence: true

  DIAGNOSTIC_KEY = 'diagnostic'
  PROOFREADER_KEY = 'passage'
  LESSONS_KEY = 'lessons'

  def self.diagnostic
    find_by_key DIAGNOSTIC_KEY
  end

end
