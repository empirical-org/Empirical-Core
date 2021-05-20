require 'httparty'
require 'comprehension'

namespace :import_comprehension do

  desc "Import records from existing Comprehension API with the base URL of the Comprehension API you want to import from as the arg: `rake import_comprehension:activities[https://comprehension-247816.appspot.com]`"

  task :activities, [:options] => :environment do |t, args|
    base_url = args[:options]
    activities_list_url = "#{base_url}/api/activities.json"
    response = HTTParty.get(activities_list_url)
    all_activities = JSON.parse(response.body)
    all_activities.each do |a|
      activities_url = "#{base_url}/api/activities/#{a['id']}.json"
      regex_rules_url = "#{base_url}/api/activities/#{a['id']}/rulesets.json"
      response = HTTParty.get(activities_url)
      source_activity = JSON.parse(response.body)
      response = HTTParty.get(regex_rules_url)
      source_regex_rules = JSON.parse(response.body) | []
      activity = Comprehension::Activity.create(
        title: source_activity['title'],
        target_level: source_activity['target_reading_level'] || 12,
        passages: source_activity['passages'].map { |p| Comprehension::Passage.new(text: p['text']) },
        prompts: source_activity['prompts'].map do |p|
          Comprehension::Prompt.new(
            max_attempts: p['max_attempts'],
            max_attempts_feedback: p['max_attempts_feedback'],
            text: p['text'].split[0..-2].join(' '),
            conjunction: p['text'].split[-1]
          )
        end,
        rule_sets: source_regex_rules.each_with_index.map do |r, i|
          Comprehension::RuleSet.new(
            name: r['name'][0,100],
            feedback: r['name'],
            priority: i,
            rules: r['rules'].map { |rule| Comprehension::Rule.new(regex_text: rule['regex_text'], case_sensitive: rule['case_sensitive']) }
          )
        end
      )
    end
  end
end
