class ActivityClassification < ActiveRecord::Base

  include Uid

  has_many :activities, dependent: :destroy
  has_many :concept_results

  validates :key, uniqueness: true, presence: true


  def self.diagnostic
    ActivityClassification.find_by_key "diagnostic"
  end

end
