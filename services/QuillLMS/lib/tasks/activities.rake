namespace :activities do
  desc 'Strip name prefixes like Sentence Writing: and Passage Proofreading: '
  task :strip_name_prefixes => :environment do
    prefixes = [
      'Sentence Writing: ',
      'Passage Proofreading: '
    ]
    Activity.find_each do |activity|
      prefixes.each do |prefix|
        if activity.name.present?
          activity.name = activity.name.gsub(prefix, '')
        end
      end
      activity.save!
    end

  end
end