namespace :concepts do
  desc 'make demo accounts'
  task :create => :environment do
    create_concepts
  end
end

def create_concepts
  file = Rails.root.join('db', 'concepts_2.csv')
  
  arr_arr = []
  
  CSV.foreach(file) do |row|
    concept_name = row[0]
    rule_question_id = row[1]
    concept = Concept.find_or_create_by(name: concept_name)
    
    arr = [rule_question_id, concept.id]
    arr_arr.push arr
    msg = "concept_name: #{concept.name} \n rule_question_id : #{rule_question_id}"
    Rails.logger.info msg
  end

  output = Rails.root.join('db', 'concepts_2_output.csv')
  CSV.open(file, 'wb') do |csv|
    arr_arr.each do |arr|
      csv << arr
    end
  end
end