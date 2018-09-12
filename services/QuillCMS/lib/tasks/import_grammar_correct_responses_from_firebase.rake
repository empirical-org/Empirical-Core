require 'HTTParty'
require 'json'
namespace :import_grammar_correct_responses_from_firebase do
  task :local => :environment do
    import_responses('quillgrammarstaging')
  end

  task :prod => :environment do
    import_responses('quillgrammar')
  end

  def import_responses(firebase_app)
    grammar_questions = HTTParty.get("https://#{firebase_app}.firebaseio.com/v3/questions.json").parsed_response
    grammar_questions.each do |gqkey, gqval|
      gqval['answers'].each do |a|
        concept_results = {}
        concept_results[gqval['concept_uid']] = true
        text = a['text'].gsub(/{|}/, '')
        response = Response.find_by(text: text, question_uid: gqkey)
        if !response
          Response.create(
            optimal: true,
            count: 1,
            text: a['text'].gsub(/{|}/, ''),
            question_uid: gqkey,
            feedback: "<b>Well done!</b> That's the correct answer.",
            concept_results: concept_results.to_json
          )
        end
      end
    end
  end
end
