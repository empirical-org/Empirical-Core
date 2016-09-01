class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController

  def show
    @classroom_id = current_user.classrooms_i_teach.last.id || nil
    @report = params[:report] || 'question'
  end

  def question_view
    results_by_question
    render json:  {data: [{question_id: 123,
                    score: 87,
                    instructions: 'Fix run on sentence',
                    prompt: 'Run'},
                    {question_id: 1323,
                    score: 70,
                    instructions: 'Go to the gym',
                    prompt: 'Run'},
                    {question_id: 112323,
                    score: 30,
                    instructions: "I can't it's too hard",
                    prompt: 'Run'}]
                  }
  end

  def students_by_classroom
    render json: results_for_classroom(params[:unit_id], params[:activity_id], params[:classroom_id])
  end


  def classrooms_with_students
    classrooms = classrooms_with_students_that_completed_activity(params[:unit_id], params[:activity_id])
    render json: classrooms.to_json
  end

  private

  def results_by_question
    classroom_activity = ClassroomActivity.find_by(classroom_id: params[:classroom_id], activity_id: params[:activity_id], unit_id: params[:unit_id])
    questions = Hash.new{|h,k| h[k]={} }
    all_answers = classroom_activity.metadata
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
    puts questions
    # TODO: change the diagnostic reports so they take in a hash of classrooms -- this is just
    # being converted to an array because that is what the diagnostic reports expect
    questions_arr = questions.map do |k,v|
      {question_id: v[:question_number],
       score: ((v[:correct].to_f/v[:total].to_f) * 100).round,
       prompt: v[:prompt],
       prompt: v[:directions]
      }
    end
    binding.pry
    questions_arr
  end


  def classrooms_with_students_that_completed_activity unit_id, activity_id
    h = {}
    unit = Unit.find(unit_id)
    class_act = unit.classroom_activities.find_by(activity_id: activity_id)
    classroom = class_act.classroom.attributes
    activity_sessions = class_act.activity_sessions.where(is_final_score: true)
    activity_sessions.each do |activity_session|
      class_id = classroom['id']
      h[class_id] ||= classroom
      h[class_id][:students] ||= []
      h[class_id][:students] << activity_session.user
      h[class_id][:classroom_activity_id] = class_act.id
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
        session = {
          id: activity_session.id,
          time: get_time_in_minutes(activity_session),
          number_of_questions: formatted_concept_results.length,
          concept_results: formatted_concept_results,
          score: get_average_score(formatted_concept_results)
        }
      {
          id: student.id,
          name: student.name,
          session: session
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

end
