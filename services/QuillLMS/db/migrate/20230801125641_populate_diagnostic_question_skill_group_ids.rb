class PopulateDiagnosticQuestionSkillGroupIds < ActiveRecord::Migration[6.1]
  def change
    table = CSV.parse(File.read("lib/data/test_skill_to_question_mapping.csv"), headers: true)
    table.each do |row|
      begin
        question = Question.find_by_uid(row["Question ID"])
        question.update(skill_group_id: row["Skill Group ID"])
      rescue => e
        puts e
      end
    end
  end
end
