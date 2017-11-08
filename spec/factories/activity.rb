FactoryBot.define do
  factory :activity do
    name                    { "#{Faker::Color.color_name} #{Faker::Book.genre} Activity".titleize }
    description             { "This is the description for the '#{name}' activity." }
    uid                     { SecureRandom.urlsafe_base64 }
    topic                   { FactoryBot.create(:topic) }
    classification          { FactoryBot.create(:classification) }
    activity_categories     { create_pair(:activity_category) }
    repeatable              true

    factory :diagnostic_activity do
      classification { ActivityClassification.find_by_key FactoryBot.attributes_for(:diagnostic)[:key] || FactoryBot.create(:diagnostic) }
      repeatable false
    end

    factory :proofreader_activity do
      classification { ActivityClassification.find_by_key FactoryBot.attributes_for(:proofreader)[:key] || FactoryBot.create(:proofreader) }
    end

    factory :grammar_activity do
      classification { ActivityClassification.find_by_key FactoryBot.attributes_for(:grammar)[:key] || FactoryBot.create(:grammar) }
    end

    factory :connect_activity do
      classification { ActivityClassification.find_by_key FactoryBot.attributes_for(:connect)[:key] || FactoryBot.create(:connect) }
    end

    factory :lesson_activity do
      classification { ActivityClassification.find_by_key FactoryBot.attributes_for(:lesson)[:key] || FactoryBot.create(:lesson) }
      repeatable false
      supporting_info { "#{Faker::Internet.url}.pdf" }

      trait :with_follow_up do
        follow_up_activity { FactoryBot.create(:lesson_activity) }
      end
    end

    trait :published do
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
