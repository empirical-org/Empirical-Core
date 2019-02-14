class GenerateConceptsInUseArrayWorker
  include Sidekiq::Worker

  def perform
    concepts_in_use_cache_life = 60*60*170
    @sc_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/questions.json").parsed_response
    @fib_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/fillInBlankQuestions.json").parsed_response
    @sf_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/sentenceFragments.json").parsed_response
    @d_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnostic_questions.json").parsed_response
    @d_fib_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnostic_fillInBlankQuestions.json").parsed_response
    @d_sf_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnostic_sentenceFragments.json").parsed_response
    concepts_in_use = get_concepts_in_use
    $redis.set("CONCEPTS_IN_USE", concepts_in_use)
    $redis.expire("CONCEPTS_IN_USE", concepts_in_use_cache_life)
  end

  def get_concepts_in_use
    concepts = ActiveRecord::Base.connection.execute('
      SELECT concepts.name AS concept_name,
      concepts.uid AS concept_uid,
      activities.name AS activity_name,
      activity_classifications.name AS classification_name,
      parent_concepts.name AS parent_name,
      grandparent_concepts.name AS grandparent_name,
      recommendations.name AS recommendation_name
      FROM concepts
      LEFT JOIN concepts AS parent_concepts ON concepts.parent_id = parent_concepts.id
      LEFT JOIN concepts AS grandparent_concepts ON parent_concepts.parent_id = grandparent_concepts.id
      LEFT JOIN concept_results ON concept_results.concept_id = concepts.id
      LEFT JOIN activity_sessions ON concept_results.activity_session_id = activity_sessions.id
      LEFT JOIN activities on activity_sessions.activity_id = activities.id
      LEFT JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id
      LEFT JOIN criteria ON criteria.concept_id = concepts.id
      LEFT JOIN recommendations ON criteria.recommendation_id = recommendations.id
      WHERE concepts.visible
      AND concept_results.created_at > (CURRENT_DATE - INTERVAL "3 months")
      GROUP BY concept_name, parent_concepts.name, grandparent_concepts.name, activity_name, concept_uid, classification_name, recommendations.name
      ORDER BY concept_name, classification_name
    ').to_a

    organized_concepts = []

    concepts.each do |c|
      uid = c["concept_uid"]
      existing_oc = organized_concepts.find { |oc| oc["uid"] == uid }

      if existing_oc
        new_oc = existing_oc
        case c["classification_name"]
        when "Quill Connect"
          new_oc["grades_connect_activities"] << (c["activity_name"])
        when "Quill Diagnostic"
          new_oc["grades_connect_activities"] << (c["activity_name"])
        when "Quill Grammar"
          new_oc["grades_grammar_activities"] << (c["activity_name"])
        when "Quill Proofreader"
          new_oc["grades_proofreader_activities"] << (c["activity_name"])
        end
        index = organized_concepts.find_index(existing_oc)
        organized_concepts[index] = new_oc
      else
        grandparent_name = c["grandparent_name"] ?  c["grandparent_name"] + ' | ' : ''
        parent_name = c["parent_name"] ?  c["parent_name"] + ' | ' : ''
        new_oc = {}
        new_oc["grades_connect_activities"] = [],
        new_oc["grades_grammar_activities"] = [],
        new_oc["grades_proofreader_activities"] = []
        new_oc["name"] = grandparent_name + parent_name + c["concept_name"]
        new_oc["uid"] = uid

        case c["classification_name"]
        when "Quill Connect"
          new_oc["grades_connect_activities"] << (c["activity_name"])
        when "Quill Diagnostic"
          new_oc["grades_connect_activities"] << (c["activity_name"])
        when "Quill Grammar"
          new_oc["grades_grammar_activities"] << (c["activity_name"])
        when "Quill Proofreader"
          new_oc["grades_proofreader_activities"] << (c["activity_name"])
        end

        new_oc["rule_number"] = find_rule_number(uid)
        new_oc["categorized_connect_questions"] = find_categorized_connect_questions(uid)
        new_oc["categorized_diagnostic_questions"] = find_categorized_diagnostic_questions(uid)
        new_oc["diagnostic_recommendations"] << (c['recommendation_name'])

        organized_concepts << (new_oc)
      end
    end

    concepts_in_use = []
    headers = %w(name uid grades_proofreader_activities grades_grammar_activities grades_connect_activities categorized_connect_questions categorized_diagnostic_questions part_of_diagnostic_recommendations)
    concepts_in_use << headers
    organized_concepts.each do |oc|
      concepts_in_use << headers.map{ |attr| oc[attr] }
    end
    concepts_in_use
  end

  def find_categorized_connect_questions(uid)
    questions = []
    @sc_questions.values.each do |q|
      questions << q["prompt"] if q["conceptID"] == uid
    end

    @fib_questions.values.each do |q|
      questions << q["prompt"] if q["conceptID"] == uid
    end

    @sf_questions.values.each do |q|
      questions << q["prompt"] if q["conceptID"] == uid
    end

    questions
  end

  def find_categorized_diagnostic_questions(uid)
    questions = []
    @d_questions.values.each do |q|
      questions << q["prompt"] if q["conceptID"] == uid
    end

    @d_fib_questions.values.each do |q|
      questions << q["prompt"] if q["conceptID"] == uid
    end

    @d_sf_questions.values.each do |q|
      questions << q["prompt"] if q["conceptID"] == uid
    end

    questions
  end

end
