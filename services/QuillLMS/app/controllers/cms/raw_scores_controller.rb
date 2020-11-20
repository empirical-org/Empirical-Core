class Cms::RawScoresController < Cms::CmsController

  def index
    raw_scores = RawScore.order_by_name
    activity_classification_conversion_charts = {}
    ActivityClassification.all.map do |ac|
      conversion_table = raw_scores.map do |rs|
        {
          raw_score: rs.name,
          grade_band: rs.readability_grade_level(ac.id),
          activity_count: Activity.where(raw_score_id: rs.id, activity_classification_id: ac.id).count
        }
      end
      activity_classification_conversion_charts[ac.name] = conversion_table
    end
    render json: { raw_scores: raw_scores, activity_classification_conversion_charts: activity_classification_conversion_charts }
  end

  def create
    new_raw_score = RawScore.create(raw_score_params)

    render json: { raw_score: new_raw_score }
  end

  def update
    updated_raw_score = RawScore.find_by_id(params[:id]).update(raw_score_params)

    render json: { raw_score: updated_raw_score }
  end

  def raw_score_params
    params.require(:raw_score).permit(:name)
  end

end
