namespace :connect do
  desc "Batch change flags  for connect activities"
  task :alpha_to_archived => :environment do
    question_type = 'connect_fill_in_blanks'
    flag_to_replace = 'alpha'
    flag_to_set = 'archived'

    questions = Question.where(question_type: question_type).where("data->>'flag' = ?", flag_to_replace)
    questions.each do |q|
      q.data['flag'] = flag_to_set
      q.save
    end
  end
end
