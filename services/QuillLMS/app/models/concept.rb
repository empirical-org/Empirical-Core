class Concept < ActiveRecord::Base
  include Uid
  belongs_to :parent, class_name: 'Concept', foreign_key: :parent_id
  belongs_to :replacement, class_name: 'Concept', foreign_key: :replacement_id
  validates :name, presence: true
  has_many :concept_results

  def lineage
    family_tree = self.name
    if self.parent
      family_tree = self.parent.name+' | '+family_tree
    end
    if self.parent and self.parent.parent
      family_tree = self.parent.parent.name+' | '+family_tree
    end
    family_tree
  end

  # need the below because those making POST requests to /api/v1/concepts know only uids, not ids
  def parent_uid= uid
    self.parent_id = Concept.find_by(uid: uid).id
  end

  def replacement_uid= uid
    self.replacement_id = Concept.find_by(uid: uid).id
  end

  # Find all the concepts that are not a parent of any other concept
  def self.leaf_nodes
    concepts = Concept.arel_table
    distinct_parent_ids = concepts.project('DISTINCT(parent_id)')
                                  .where(concepts[:parent_id].not_eq(nil))
    where.not(concepts[:id].in(distinct_parent_ids))
  end

  def self.all_with_level
    # https://github.com/dockyard/postgres_ext/blob/master/docs/querying.md
    concept2 = Concept.select(:id, :name, :uid, :parent_id, '2 AS level', :description).where(parent_id: nil, visible: true)
    concept1 = Concept.select(:id, :name, :uid, :parent_id, '1 AS level', :description).where(parent_id: concept2.ids, visible: true)
    concept0 = Concept.select(:id, :name, :uid, :parent_id, '0 AS level', :description).where(parent_id: concept1.ids, visible: true)
    concept2 + concept1 + concept0
  end

  def self.level_zero_only
    Concept.find_by_sql("
      SELECT concepts.id, concepts.name, concepts.uid, concepts.parent_id, concepts.created_at, concepts.updated_at, concepts.visible::BOOLEAN FROM concepts
      JOIN concepts AS parents ON concepts.parent_id = parents.id
      WHERE parents.parent_id IS NOT NULL
      AND concepts.parent_id IS NOT NULL
    ")
  end

  def self.level_one_only
    Concept.find_by_sql("
      SELECT concepts.id, concepts.name, concepts.uid, concepts.parent_id, concepts.created_at, concepts.updated_at, concepts.visible::BOOLEAN FROM concepts
      JOIN concepts AS parents ON concepts.parent_id = parents.id
      WHERE parents.parent_id IS NULL
      AND concepts.parent_id IS NOT NULL
    ")
  end

  def self.find_by_id_or_uid(arg)
    begin
      find(arg)
    rescue ActiveRecord::RecordNotFound
      find_by(uid: arg)
    rescue ActiveRecord::RecordNotFound
      raise ActiveRecord::RecordNotFound.new(
        "Couldn't find Concept with 'id' or 'uid'=#{arg}"
      )
    end
  end

  def self.get_concepts_in_use
    @sc_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/questions.json").parsed_response
    @fib_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/fillInBlankQuestions.json").parsed_response
    @sf_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/sentenceFragments.json").parsed_response
    @d_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnostic_questions.json").parsed_response
    @d_fib_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnostic_fillInBlankQuestions.json").parsed_response
    @d_sf_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnostic_sentenceFragments.json").parsed_response

    concepts = []

    self.visible_level_zero_concept_ids.each do |id|
      concept_rows = ActiveRecord::Base.connection.execute("
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
        LEFT JOIN activity_sessions ON concept_results.activity_session_id = activity_sessions.id AND activity_sessions.completed_at > (CURRENT_DATE - INTERVAL '1 months')
        LEFT JOIN activities on activity_sessions.activity_id = activities.id
        LEFT JOIN activity_classifications ON activities.activity_classification_id = activity_classifications.id
        LEFT JOIN criteria ON criteria.concept_id = concepts.id
        LEFT JOIN recommendations ON criteria.recommendation_id = recommendations.id
        WHERE concepts.id = #{id}
        GROUP BY concept_name, parent_concepts.name, grandparent_concepts.name, activity_name, concept_uid, classification_name, recommendations.name
        ORDER BY grandparent_concepts.name, parent_concepts.name, concept_name, classification_name
      ").to_a
      concepts.push(concept_rows)
    end

    concepts = concepts.flatten

    organized_concepts = []

    concepts.each do |c|
      uid = c["concept_uid"]
      existing_oc = organized_concepts.find { |oc| oc["uid"] == uid }

      if existing_oc
        new_oc = existing_oc
        if c["classification_name"] == 'Quill Connect'
          new_oc["grades_connect_activities"] << (c["activity_name"])
        elsif c["classification_name"] == "Quill Diagnostic"
          new_oc["grades_diagnostic_activities"] << (c["activity_name"])
        elsif c["classification_name"] == "Quill Grammar"
          new_oc["grades_grammar_activities"] << (c["activity_name"])
        elsif c["classification_name"] == "Quill Proofreader"
          new_oc["grades_proofreader_activities"] << (c["activity_name"])
        end

        index = organized_concepts.find_index(existing_oc)
        organized_concepts[index] = new_oc
      else
        grandparent_name = c["grandparent_name"] ?  c["grandparent_name"] + ' | ' : ''
        parent_name = c["parent_name"] ?  c["parent_name"] + ' | ' : ''
        new_oc = {
          grades_connect_activities: [],
          grades_diagnostic_activities: [],
          grades_grammar_activities: [],
          grades_proofreader_activities: [],
          diagnostic_recommendations: [],
          name: grandparent_name + parent_name + c["concept_name"],
          uid: uid,
          last_retrieved: Time.now.strftime("%m/%d/%y")
        }.stringify_keys

        if c["classification_name"] == 'Quill Connect'
          new_oc["grades_connect_activities"] << (c["activity_name"])
        elsif c["classification_name"] == "Quill Diagnostic"
          new_oc["grades_diagnostic_activities"] << (c["activity_name"])
        elsif c["classification_name"] == "Quill Grammar"
          new_oc["grades_grammar_activities"] << (c["activity_name"])
        elsif c["classification_name"] == "Quill Proofreader"
          new_oc["grades_proofreader_activities"] << (c["activity_name"])
        end

        new_oc["categorized_connect_questions"] = find_categorized_connect_questions(uid)
        new_oc["categorized_diagnostic_questions"] = find_categorized_diagnostic_questions(uid)
        new_oc["diagnostic_recommendations"] << (c['recommendation_name'])

        organized_concepts << (new_oc)
      end
    end

    concepts_in_use = []
    headers = %w(name uid grades_proofreader_activities grades_grammar_activities grades_connect_activities grades_diagnostic_activities categorized_connect_questions categorized_diagnostic_questions part_of_diagnostic_recommendations last_retrieved)
    concepts_in_use << headers
    organized_concepts.each do |oc|
      concepts_in_use << headers.map do |attr|
        if oc[attr].is_a?(Array)
          oc[attr].flatten.uniq.join(', ')
        else
          oc[attr]
        end
      end
    end
    $redis.set("CONCEPTS_IN_USE", concepts_in_use.to_json)
  end

  def self.visible_level_zero_concept_ids
    ActiveRecord::Base.connection.execute("
      SELECT concepts.id FROM concepts
      JOIN concepts AS parent_concepts ON concepts.parent_id = parent_concepts.id
      JOIN concepts AS grandparent_concepts ON parent_concepts.parent_id = grandparent_concepts.id
      WHERE parent_concepts.parent_id IS NOT NULL
      AND concepts.parent_id IS NOT NULL
      AND concepts.visible
      ORDER BY grandparent_concepts.name, parent_concepts.name, concepts.name
    ").to_a.map { |id| id['id'] }
  end

  private

  def self.find_categorized_connect_questions(uid)
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

  def self.find_categorized_diagnostic_questions(uid)
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
