FactoryBot.define do
  data = {questionType: "questions", questions: []}

  factory :simple_activity, class: 'Activity' do; end

  factory :activity do
    sequence(:name) do |n|
      loop do
        possible_name = "Unique Activity #{n}"
        break possible_name unless Activity.exists?(name: possible_name)
      end
    end
    description             { "This is the description for the '#{name}' activity." }
    uid                     { SecureRandom.urlsafe_base64 }
    standard                   { Standard.first || create(:standard) }
    classification          { create(:classification) }
    activity_categories     { create_pair(:activity_category) }
    repeatable              true
    data                    data

    factory :diagnostic_activity do
      classification { ActivityClassification.find_by_key attributes_for(:diagnostic)[:key] || create(:diagnostic) }
      activity_classification_id { ActivityClassification.find_by_key(attributes_for(:diagnostic)[:key])&.id || create(:diagnostic).id }
      repeatable false
    end

    factory :proofreader_activity do
      classification { ActivityClassification.find_by_key attributes_for(:proofreader)[:key] || create(:proofreader) }
      activity_classification_id { ActivityClassification.find_by_key(attributes_for(:proofreader)[:key])&.id || create(:proofreader).id }
    end

    factory :grammar_activity do
      classification { ActivityClassification.find_by_key attributes_for(:grammar)[:key] || create(:grammar) }
      activity_classification_id { ActivityClassification.find_by_key(attributes_for(:grammar)[:key])&.id || create(:grammar).id }
    end

    factory :connect_activity do
      classification { ActivityClassification.find_by_key(attributes_for(:connect)[:key]) || create(:connect) }
      activity_classification_id { ActivityClassification.find_by_key(attributes_for(:connect)[:key])&.id || create(:connect).id }
    end

    factory :lesson_activity do
      classification { ActivityClassification.find_by_key attributes_for(:lesson_classification)[:key] || create(:lesson_classification) }
      activity_classification_id { ActivityClassification.find_by_key(attributes_for(:lesson_classification)[:key])&.id || create(:lesson_classification).id }
      repeatable false
      supporting_info { "https://www.example.com/example.pdf" }

      trait :with_follow_up do
        follow_up_activity { create(:lesson_activity) }
      end
    end

    trait :production do
      flags ['production']
    end

    trait :archived do
      flags ['archived']
    end

    trait :alpha do
      flags ['alpha']
    end
  end
end
