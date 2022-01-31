# frozen_string_literal: true

# this script could be updated to distinguish between connect and diagnostic questions, and to get recommendations programatically now that they live in the database

require "rubygems"
require "json"
require "HTTParty"

concepts = ActiveRecord::Base.connection.execute("SELECT concepts.name AS concept_name,
concepts.uid AS concept_uid,
activities.name AS activity_name,
activity_classifications.name AS classification_name,
parent_concepts.name AS parent_name,
grandparent_concepts.name AS grandparent_name
FROM concepts
LEFT JOIN concepts AS parent_concepts ON concepts.parent_id = parent_concepts.id
LEFT JOIN concepts AS grandparent_concepts ON parent_concepts.parent_id = grandparent_concepts.id
LEFT JOIN concept_results ON concept_results.concept_id = concepts.id
LEFT JOIN activity_sessions ON concept_results.activity_session_id = activity_sessions.id
LEFT JOIN activities on activity_sessions.activity_id = activities.id
LEFT JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id
GROUP BY concept_name, activity_name, concept_uid, classification_name, parent_name, grandparent_name
ORDER BY concept_name, classification_name").to_a

recommendation_obj = {
  "Jl4ByYtUfo4VhIKpMt23yA": "Compound Subjects, Objects, and Predicates, Subject Verb Agreement",
  "QNkNRs8zbCXU7nLBeo4mgA": "Compound Subjects, Objects, and Predicates",
  "oCQCO1_eVXQ2zqw_7QOuBw": "Adjectives",
  "GZ04vHSTxWUTzhWMGfwcUQ": "Adverbs of Manner, Adverbs",
  "GiUZ6KPkH958AT8S413nJg": "Compound Sentences",
  "Qqn6Td-zR6NIAX43NOHoCg": "Compound Sentences",
  "hJKqVOkQQQgfEsmzOWC1xw": "Compound Sentences",
  "tSSLMHqX0q-9mKTJHSyung": "Compound Sentences",
  "R3sBcYAvoXP2_oNVXiA98g": "Compound Sentences",
  "nb0JW1r5pRB5ouwAzTgMbQ": "Complex Sentences",
  "Q8FfGSv4Z9L2r1CYOfvO9A": "Complex Sentences",
  "S8b-N3ZrB50CWgxD5yg8yQ": "Complex Sentences",
  "7H2IMZvq0VJ4Uvftyrw7Eg": "Complex Sentences",
  "6gQZPREURQQAaSzpIt_EEw": "Complex Sentences",
  "InfGdB6Plr2M930kqsn63g": "Appositives and Modifying Phrases",
  "GLjAExmqZShBTZ7DQGvVLw": "Appositives and Modifying Phrases",
  "1ohLyApTz7lZ3JszrA98Xg": "Parallel Structure",
  "fJXVAoYCC8S9kByua0kXXA": "Articles",
  "XHUbxx87N7TK1F-tiaNy-A": "Articles",
  "5s-r1281DV8EpHyc9qJfiw": "Articles",
  "QsC1lua0t41_J2em_c7kUA": "Articles",
  "TE-ElKaRWWumTrmVE4-m6g": "Verb Tense",
  "RPNqOZuka_n8RESKbBF8OQ": "Verb Tense",
  "9ZPpieSHhlMYQkEvrhQP1w": "Verb Tense",
  "YeioybAcmeBNsp3KRb9aow": "Verb Tense",
  "1mXma17dtAL7NGmJRU80bQ": "Verb Tense",
  "TPm4a19NUn2RlKLCbPbVUw": "Verb Tense",
  "I5Si4ZxILjjDR077WgSZ6w": "Verb Tense",
  "LPMBB_M5hooC263qXFc_Yg": "Prepositions",
  "lD5FBHF-FEPpsFG0SXlcfQ": "Prepositions",
  "FZ0wa0oqQ-6ELHf1gzVJjw": "Prepositions",
  "wpzl6e2NhXcBaKDC11K4NA": "Prepositions",
  "iY2_MBNxcVgzH3xmnyeEJA": "Prepositions",
  "o1yvrCpaYu0r-jqogv7PBw": "Adjectives",
  "opY7bPUsNUMBk3FFhZ0wog": "Adverbs",
  "Tlhrx6Igxn6cR_SD1U5efA": "Subject Verb Agreement",
  "66upe3S5uvqxuHoHOt4PcQ": "Capitalization"
}

organized_concepts = []

grammar_concepts = HTTParty.get("https://quillgrammar.firebaseio.com/v2/concepts.json").parsed_response
sc_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/questions.json").parsed_response
d_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnosticQuestions.json").parsed_response
fib_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/fillInBlankQuestions.json").parsed_response
sf_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/sentenceFragments.json").parsed_response

# {
#   name: string,
#   uid: number,
#   rule_number: number,
#   grades_proofreader_activities: [],
#   grades_grammar_activities: [],
#   grades_connect_activities: [],
#   categorizes_connect_questions: [],
#   part_of_diagnostic_recommendations: []
# }
#
#
def find_rule_number(uid, grammar_concepts)
  concept = grammar_concepts.values.find { |c| c["concept_level_0"]["uid"] == uid}
  return unless concept

  concept["ruleNumber"]
end

# rubocop:disable Metrics/CyclomaticComplexity
def find_categorized_connect_questions(uid, sc_questions, sf_questions, d_questions, fib_questions)
  questions = []
  sc_questions.values.each do |q|
    questions << q["prompt"] if q["conceptID"] == uid
  end

  sf_questions.values.each do |q|
    questions << q["prompt"] if q["conceptID"] == uid
  end

  d_questions.values.each do |q|
    questions << q["prompt"] if q["conceptID"] == uid
  end

  fib_questions.values.each do |q|
    questions << q["prompt"] if q["conceptID"] == uid
  end

  questions
end
# rubocop:enable Metrics/CyclomaticComplexity

concepts.each do |c|
  uid = c["concept_uid"]

  existing_oc = organized_concepts.find { |oc| oc["uid"] == uid }
  if existing_oc
    new_oc = existing_oc
    case c["classification_name"]
    when "Quill Connect", "Quill Diagnostic"
      new_oc["grades_connect_activities"] << (c["activity_name"])
    when "Quill Grammar"
      new_oc["grades_grammar_activities"] << (c["activity_name"])
    when "Quill Proofreader"
      new_oc["grades_proofreader_activities"] << (c["activity_name"])
    end
    index = organized_concepts.find_index(existing_oc)
    organized_concepts[index] = new_oc
  else
    grandparent_name = c["grandparent_name"] ?  "#{c['grandparent_name']} | " : ''
    parent_name = c["parent_name"] ?  "#{c['parent_name']} | " : ''
    new_oc = {}
    new_oc["grades_connect_activities"] = [],
    new_oc["grades_grammar_activities"] = [],
    new_oc["grades_proofreader_activities"] = []

    new_oc["name"] = grandparent_name + parent_name + c["concept_name"]
    new_oc["uid"] = uid

    case c["classification_name"]
    when "Quill Connect", "Quill Diagnostic"
      new_oc["grades_connect_activities"] << (c["activity_name"])
    when "Quill Grammar"
      new_oc["grades_grammar_activities"] << (c["activity_name"])
    when "Quill Proofreader"
      new_oc["grades_proofreader_activities"] << (c["activity_name"])
    end

    new_oc["rule_number"] = find_rule_number(uid, grammar_concepts)
    new_oc["categorized_connect_questions"] = find_categorized_connect_questions(uid, sc_questions, sf_questions, d_questions, fib_questions)
    new_oc["part_of_diagnostic_recommendations"] = recommendation_obj[uid.to_sym]

    organized_concepts << (new_oc)
  end
  puts c
end

CSV.open("organized_data.csv", "wb") do |new_csv|
  headers = %w(name uid rule_number grades_proofreader_activities grades_grammar_activities grades_connect_activities categorized_connect_questions part_of_diagnostic_recommendations)
  new_csv << headers
  organized_concepts.each do |oc|
    new_csv << headers.map{ |attr| oc[attr] }
  end
end
