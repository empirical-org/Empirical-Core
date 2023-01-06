# frozen_string_literal: true

module PublicProgressReports
  extend ActiveSupport::Concern
  include DiagnosticReports

  def last_completed_diagnostic
    diagnostic_activity_ids = Activity.diagnostic_activity_ids
    current_user.classroom_units
                .joins(activity_sessions: :classroom_unit)
                .where('activity_sessions.state = ? AND activity_sessions.activity_id IN (?)', 'finished', diagnostic_activity_ids)
                .order('created_at DESC')
                .limit(1)
                .first
  end

  def activity_session_report(unit_id, classroom_id, user_id, activity_id)
    if Activity.diagnostic_activity_ids.include?(activity_id.to_i)
      unit_query_string = "?unit=#{unit_id}"
      { url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity_id}/classroom/#{classroom_id}/responses/#{user_id}#{unit_query_string}" }
    elsif unit_id && activity_id && classroom_id
      {url: "/teachers/progress_reports/diagnostic_reports#/u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/student_report/#{user_id}"}
    end
  end

  def classroom_report_url(classroom_unit_id, activity_id)
    classroom_unit = ClassroomUnit.find(classroom_unit_id)
    unit_id = classroom_unit.unit_id
    classroom_id = classroom_unit.classroom_id
    return unless unit_id && activity_id && classroom_id

    "/teachers/progress_reports/diagnostic_reports#/u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/students"
  end

  def default_diagnostic_url
    cu = last_completed_diagnostic
    if cu
      custom_url = "#u/#{cu.unit.id}/a/#{cu.activity_id}/c/#{cu.classroom_id}"
      "/teachers/progress_reports/diagnostic_reports/#{custom_url}/students"
    else
      "/teachers/progress_reports/diagnostic_reports/#not_completed"
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def results_by_question(activity_id)
    activity = Activity.includes(:classification).find(activity_id)
    questions = Hash.new{|h,k| h[k]={} }

    all_answers = @activity_sessions.map(&:concept_results).flatten

    all_answers.each do |answer|
      curr_quest = questions[answer.question_number]
      curr_quest[:correct] ||= 0
      curr_quest[:total] ||= 0
      curr_quest[:correct] += answer.question_score_for_correct_count
      curr_quest[:total] += 1
      curr_quest[:prompt] ||= answer.concept_result_prompt&.text
      curr_quest[:question_number] ||= answer.question_number
      if answer.attempt_number == 1 || !curr_quest[:instructions]
        direct = answer.concept_result_directions&.text || answer.concept_result_instructions&.text || ""
        curr_quest[:instructions] = direct.gsub(/(<([^>]+)>)/i, "").gsub("()", "").gsub("&nbsp;", "")
      end
    end
    # TODO: change the diagnostic reports so they take in a hash of classrooms -- this is just
    # being converted to an array because that is what the diagnostic reports expect
    questions_arr = questions.map do |k,v|
      {question_id: k,
       score: activity.is_evidence? ? nil : ((v[:correct].to_f/v[:total]) * 100).round,
       prompt: v[:prompt],
       instructions: v[:instructions]}
    end

    return questions_arr unless questions_arr.empty?

    generic_questions_for_report(activity)
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/CyclomaticComplexity
  def classrooms_with_students_for_report(unit_id, activity_id)
    h = {}
    unit = Unit.find_by(id: unit_id)
    if unit
      class_ids = current_user.classrooms_i_teach.map(&:id)
      #without definining class ids, it may default to a classroom activity from a non-existant classroom
      class_units = unit.classroom_units.where(classroom_id: class_ids).includes(completed_activity_sessions: :user)
      unit_activity = UnitActivity.find_by(activity_id: activity_id, unit: unit)

      class_units.each do |cu|
        cuas = ClassroomUnitActivityState.find_by(unit_activity: unit_activity, classroom_unit: cu)
        classroom = cu.classroom.attributes
        activity_sessions = cu.completed_activity_sessions
        if activity_sessions.present? || cuas&.completed || Activity.diagnostic_activity_ids.include?(activity_id.to_i)
          class_id = classroom['id']
          h[class_id] ||= classroom
          h[class_id][:classroom_unit_id] = cu.id
          activity_sessions.each do |activity_session|
            h[class_id][:students] ||= []
            if h[class_id][:students].exclude? activity_session.user
              h[class_id][:students] << activity_session.user
            end
          end
        end
      end

      # TODO: change the diagnostic reports so they take in a hash of classrooms -- this is just
      # being converted to an array because that is what the diagnostic reports expect
      h.map{|k,v| v}
    else
      []
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/CyclomaticComplexity
  def results_for_classroom(unit_id, activity_id, classroom_id)
    classroom_unit = ClassroomUnit.find_by(
      classroom_id: classroom_id,
      unit_id: unit_id
    )
    activity = Activity.find_by_id_or_uid(activity_id)
    classification_key = activity.classification.key
    unit_activity = UnitActivity.find_by(unit_id: unit_id, activity: activity)
    state = ClassroomUnitActivityState.find_by(
      unit_activity: unit_activity,
      classroom_unit: classroom_unit
    )
    classroom = Classroom.find(classroom_id)

    scores = {
      id: classroom.id,
      name: classroom.name,
      students: [],
      not_completed_names: [],
      missed_names: []
    }

    students = User.includes(:students_classrooms).where(id: classroom_unit.assigned_student_ids)

    # Use DISTINCT ON to only pull one session per user
    final_sessions_by_user = ActivitySession
      .select("DISTINCT ON (activity_sessions.user_id) user_id, activity_sessions.*")
      .includes(concept_results: :concept)
      .where(
        user_id: students.map(&:id),
        is_final_score: true,
        classroom_unit_id: classroom_unit.id,
        activity_id: activity_id)
      .order('activity_sessions.user_id')
      .group_by(&:user_id)

    average_scores = ActivitySession.average_scores_by_student(students.map(&:id))

    students.each do |student|
      next if !student.students_classrooms.map(&:classroom_id).include?(classroom.id)

      finished_session = final_sessions_by_user[student.id]&.first
      if finished_session.present?
        score_obj = formatted_score_obj(finished_session, classification_key, student, average_scores[student.id])
        scores[:students].push(score_obj)
        next
      end

      key = unfinished_key(state)

      scores[key].push(student.name)
    end

    scores
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def unfinished_key(state)
    return :missed_names if state&.completed

    :not_completed_names
  end

  def formatted_score_obj(final_activity_session, classification_key, student, average_score_on_quill)
    formatted_concept_results = format_concept_results(final_activity_session, final_activity_session.concept_results)
    if [ActivityClassification::LESSONS_KEY, ActivityClassification::DIAGNOSTIC_KEY].include?(classification_key)
      score = get_average_score(formatted_concept_results)
    elsif [ActivityClassification::EVIDENCE_KEY].include?(classification_key)
      score = nil
    else
      score = (final_activity_session.percentage * 100).round
    end
    {
      activity_classification: classification_key,
      id: student.id,
      name: student.name,
      time: final_activity_session.timespent,
      number_of_questions: formatted_concept_results.length,
      concept_results: formatted_concept_results,
      score: score,
      average_score_on_quill: average_score_on_quill || 0
    }
  end


  def get_time_in_minutes(activity_session)
    return 'Untracked' if !(activity_session.started_at && activity_session.completed_at)

    time = ((activity_session.completed_at - activity_session.started_at) / 60).round()
    time > 60 ? '> 60' : time
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def format_concept_results(activity_session, concept_results)
    concept_results.group_by{|cr| cr.question_number}.map { |key, cr|
      # if we don't sort them, we can't rely on the first result being the first attemptNum
      # however, it would be more efficient to make them a hash with attempt numbers as keys
      cr.sort!{|x,y| (x.attempt_number || 0) <=> (y.attempt_number || 0)}
      directfirst = cr.first.concept_result_directions&.text || cr.first.concept_result_instructions&.text || ""
      prompt_text = cr.first.concept_result_prompt&.text
      hash = {
        directions: directfirst.gsub(/(<([^>]+)>)/i, "").gsub("()", "").gsub("&nbsp;", ""),
        prompt: prompt_text,
        answer: cr.first.answer,
        score: get_score_for_question(cr),
        concepts: cr.map { |crs|
          attempt_number = crs.attempt_number
          direct = crs.concept_result_directions&.text || crs.concept_result_instructions&.text || ""
          {
            id: crs.concept_id,
            name: crs.concept&.name,
            correct: crs.correct,
            feedback: get_feedback_from_feedback_history(activity_session, prompt_text, attempt_number),
            lastFeedback: crs.concept_result_previous_feedback&.text,
            attempt: attempt_number || 1,
            answer: crs.answer,
            directions: direct.gsub(/(<([^>]+)>)/i, "").gsub("()", "").gsub("&nbsp;", "")
          }
        },
        question_number: cr.first.question_number
      }
      if cr.first.question_score
        hash[:questionScore] = cr.first.question_score
      end
      hash
    }
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def get_score_for_question(concept_results)
    if !concept_results.empty? && concept_results.first.question_score
      concept_results.first.question_score * 100
    else
      concept_results.inject(0) {|sum, crs| sum + (crs.correct ? 1 : 0)} / concept_results.length * 100
    end
  end

  def get_average_score(formatted_results)
    if formatted_results.empty?
      100
    else
      (formatted_results.inject(0) {|sum, crs| sum + crs[:score]} / formatted_results.length).round()
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def get_feedback_from_feedback_history(activity_session, prompt_text, attempt_number)
    feedback_histories = activity_session.feedback_histories
    return "" if feedback_histories.empty? || prompt_text.blank? || attempt_number.blank?

    prompt_ids = activity_session.activity.child_activity.prompt_ids
    prompt = Evidence::Prompt.where(id: prompt_ids, text: prompt_text)&.first
    feedback_history = feedback_histories.select {|fh| fh.attempt == attempt_number.to_i && fh.prompt_id == prompt&.id }&.first
    feedback_history&.feedback_text
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/CyclomaticComplexity
  def generate_recommendations_for_classroom(current_user, unit_id, classroom_id, activity_id)
    set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(activity_id, classroom_id, unit_id)
    diagnostic = Activity.find(activity_id)
    activity_sessions_counted = activity_sessions_with_counted_concepts(@activity_sessions)
    students = @assigned_students.map do |s|
      completed = @activity_sessions.any? { |session| session.user_id == s&.id }
      {id: s&.id, name: s&.name || "Unknown Student", completed: completed }
    end

    sorted_students = students.compact.sort_by {|stud| stud[:name].split().second || ''}

    recommendations = RecommendationsQuery.new(diagnostic.id).activity_recommendations.map do |activity_pack_recommendation|
      students = []
      activity_sessions_counted.each do |activity_session|
        activity_pack_recommendation[:requirements].each do |req|
          if req[:noIncorrect] && activity_session[:concept_scores][req[:concept_id]]["total"] > activity_session[:concept_scores][req[:concept_id]]["correct"]
            students.push(activity_session[:user_id])
            break
          end
          if activity_session[:concept_scores][req[:concept_id]]["correct"] < req[:count]
            students.push(activity_session[:user_id])
            break
          end
        end
      end
      return_value_for_recommendation(students, activity_pack_recommendation)
    end

    {
      students: sorted_students,
      recommendations: recommendations
    }
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def return_value_for_recommendation(students, activity_pack_recommendation)
    {
      activity_count: activity_pack_recommendation[:activityCount],
      activity_pack_id: activity_pack_recommendation[:activityPackId],
      name: activity_pack_recommendation[:recommendation],
      students: students
    }
  end

  def get_previously_assigned_recommendations_by_classroom(classroom_id, activity_id)
    classroom = Classroom.find(classroom_id)
    teacher_id = classroom.owner.id
    diagnostic = Activity.find(activity_id)

    release_method = PackSequence.find_by(classroom: classroom, diagnostic_activity: diagnostic)&.release_method

    assigned_recommendations = RecommendationsQuery.new(diagnostic.id).activity_recommendations.map do |recommendation|
      unit_template_id = recommendation[:activityPackId]
      # teachers may rename and reassign activity packs so we check all
      units = Unit.where(user_id: teacher_id, unit_template_id: unit_template_id, visible: true)
      if !units
        name = UnitTemplate.find_by(id: unit_template_id).name
        units = Unit.where(user_id: teacher_id, name: name, visible: true)
      end

      student_ids =
        classroom
          .classroom_units
          .visible
          .where(unit: units)
          .pluck(:assigned_student_ids)
          .flatten
          .uniq

      return_value_for_recommendation(student_ids, recommendation)
    end

    recommended_lesson_activity_ids =
      LessonRecommendationsQuery
        .new(diagnostic.id)
        .activity_recommendations
        .pluck(:activityPackId)

    associated_teacher_ids = ClassroomsTeacher.where(classroom_id: classroom_id).pluck(:user_id)

    assigned_lesson_ids =
      Unit
        .where(unit_template_id: recommended_lesson_activity_ids, user_id: associated_teacher_ids)
        .joins(:classroom_units)
        .where(classroom_units: { classroom_id: classroom_id })
        .pluck(:unit_template_id)

    {
      previouslyAssignedIndependentRecommendations: assigned_recommendations,
      previouslyAssignedLessonsRecommendations: assigned_lesson_ids,
      releaseMethod: release_method
    }
  end

  def activity_sessions_with_counted_concepts(activity_sessions)
    activity_sessions.map do |activity_session|
      {
        user_id: activity_session.user_id,
        user_name: activity_session.user.name,
        concept_scores: concept_results_by_count(activity_session)
      }
    end
  end

  def concept_results_by_count(activity_session)
    hash = Hash.new { |h, k| h[k] = Hash.new { |j, l| j[l] = 0 } }
    activity_session.concept_results.each do |concept_result|
      hash[concept_result.concept.uid]["correct"] += concept_result.correct ? 1 : 0
      hash[concept_result.concept.uid]["total"] += 1
    end
    hash
  end

  def generic_questions_for_report(activity)
    question_array = []
    return question_array unless activity.data['questions'].respond_to?(:map)

    questions = activity.data['questions'].map { |q| Question.find_by_uid(q['key']) }

    questions.compact.each do |q|
      next if !q.data['prompt']

      question_array.push({
        question_id: question_array.length + 1,
        score: nil,
        prompt: q.data['prompt'],
        instructions: q.data['instructions']
      })
    end
    question_array
  end

end
