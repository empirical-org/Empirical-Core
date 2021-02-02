namespace :plagiarism do

  desc "Migrates old plagiarism from fields on Prompt to new models PlagiarismText and Feedback"

  task :migrate => :environment do |t, args|
    CONCEPT_ID = 863
    concept = Concept.find(CONCEPT_ID)
    ActiveRecord::Base.transaction do
      Comprehension::Prompt.all.each do |prompt|
        next unless prompt.plagiarism_text.present? && Comprehension::Rule.where(name: 'Plagiarism').joins(:prompts).merge( Comprehension::Prompt.where(id: prompt.id)).empty?
        rule = Comprehension::Rule.create!(name: 'Plagiarism', rule_type: Comprehension::Rule::TYPE_PLAGIARISM, universal: false, optimal: false, suborder: 0, concept_uid: concept.uid)
        Comprehension::PromptsRule.create!(rule_id: rule.id, prompt_id: prompt.id)
        Comprehension::Feedback.create!(text: prompt.plagiarism_first_feedback, order: 0, rule_id: rule.id) if prompt.plagiarism_first_feedback.present?
        Comprehension::Feedback.create!(text: prompt.plagiarism_second_feedback, order: 1, rule_id: rule.id) if prompt.plagiarism_second_feedback.present?
        Comprehension::PlagiarismText.create!(text: prompt.plagiarism_text, rule_id: rule.id)
      end
    end
  end
end
