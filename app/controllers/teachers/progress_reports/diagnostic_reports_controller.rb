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
    render json: results_for_classroom(params[:classroom_id])
  end

  private

  def results_for_classroom classroom_id
    classroom = Classroom.find(classroom_id)
    diagnostic = Activity.find(413)
    scores = {
      id: classroom.id,
      name: classroom.name
    }
    scores[:students] = classroom.students.map { |student|
      loaded = student.activity_sessions.includes(concept_results: :concept).find_by(activity_id: diagnostic.id, is_final_score: true)
      if loaded
        session = {
          id: loaded.id,
          concept_results: loaded.concept_results.group_by{|cr| cr[:metadata]["questionNumber"]}.map { |key, cr|
            {
              directions: cr.first[:metadata]["directions"],
              prompt: cr.first[:metadata]["prompt"],
              answer: cr.first[:metadata]["answer"],
              score: cr.inject(0) {|sum, crs| sum + crs[:metadata]["correct"]} / cr.length * 100,
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
        }
      else
        session = {
          id: nil,
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

end
