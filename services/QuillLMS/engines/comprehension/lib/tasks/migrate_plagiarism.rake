namespace :plagiarism do

  desc "Migrates old plagiarism from fields on Prompt to new models PlagiarismText and Feedback"

  task :migrate => :environment do |t, args|
    concept = Concept.create!(name: 'Plagiarism', uid: SecureRandom.uuid, visible: false)
    Comprehension::Prompt.all.each do |prompt|
      if prompt.plagiarism_text.present?
        rule = Comprehension::Rule.create!(name: 'Plagiarism', rule_type: Comprehension::Rule::TYPE_PLAGIARISM, universal: false, optimal: false, suborder: 0, concept_uid: concept.uid)
        Comprehension::PromptsRule.create(rule_id: rule.id, prompt_id: prompt.id)
        Comprehension::Feedback.create(text: prompt.plagiarism_first_feedback, order: 0, rule_id: rule.id)
        Comprehension::Feedback.create(text: prompt.plagiarism_second_feedback, order: 1, rule_id: rule.id)
        Comprehension::PlagiarismText.create(text: prompt.plagiarism_text, rule_id: rule.id)
      end
    end
  end
end
