namespace :activity_classifications do
  desc 'Configure Comprehension ActivityClassification to be unscored'
  task :make_comprehension_unscored => :environment do
    comprehension = ActivityClassification.find_by(key: 'comprehension')
    comprehension.update(scored: false)
  end
end
