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
      source_activity = JSON.parse(response.body)
      activity = Comprehension::Activity.create(
        title: source_activity['title'],
        target_level: source_activity['target_reading_level'] || 12,
        passages: source_activity['passages'].map { |p| Comprehension::Passage.new(text: p['text']) },
        prompts: source_activity['prompts'].map { |p|
          Comprehension::Prompt.new(
            max_attempts: p['max_attempts'],
            max_attempts_feedback: p['max_attempts_feedback'],
            text: p['text'].split[0..-2],
            conjunction: p['text'].split[-1]
          )
        }
      )
    end
  end
end
