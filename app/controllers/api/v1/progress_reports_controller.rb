class Api::V1::ProgressReportsController < Api::ApiController

  def activities_scores_by_classroom_data
    render json: {data: ProgressReports::ActivitiesScoresByClassroom.results(current_user.classrooms_i_teach.map(&:id))}
  end

end
