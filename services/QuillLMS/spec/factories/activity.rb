FactoryBot.define do
  factory :simple_activity, class: 'Activity' do; end

  factory :activity do
    sequence(:name) do |n|
      loop do
        possible_name = "#{Faker::Color.color_name} #{Faker::Book.genre} Activity #{n}"
        break possible_name unless Activity.exists?(name: possible_name)
      end
    end
    description             { "This is the description for the '#{name}' activity." }
    uid                     { SecureRandom.urlsafe_base64 }
    topic                   { Topic.first || create(:topic) }
    classification          { create(:classification) }
    activity_categories     { create_pair(:activity_category) }
    repeatable              true

    factory :diagnostic_activity do
      classification { ActivityClassification.find_by_key attributes_for(:diagnostic)[:key] || create(:diagnostic) }
      repeatable false
    end

    factory :proofreader_activity do
      classification { ActivityClassification.find_by_key attributes_for(:proofreader)[:key] || create(:proofreader) }
    end

    factory :grammar_activity do
      classification { ActivityClassification.find_by_key attributes_for(:grammar)[:key] || create(:grammar) }
    end

    factory :connect_activity do
      classification { ActivityClassification.find_by_key attributes_for(:connect)[:key] || create(:connect) }
    end

    factory :lesson_activity do
      classification { ActivityClassification.find_by_key attributes_for(:lesson)[:key] || create(:lesson) }
      repeatable false
      supporting_info { "#{Faker::Internet.url}.pdf" }

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
