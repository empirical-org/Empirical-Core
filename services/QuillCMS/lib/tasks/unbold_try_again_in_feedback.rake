desc "Unbold all instances of 'Try again' in hand graded response feedback"

namespace :responses do
  task :unbold_all => :environment do
    ActiveRecord::Base.connection.execute("
      UPDATE responses
      SET feedback = REGEXP_REPLACE(feedback, '<strong>(Try.*)</strong>','\\1')
      WHERE author = ''
      AND (feedback LIKE '<strong>Try%' OR feedback LIKE '<p><strong>Try%')
    ")
  end
end
