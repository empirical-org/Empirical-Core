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

  private

end
