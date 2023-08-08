# frozen_string_literal: true

class GetConceptsInUseIndividualConceptWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  # rubocop:disable Metrics/CyclomaticComplexity
  def perform(id)
    @sc_questions = JSON.parse($redis.get('SC_QUESTIONS'))
    @fib_questions = JSON.parse($redis.get('FIB_QUESTIONS'))
    @sf_questions = JSON.parse($redis.get('SF_QUESTIONS'))
    @d_questions = JSON.parse($redis.get('D_QUESTIONS'))
    @d_fib_questions = JSON.parse($redis.get('D_FIB_QUESTIONS'))
    @d_sf_questions = JSON.parse($redis.get('D_SF_QUESTIONS'))


    activity_rows = get_activity_rows(id)

    @organized_concepts = []

    activity_rows.each do |c|
      uid = c["concept_uid"]
      existing_oc = @organized_concepts.find { |oc| oc["uid"] == uid }

      if existing_oc
        new_oc = existing_oc
        case c["classification_name"]
        when 'Quill Connect'
          new_oc["grades_connect_activities"] << (c["activity_name"])
        when "Quill Diagnostic"
          new_oc["grades_diagnostic_activities"] << (c["activity_name"])
        when "Quill Grammar"
          new_oc["grades_grammar_activities"] << (c["activity_name"])
        when "Quill Proofreader"
          new_oc["grades_proofreader_activities"] << (c["activity_name"])
        end

        index = @organized_concepts.find_index(existing_oc)
        @organized_concepts[index] = new_oc
      else
        grandparent_name = c["grandparent_name"] ?  "#{c['grandparent_name']} | " : ''
        parent_name = c["parent_name"] ?  "#{c['parent_name']} | " : ''
        new_oc = {
          grades_connect_activities: [],
          grades_diagnostic_activities: [],
          grades_grammar_activities: [],
          grades_proofreader_activities: [],
          diagnostic_recommendations: [],
          name: grandparent_name + parent_name + c["concept_name"],
          uid: uid,
          last_retrieved: Time.current.strftime("%m/%d/%y")
        }.stringify_keys

        case c["classification_name"]
        when 'Quill Connect'
          new_oc["grades_connect_activities"] << (c["activity_name"])
        when "Quill Diagnostic"
          new_oc["grades_diagnostic_activities"] << (c["activity_name"])
        when "Quill Grammar"
          new_oc["grades_grammar_activities"] << (c["activity_name"])
        when "Quill Proofreader"
          new_oc["grades_proofreader_activities"] << (c["activity_name"])
        end

        new_oc["categorized_connect_questions"] = find_categorized_connect_questions(uid)
        new_oc["categorized_diagnostic_questions"] = find_categorized_diagnostic_questions(uid)
        new_oc["diagnostic_recommendations"] << (c['recommendation_name'])

        @organized_concepts << (new_oc)
      end
    end

    set_concepts_in_use_cache
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def get_activity_rows(id)
    begin
      RawSqlRunner.execute(
        <<-SQL
          SELECT
            concepts.name AS concept_name,
            concepts.uid AS concept_uid,
            activities.name AS activity_name,
            activity_classifications.name AS classification_name,
            parent_concepts.name AS parent_name,
            grandparent_concepts.name AS grandparent_name,
            recommendations.name AS recommendation_name
          FROM concepts
          LEFT JOIN concepts AS parent_concepts
            ON concepts.parent_id = parent_concepts.id
          LEFT JOIN concepts AS grandparent_concepts
            ON parent_concepts.parent_id = grandparent_concepts.id
          LEFT JOIN concept_results
            ON concept_results.concept_id = concepts.id
          LEFT JOIN activity_sessions
            ON concept_results.activity_session_id = activity_sessions.id
          LEFT JOIN activities
            ON activity_sessions.activity_id = activities.id
          LEFT JOIN activity_classifications
            ON activities.activity_classification_id = activity_classifications.id
          LEFT JOIN criteria
            ON criteria.concept_id = concepts.id
          LEFT JOIN recommendations
            ON criteria.recommendation_id = recommendations.id
          WHERE concepts.id = #{id}
            AND activities.flags = '{production}'
          GROUP BY
            concept_name,
            parent_concepts.name,
            grandparent_concepts.name,
            activity_name,
            concept_uid,
            classification_name,
            recommendations.name
          ORDER BY
            grandparent_concepts.name,
            parent_concepts.name,
            concept_name,
            classification_name
        SQL
      ).to_a
    rescue => e
      get_activity_rows(id)
    end
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

  def set_concepts_in_use_cache
    begin
      $redis.watch('CONCEPTS_IN_USE')
      concepts_in_use = JSON.parse($redis.get('CONCEPTS_IN_USE'))
      headers = %w(name uid grades_proofreader_activities grades_grammar_activities grades_connect_activities grades_diagnostic_activities categorized_connect_questions categorized_diagnostic_questions part_of_diagnostic_recommendations last_retrieved)
      @organized_concepts.each do |oc|
        concepts_in_use << headers.map do |attr|
          if oc[attr].is_a?(Array)
            oc[attr].flatten.uniq.join(', ')
          else
            oc[attr]
          end
        end
      end
      $redis.set("CONCEPTS_IN_USE", concepts_in_use.to_json)
      $redis.unwatch
    rescue => e
      set_concepts_in_use_cache
    end
  end

end
