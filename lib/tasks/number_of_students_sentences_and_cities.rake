namespace :number_of_students_sentences_and_cities do
  task set: :environment do
    last_set = $redis.get("NUMBER_OF_STUDENTS_SENTENCES_AND_CITIES_LAST_SET")
    if !last_set || 7.days.ago >= Date.parse(last_set, "%d-%m-%Y")
      SetNumberOfStudentsSentencesAndCitiesWorker.perform_async
    end
  end
end
