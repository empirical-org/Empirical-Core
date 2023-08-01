# frozen_string_literal: true

namespace :diagnostic_question_skills do
  desc 'Populate diagnostic question skills table'
  task :populate => :environment do
    skill_to_question_mapping = CSV.parse(File.read("lib/data/skill_to_question_mapping.csv"), headers: true)

    ActiveRecord::Base.transaction do
      skill_to_question_mapping.each do |row|
        begin
          question = Question.find_by_uid(row['Question ID'])
          DiagnosticQuestionSkill.create(question: question, skill_group_id: row['Skill Group ID'], name: row['Skill Name'])
        rescue => e
          puts "ID:#{row['Question ID']}: #{e}"
        end
      end
    end

  end
end
