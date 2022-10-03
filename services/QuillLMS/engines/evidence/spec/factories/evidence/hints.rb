# frozen_string_literal: true

FactoryBot.define do
  factory :evidence_hint, class: 'Evidence::Hint' do
    name { "Hint Name" }
    explanation { "This is an explanation." }
    image_link { "https://quill.org" }
    image_alt_text { "Text that describes the picture" }
  end
end
