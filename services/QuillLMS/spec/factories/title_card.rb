FactoryBot.define do
  factory :title_card do
    uid      SecureRandom.uuid
    content  'Some test content'
    title    'Card Title'
  end
end
