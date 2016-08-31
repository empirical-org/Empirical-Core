class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController

  def show
    @classroom_id = current_user.classrooms_i_teach.last.id || nil
    @report = params[:report] || 'question'
  end

  def question_view
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
    render json: results_for_classroom(params[:classroom_id], params[:activity_id])
  end


  def classrooms_with_students
    render json: classrooms_with_students_that_completed_activity params[:unit_id] params[:classroom_activity_id]
  end

  private

  def classrooms_with_students_that_completed_activity unit_id, activity_id
    h = {}
    unit = Unit.find(unit_id)
    class_acts = unit.classroom_activities.where(activity_id: activity_id)
    class_acts.each do |ca|
      classroom = ca.classroom.attributes
      activity_sessions = ca.activity_sessions.where(is_final_score: true)
      activity_sessions.each do |activity_session|
        h[classroom['id']] ||= classroom
        h[classroom['id']][:students] ||= []
        h[classroom['id']][:students] << activity_session.user
      end
    end
    h
  end

  def results_for_classroom classroom_id, activity_id
    classroom = Classroom.find(classroom_id)
    activity = Activity.find(activity_id)
    scores = {
      id: classroom.id,
      name: classroom.name
    }
    scores[:students] = classroom.students.map { |student|
      loaded = student.activity_sessions.includes(concept_results: :concept).find_by(activity_id: activity.id, is_final_score: true)
      if loaded
        formatted_concept_results = get_concept_results(loaded)
        session = {
          id: loaded.id,
          time: get_time_in_minutes(loaded),
          number_of_questions: formatted_concept_results.length,
          concept_results: formatted_concept_results,
          score: get_average_score(formatted_concept_results)
        }
      else
        session = {
          id: nil,
          time: nil,
          concept_results: []
        }
      end
      {
        id: student.id,
        name: student.name,
        session: session
      }
    }
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
