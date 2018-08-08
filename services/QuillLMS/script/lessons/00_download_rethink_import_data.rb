require 'rubygems'
require 'json'
require 'HTTParty'

lessons = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v2/classroom_lessons.json")
lessons_with_ids = []
lessons.each do |k, v|
  v['id'] = k
  lessons_with_ids.push(v)
end
file_path = Rails.root.join('tmp', 'lessons.json')
File.write(file_path, lessons_with_ids.to_json)

edition_metadata = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v2/lesson_edition_metadata.json")
metadata_with_ids = []
edition_metadata.each do |k, v|
  v['id'] = k
  metadata_with_ids.push(v)
end
file_path = Rails.root.join('tmp', 'metadata.json')

edition_questions = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v2/lesson_edition_questions.json")
edition_questions_with_ids = []
edition_questions.each do |k, v|
  v['id'] = k
  edition_questions_with_ids.push(v)
end
file_path = Rails.root.join('tmp', 'edition_questions.json')

reviews = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v2/reviews.json")
reviews_with_ids = []
reviews.each do |k, v|
  v['id'] = k
  reviews_with_ids.push(v)
end
file_path = Rails.root.join('tmp', 'reviews.json')
