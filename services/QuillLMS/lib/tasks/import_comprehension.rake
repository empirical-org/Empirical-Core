require 'httparty'
require 'comprehension'

namespace :import_comprehension do

  desc "Import records from existing Comprehension API with the base URL of the Comprehension API you want to import from as the arg: `rake import_comprehension:activities[https://comprehension-247816.appspot.com]`"

  task :activities, [:options] => :environment do |t, args|
    base_url = args[:options]
    activities_list_url = "#{base_url}/api/activities.json"
    response = HTTParty.get(activities_list_url)
    all_activities = JSON.load(response.body)
    all_activities.each do |a|
      activities_url = "#{base_url}/api/activities/#{a["id"]}.json"
      response = HTTParty.get(activities_url)
      source_activity = JSON.load(response.body)
      Comprehension::Activity.transaction do
        begin
          new_activity = Comprehension::Activity.create! do |act|
            act.title = source_activity['title']
            act.target_level = source_activity['target_reading_level'] || 12
          end
          source_activity['passages'].each do |source_passage|
            Comprehension::Passage.create! do |passage|
              passage.text = source_passage['text']
              passage.activity = new_activity
            end
          end
          source_activity['prompts'].each do |source_prompt|
            Comprehension::Prompt.create! do |prompt|
              prompt.activity = new_activity
              prompt.max_attempts = source_prompt['max_attempts']
              prompt.max_attempts_feedback = source_prompt['max_attempts_feedback']
              prompt.text = source_prompt['text'].split[0..-2]
              prompt.conjunction = source_prompt['text'].split[-1]
            end
          end
        rescue ActiveRecord::RecordInvalid => err
          raise ActiveRecord::Rollback
        end
      end
    end
  end
end
