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
system('rethinkdb import -f  ~/lessons.json --format json --table quill_lessons.classroom_lessons --force')
File.delete(file_path)
# ReQL import statement for data uploaded to s3:
# r.db('quill_lessons').table('classroom_lessons').insert(r.http('https://s3.amazonaws.com/quill-tmp/lessons.json', {resultFormat:'json'}), {conflict:'replace'})

edition_metadata = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v2/lesson_edition_metadata.json")
metadata_with_ids = []
edition_metadata.each do |k, v|
  v['id'] = k
  metadata_with_ids.push(v)
end
file_path = Rails.root.join('tmp', 'metadata.json')
File.write(file_path, metadata_with_ids.to_json)
system('rethinkdb import -f  ~/metadata.json --format json --table quill_lessons.lesson_edition_metadata --force')
File.delete(file_path)
# ReQL import statement for data uploaded to s3:
# r.db('quill_lessons').table('lesson_edition_metadata').insert(r.http('https://s3.amazonaws.com/quill-tmp/metadata.json', {resultFormat:'json'}), {conflict:'replace'})

edition_questions = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v2/lesson_edition_questions.json")
edition_questions_with_ids = []
edition_questions.each do |k, v|
  v['id'] = k
  edition_questions_with_ids.push(v)
end
file_path = Rails.root.join('tmp', 'edition_questions.json')
File.write(file_path, edition_questions_with_ids.to_json)
system('rethinkdb import -f  ~/edition_questions.json --format json --table quill_lessons.lesson_edition_questions --force')
File.delete(file_path)
# ReQL import statement for data uploaded to s3:
# r.db('quill_lessons').table('lesson_edition_questions').insert(r.http('https://s3.amazonaws.com/quill-tmp/edition_questions.json', {resultFormat:'json'}), {conflict:'replace'})

reviews = HTTParty.get("#{ENV['FIREBASE_DATABASE_URL']}/v2/reviews.json")
reviews_with_ids = []
reviews.each do |k, v|
  v['id'] = k
  reviews_with_ids.push(v)
end
file_path = Rails.root.join('tmp', 'reviews.json')
File.write(file_path, reviews_with_ids.to_json)
system('rethinkdb import -f  ~/reviews.json --format json --table quill_lessons.reviews --force')
File.delete(file_path)
# ReQL import statement for data uploaded to s3:
# r.db('quill_lessons').table('reviews').insert(r.http('https://s3.amazonaws.com/quill-tmp/reviews.json', {resultFormat:'json'}), {conflict:'replace'})
