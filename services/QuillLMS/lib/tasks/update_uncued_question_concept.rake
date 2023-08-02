# frozen_string_literal: true

namespace :update_uncued_question_concept do
  desc 'Update uncued question concept from Joining Sentences to Open Sentence Combining'
  task :run => :environment do
    joining_sentences_concept_uid = 'us2_ksblSRRVRIXantRiNg'
    open_sentence_concept_uid = 'V9ytDF4ljU-AsisRCF7qdw'
    sql = <<-SQL
      SELECT id
      FROM questions
      WHERE
          questions.data->>'flag' != 'archived'
          AND (questions.data->>'concept_uid' = '#{joining_sentences_concept_uid}' OR questions.data->>'conceptID' = '#{joining_sentences_concept_uid}')
    SQL
    question_ids = RawSqlRunner.execute(sql).values.flatten
    question_ids.each do |id|
      question = Question.find(id)
      question.data["concept_uid"] = open_sentence_concept_uid if question.data["concept_uid"]
      question.data["conceptID"] = open_sentence_concept_uid if question.data["conceptID"]
      question.save(validate: false)
    end
  end
end
