# frozen_string_literal: true

# == Schema Information
#
# Table name: authors
#
#  id     :integer          not null, primary key
#  avatar :text
#  name   :string
#
FactoryBot.define do
  factory :author do
    sequence(:name) { |n| "Author Name #{n}"}
    avatar { "https://placehold.it/300x300.png" }
  end
end
