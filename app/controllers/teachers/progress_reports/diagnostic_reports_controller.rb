class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController

  def show
    @classroom_id = current_user.classrooms_i_teach.last.id || nil
    @report = params[:report] || 'question'
  end

  def question_view
    results_by_question
    render json:  {data: results_by_question}.to_json
  end

  def students_by_classroom
    render json: results_for_classroom(params[:unit_id], params[:activity_id], params[:classroom_id])
  end


  def classrooms_with_students
    classrooms = classrooms_with_students_that_completed_activity(params[:unit_id], params[:activity_id])
    render json: classrooms.to_json
  end

  def recommendations_for_classroom
    render json: get_recommendations_for_classroom(params[:classroom_id])
  end

  def assign_selected_packs
    teacher_id = current_user.id
    classroom_id = params[:classroom_id]
    params[:selections].values.each do |value|
      Units::Creator.assign_unit_template_to_one_class(teacher_id, value[:id], classroom_id, value[:student_ids])
    end
    render json: {data: "Hi"}
  end

  def default_diagnostic_report
    redirect_to default_diagnostic_url
  end


  private

  def first_completed_diagnostic
    classroom_activities = current_user.classroom_activities(:activity_sessions)
    classroom_activities.each do |ca|
      if ca.activity_sessions
            .where.not(activity_sessions: {started_at: nil})
            .where(activity_sessions: {activity_id: Activity.diagnostic.id})
            .limit(1)
            .any?
            classroom_activity = ca
            return ca
      end
    end
    return false
  end

  def default_diagnostic_url
    if first_completed_diagnostic
      ca = first_completed_diagnostic
      custom_url = "#u/#{ca.unit.id}/a/#{Activity.diagnostic.id}/c/#{ca.classroom_id}"
      return "/teachers/progress_reports/diagnostic_reports/#{custom_url}/questions"
    else
      return "/teachers/progress_reports/diagnostic_reports/#not_completed"
    end
  end

  def results_by_question
    classroom_activity = ClassroomActivity.find_by(classroom_id: params[:classroom_id], activity_id: params[:activity_id], unit_id: params[:unit_id])
    questions = Hash.new{|h,k| h[k]={} }
    all_answers = classroom_activity.activity_session_metadata
    all_answers.each do |answer|
      curr_quest = questions[answer["questionNumber"]]
      curr_quest[:correct] ||= 0
      curr_quest[:total] ||= 0
      curr_quest[:correct] += answer["correct"]
      curr_quest[:total] += 1
      curr_quest[:prompt] ||= answer["prompt"]
      curr_quest[:question_number] ||= answer["question_number"]
      curr_quest[:instructions] ||= answer["directions"]
    end
    # TODO: change the diagnostic reports so they take in a hash of classrooms -- this is just
    # being converted to an array because that is what the diagnostic reports expect
    questions_arr = questions.map do |k,v|
      {question_id: k,
       score: ((v[:correct].to_f/v[:total].to_f) * 100).round,
       prompt: v[:prompt],
       instructions: v[:instructions]
      }
    end
    questions_arr
  end


  def classrooms_with_students_that_completed_activity unit_id, activity_id
    h = {}
    unit = Unit.find(unit_id)
    class_ids = current_user.classrooms_i_teach.map(&:id)
    #without definining class ids, it may default to a classroom activity from a non-existant classroom
    class_acts = unit.classroom_activities.where(activity_id: activity_id, classroom_id: class_ids)

    class_acts.each do |ca|
      classroom = ca.classroom.attributes
      activity_sessions = ca.activity_sessions.completed
      activity_sessions.each do |activity_session|
        class_id = classroom['id']
        h[class_id] ||= classroom
        h[class_id][:students] ||= []
        if h[class_id][:students].exclude? activity_session.user
           h[class_id][:students] << activity_session.user
        end
        h[class_id][:classroom_activity_id] = ca.id
      end
    end

    # TODO: change the diagnostic reports so they take in a hash of classrooms -- this is just
    # being converted to an array because that is what the diagnostic reports expect
    h.map{|k,v| v}
  end

  def results_for_classroom unit_id, activity_id, classroom_id
    classroom_activity = ClassroomActivity.find_by(classroom_id: classroom_id, activity_id: activity_id, unit_id: unit_id)
    activity_sessions = classroom_activity.activity_sessions.where(is_final_score: true).includes(:user, concept_results: :concept)
    classroom = Classroom.find(classroom_id)
    scores = {
      id: classroom.id,
      name: classroom.name
    }
    scores[:students] = activity_sessions.map do |activity_session|
        student = activity_session.user
        formatted_concept_results = get_concept_results(activity_session)
      {
          id: student.id,
          name: student.name,
          time: get_time_in_minutes(activity_session),
          number_of_questions: formatted_concept_results.length,
          concept_results: formatted_concept_results,
          score: get_average_score(formatted_concept_results)
        }
    end
    scores
  end


  def get_time_in_minutes activity_session
    ((activity_session.completed_at - activity_session.started_at) / 60).round()
  end

  def get_concept_results activity_session
    activity_session.concept_results.group_by{|cr| cr[:metadata]["questionNumber"]}.map { |key, cr|
      {
        directions: cr.first[:metadata]["directions"],
        prompt: cr.first[:metadata]["prompt"],
        answer: cr.first[:metadata]["answer"],
        score: get_score_for_question(cr),
        concepts: cr.map { |crs|
          {
            id: crs.concept_id,
            name: crs.concept.name,
            correct: crs[:metadata]["correct"] == 1
          }
        },
        question_number: cr.first[:metadata]["questionNumber"]
      }
    }
  end

  def get_score_for_question concept_results
    concept_results.inject(0) {|sum, crs| sum + crs[:metadata]["correct"]} / concept_results.length * 100
  end

  def get_average_score formatted_results
    (formatted_results.inject(0) {|sum, crs| sum + crs[:score]} / formatted_results.length).round()
  end

  @@data = [
    {
      recommendation: "Fragments",
      activityPackId: 3,
      requirements: [
        {
          concept_id: "j89kdRGDVjG8j37A12p37Q",
          count: 3
        },
        {
          concept_id: "KfA8-dg8FvlJz4eY0PkekA",
          count: 6
        },
        {
          concept_id: "LH3szu784pXA5k2N9lxgdA",
          count: 3
        },
      ]
    },

    {
      recommendation: "Compound Subjects, Objects, and Predicates",
      activityPackId: 6,
      requirements: [
        {
          concept_id: "Jl4ByYtUfo4VhIKpMt23yA",
          count: 1
        },
        {
          concept_id: "QNkNRs8zbCXU7nLBeo4mgA",
          count: 1
        },
      ]
    },

    {
      recommendation: "Adjectives",
      activityPackId: 8,
      requirements: [
        {
          concept_id: "oCQCO1_eVXQ2zqw_7QOuBw",
          count: 1
        }
      ]
    },

    {
      recommendation: "Adverbs",
      activityPackId: 7,
      requirements: [
        {
          concept_id: "GZ04vHSTxWUTzhWMGfwcUQ",
          count: 1
        }
      ]
    },

    {
      recommendation: "Compound Sentences",
      activityPackId: 4,
      requirements: [
        {
          concept_id: "GiUZ6KPkH958AT8S413nJg",
          count: 2
        },
        {
          concept_id: "Qqn6Td-zR6NIAX43NOHoCg",
          count: 1
        },
        {
          concept_id: "hJKqVOkQQQgfEsmzOWC1xw",
          count: 1
        },
        {
          concept_id: "kODm7xLmhGShct5uJIfHXg",
          count: 1
        }
      ]
    },

    {
      recommendation: "Complex Sentences",
      activityPackId: 5,
      requirements: [
        {
          concept_id: "nb0JW1r5pRB5ouwAzTgMbQ",
          count: 2
        },
        {
          concept_id: "Q8FfGSv4Z9L2r1CYOfvO9A",
          count: 2
        },
        {
          concept_id: "S8b-N3ZrB50CWgxD5yg8yQ",
          count: 1
        },
        {
          concept_id: "7H2IMZvq0VJ4Uvftyrw7Eg",
          count: 1
        }
      ]
    },

    {
      recommendation: "Appositive and Modifying Phrases",
      activityPackId: 2,
      requirements: [
        {
          concept_id: "InfGdB6Plr2M930kqsn63g",
          count: 1
        },
        {
          concept_id: "GLjAExmqZShBTZ7DQGvVLw",
          count: 1
        }
      ]
    },

    {
      recommendation: "Parallel Structure",
      activityPackId: 10,
      requirements: [
        {
          concept_id: "1ohLyApTz7lZ3JszrA98Xg",
          count: 1
        }
      ]
    }
  ]


  def get_recommendations_for_classroom classroom_id
    classroom = Classroom.find(classroom_id)
    diagnostic = Activity.find(413)
    students = classroom.students
    activity_sessions = students.map do |student|
      student.activity_sessions.includes(concept_results: :concept).find_by(activity_id: diagnostic.id, is_final_score: true)
    end
    activity_sessions.compact!
    activity_sessions_counted = activity_sessions_with_counted_concepts(activity_sessions)
    unique_students = activity_sessions.map {|activity_session| user = activity_session.user; {id: user.id, name: user.name}}
    recommendations = @@data.map do |activity_pack_recommendation|
      students = []
      activity_sessions_counted.each do |activity_session|
        activity_pack_recommendation[:requirements].each do |req|
          if activity_session[:concept_scores][req[:concept_id]] < req[:count]
            students.push(activity_session[:user_id])
            break
          end
        end
      end
      return_value_for_recommendation(students, activity_pack_recommendation)
    end
    {
      students: unique_students,
      recommendations: recommendations
    }
  end

  def return_value_for_recommendation students, activity_pack_recommendation
    {
      activity_pack_id: activity_pack_recommendation[:activityPackId],
      name: activity_pack_recommendation[:recommendation],
      students: students
    }
  end

  def activity_sessions_with_counted_concepts activity_sessions
    activity_sessions.map do |activity_session|
      {
        user_id: activity_session.user_id,
        concept_scores: concept_results_by_count(activity_session)
      }
    end
  end

  def concept_results_by_count activity_session
    hash = Hash.new(0)
    activity_session.concept_results.each do |concept_result|
      hash[concept_result.concept.uid] += concept_result["metadata"]["correct"]
    end
    hash
  end


end
