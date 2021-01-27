namespace :plagiarism do

  desc "Migrates old plagiarism from fields on Prompt to new models PlagiarismText and Feedback"

  task :migrate => :environment do |t, args|
    # waiting on Lindsey to provide the final ID of the Plagiarism Concept
    CONCEPT_ID = 0
    concept = Concept.find(CONCEPT_ID)
    Comprehension::Prompt.all.each do |prompt|
      next unless prompt.plagiarism_text.present?
      rule = Comprehension::Rule.find_or_create_by!(name: 'Plagiarism', rule_type: Comprehension::Rule::TYPE_PLAGIARISM, universal: false, optimal: false, suborder: 0, concept_uid: concept.uid)
      Comprehension::PromptsRule.find_or_create_by!(rule_id: rule.id, prompt_id: prompt.id)
      Comprehension::Feedback.find_or_create_by!(text: prompt.plagiarism_first_feedback, order: 0, rule_id: rule.id) if prompt.plagiarism_first_feedback.present?
      Comprehension::Feedback.find_or_create_by!(text: prompt.plagiarism_second_feedback, order: 1, rule_id: rule.id) if prompt.plagiarism_second_feedback.present?
      Comprehension::PlagiarismText.find_or_create_by!(text: prompt.plagiarism_text, rule_id: rule.id)
    end
  end
end
