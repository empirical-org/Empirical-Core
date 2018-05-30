FactoryBot.define do
  factory :blog_post do
    title                { Faker::Book.title }
    subtitle             { Faker::Book.title }
    body                 { Faker::Book.title }
    topic                { BlogPost::TOPICS.sample }
    preview_card_content "<img class='preview-card-image' src='http://placehold.it/300x135' /><div class='preview-card-body'><h3>Write Your Title Here</h3><p>Write your description here, but be careful not to make it too long!</p><p class='author'>by Quill Staff</p></div>"
    draft                false

    trait :premium do
      premium true
    end

    trait :draft do
      draft true
    end
  end
end
