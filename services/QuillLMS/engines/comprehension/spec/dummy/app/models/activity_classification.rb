class ActivityClassification < ApplicationRecord
  EVIDENCE_KEY = 'evidence'

  def self.evidence
    find_by_key EVIDENCE_KEY
  end
end
