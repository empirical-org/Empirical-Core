module PublicProgressReports
    extend ActiveSupport::Concern

    def last_completed_diagnostic
      diagnostic_activity_ids = Activity.diagnostic_activity_ids
      current_user.classroom_units
                  .joins(activity_sessions: :classroom_unit)
                  .where('activity_sessions.state = ? AND activity_sessions.activity_id IN (?)', 'finished', diagnostic_activity_ids)
                  .order('created_at DESC')
                  .limit(1)
                  .first
    end

    def activity_session_report(classroom_unit_id, user_id, activity_id)
      act_sesh = ActivitySession.where(is_final_score: true, user_id: user_id, classroom_unit_id: classroom_unit_id, activity_id: activity_id).first
      classroom_unit = ClassroomUnit.find(classroom_unit_id)
      unit_id = classroom_unit.unit_id
      classroom_id = classroom_unit.classroom_id
      if unit_id && activity_id && classroom_id
        {url: "/teachers/progress_reports/diagnostic_reports#/u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/student_report/#{user_id}"}
      end
    end

    def classroom_report_url(classroom_unit_id, activity_id)
      classroom_unit = ClassroomUnit.find(classroom_unit_id)
      unit_id = classroom_unit.unit_id
      classroom_id = classroom_unit.classroom_id
      if unit_id && activity_id && classroom_id
        "/teachers/progress_reports/diagnostic_reports#/u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/students"
      end
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

    def results_by_question(params)
      classroom_unit = ClassroomUnit.find_by(classroom_id: params[:classroom_id], unit_id: params[:unit_id])
      activity = Activity.includes(:classification).find(params[:activity_id])
      questions = Hash.new{|h,k| h[k]={} }
      all_answers = ActivitySession.activity_session_metadata(classroom_unit.id, params[:activity_id])
      all_answers.each do |answer|
        curr_quest = questions[answer["questionNumber"]]
        curr_quest[:correct] ||= 0
        curr_quest[:total] ||= 0
        curr_quest[:correct] += answer["questionScore"] || answer["correct"]
        curr_quest[:total] += 1
        curr_quest[:prompt] ||= answer["prompt"]
        curr_quest[:question_number] ||= answer["question_number"]
        if answer["attemptNumber"] == 1 || !curr_quest[:instructions]
          direct = answer["directions"] || answer["instructions"] || ""
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

      if questions_arr.empty?
        questions_arr = generic_questions_for_report(params[:activity_id])
      end

      questions_arr
    end

    def classrooms_with_students_for_report(unit_id, activity_id)
      h = {}
      unit = Unit.find_by(id: unit_id)
      if unit
        class_ids = current_user.classrooms_i_teach.map(&:id)
        #without definining class ids, it may default to a classroom activity from a non-existant classroom
        class_units = unit.classroom_units.where(classroom_id: class_ids)
        unit_activity = UnitActivity.find_by(activity_id: activity_id, unit: unit)

        class_units.each do |cu|
          cuas = ClassroomUnitActivityState.find_by(unit_activity: unit_activity, classroom_unit: cu)
          classroom = cu.classroom.attributes
          activity_sessions = cu.activity_sessions.completed
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

    def results_for_classroom(unit_id, activity_id, classroom_id)
      classroom_unit = ClassroomUnit.find_by(
        classroom_id: classroom_id,
        unit_id: unit_id
      )
      activity = Activity.find_by_id_or_uid(activity_id)
      unit_activity = UnitActivity.find_by(unit_id: unit_id, activity: activity)
      state = ClassroomUnitActivityState.find_by(
        unit_activity: unit_activity,
        classroom_unit: classroom_unit
      )
      classroom = Classroom.find(classroom_id)
      cu_id = classroom_unit.id
      scores = {
        id: classroom.id,
        name: classroom.name,
        students: [],
        not_completed_names: [],
        missed_names: []
      }

      students = User.includes(:students_classrooms).where(id: classroom_unit.assigned_student_ids)

      finished_sessions = ActivitySession
        .select("DISTINCT ON (user_id) user_id, *")
        .includes(concept_results: :concept)
        .where(
          user_id: students.map(&:id),
          is_final_score: true,
          classroom_unit_id: classroom_unit.id,
          activity_id: activity_id)
        .order('user_id')
        .group_by(&:user_id)

      average_scores = ActivitySession.average_scores_by_student(students.map(&:id))

      students.each do |student|
        next if !student.students_classrooms.map(&:classroom_id).include?(classroom.id)

        finished_session = finished_sessions[student.id]&.first
        if finished_session.present?
          scores[:students].push(formatted_score_obj(finished_session, activity, student, average_scores[student.id]))
          next
        end

        key = unfinished_key(state)

        scores[key].push(student.name)
      end

      scores
    end

    private def unfinished_key(state)
      return :missed_names if state&.completed

      :not_completed_names
    end

    def formatted_score_obj(final_activity_session, activity, student, average_score_on_quill)
      formatted_concept_results = get_concept_results(final_activity_session)
      activity_classification_key = ActivityClassification.find(activity.activity_classification_id).key
      if [ActivityClassification::LESSONS_KEY, ActivityClassification::DIAGNOSTIC_KEY].include?(activity_classification_key)
        score = get_average_score(formatted_concept_results)
      elsif [ActivityClassification::EVIDENCE_KEY].include?(activity_classification_key)
        score = nil
      else
        score = (final_activity_session.percentage * 100).round
      end
      {
        activity_classification: activity_classification_key,
        id: student.id,
        name: student.name,
        time: get_time_in_minutes(final_activity_session),
        number_of_questions: formatted_concept_results.length,
        concept_results: formatted_concept_results,
        score: score,
        average_score_on_quill: average_score_on_quill
      }
    end


    def get_time_in_minutes(activity_session)
      return 'Untracked' if !(activity_session.started_at && activity_session.completed_at)

      time = ((activity_session.completed_at - activity_session.started_at) / 60).round()
      time > 60 ? '> 60' : time
    end

    def get_concept_results(activity_session)
      activity_session.concept_results.group_by{|cr| cr[:metadata]["questionNumber"]}.map { |key, cr|
        # if we don't sort them, we can't rely on the first result being the first attemptNum
        # however, it would be more efficient to make them a hash with attempt numbers as keys
        cr.sort!{|x,y| (x[:metadata]['attemptNumber'] || 0) <=> (y[:metadata]['attemptNumber'] || 0)}
        directfirst = cr.first[:metadata]["directions"] || cr.first[:metadata]["instructions"] || ""
        hash = {
          directions: directfirst.gsub(/(<([^>]+)>)/i, "").gsub("()", "").gsub("&nbsp;", ""),
          prompt: cr.first[:metadata]["prompt"],
          answer: cr.first[:metadata]["answer"],
          score: get_score_for_question(cr),
          concepts: cr.map { |crs|
            direct = crs[:metadata]["directions"] || crs[:metadata]["instructions"] || ""
            {
              id: crs.concept_id,
              name: crs.concept.name,
              correct: crs[:metadata]["correct"] == 1,
              lastFeedback: crs[:metadata]["lastFeedback"],
              attempt: crs[:metadata]["attemptNumber"] || 1,
              answer: crs[:metadata]["answer"],
              directions: direct.gsub(/(<([^>]+)>)/i, "").gsub("()", "").gsub("&nbsp;", "")
            }
          },
          question_number: cr.first[:metadata]["questionNumber"]
        }
        if cr.first[:metadata]['questionScore']
          hash[:questionScore] = cr.first[:metadata]['questionScore']
        end
        hash
      }
    end

    def get_score_for_question(concept_results)
      if !concept_results.empty? && concept_results.first[:metadata]['questionScore']
        concept_results.first[:metadata]['questionScore'] * 100
      else
        concept_results.inject(0) {|sum, crs| sum + crs[:metadata]["correct"]} / concept_results.length * 100
      end
    end

    def get_average_score(formatted_results)
      if formatted_results.empty?
        100
      else
        (formatted_results.inject(0) {|sum, crs| sum + crs[:score]} / formatted_results.length).round()
      end
    end

    def generate_recommendations_for_classroom(unit_id, classroom_id, activity_id)
      classroom_unit = ClassroomUnit.find_by(classroom_id: classroom_id, unit_id: unit_id)
      classroom = Classroom.find(classroom_id)
      diagnostic = Activity.find(activity_id)
      activity_sessions = ActivitySession.includes(concept_results: :concept)
                      .where(classroom_unit_id: classroom_unit.id, is_final_score: true, activity: activity_id)
      activity_sessions_counted = activity_sessions_with_counted_concepts(activity_sessions)
      students = classroom.students.map do |s|
        next unless classroom_unit.assigned_student_ids.include?(s&.id)
        completed = activity_sessions.any? { |session| session.user_id == s&.id }
        {id: s&.id, name: s&.name || "Unknown Student", completed: completed }
      end

      sorted_students = students.compact.sort_by {|stud| stud[:name].split()[1]}

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

    def return_value_for_recommendation(students, activity_pack_recommendation)
      {
        activity_pack_id: activity_pack_recommendation[:activityPackId],
        name: activity_pack_recommendation[:recommendation],
        students: students
      }
    end

    def get_previously_assigned_recommendations_by_classroom(classroom_id, activity_id)
      classroom = Classroom.find(classroom_id)
      teacher_id = classroom.owner.id
      diagnostic = Activity.find(activity_id)
      assigned_recommendations = RecommendationsQuery.new(diagnostic.id).activity_recommendations.map do |rec|
        # teachers may rename and reassign activity packs so we check all
        units = Unit.where(user_id: teacher_id, unit_template_id: rec[:activityPackId], visible: true)
        if !units
          units = Unit.where(user_id: teacher_id, name: UnitTemplate.find_by_id(rec[:activityPackId]).name, visible: true)
        end
        student_ids = []
        units.each do |unit|
          student_ids.concat(ClassroomUnit.find_by(unit: unit, classroom: classroom, visible: true).try(:assigned_student_ids) || [])
        end
        return_value_for_recommendation(student_ids.uniq, rec)
      end
      recommended_lesson_activity_ids = LessonRecommendationsQuery.new(diagnostic.id)
        .activity_recommendations
        .map { |r| r[:activityPackId] }
      associated_teacher_ids = ClassroomsTeacher.where(classroom_id: classroom_id).pluck(:user_id)
      assigned_lesson_ids = Unit.where(unit_template_id: recommended_lesson_activity_ids, user_id: associated_teacher_ids).pluck(:unit_template_id)
      {
        previouslyAssignedRecommendations: assigned_recommendations,
        previouslyAssignedLessonsRecommendations: assigned_lesson_ids
      }
    end

    def activity_sessions_with_counted_concepts(activity_sessions)
      activity_sessions.map do |activity_session|
        {
          user_id: activity_session.user_id,
          concept_scores: concept_results_by_count(activity_session)
        }
      end
    end

    def concept_results_by_count(activity_session)
      hash = Hash.new { |h, k| h[k] = Hash.new { |j, l| j[l] = 0 } }
      activity_session.concept_results.each do |concept_result|
        hash[concept_result.concept.uid]["correct"] += concept_result["metadata"]["correct"]
        hash[concept_result.concept.uid]["total"] += 1
      end
      hash
    end

    def generic_questions_for_report(activity_id)
      questions = Activity.find_by_id(activity_id).data['questions'].map { |q| Question.find_by_uid(q['key']) }
      question_array = []
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
