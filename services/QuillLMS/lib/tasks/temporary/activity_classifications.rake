# frozen_string_literal: true

namespace :activity_classifications do
  desc 'Configure Evidence ActivityClassification to be unscored'
  task :make_evidence_unscored => :environment do
    evidence = ActivityClassification.find_by(key: 'evidence')
    evidence.update(scored: false)
  end
end
