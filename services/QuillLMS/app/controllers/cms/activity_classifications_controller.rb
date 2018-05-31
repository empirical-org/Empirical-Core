class Cms::ActivityClassificationsController < Cms::CmsController
  def index
    respond_to do |format|
      format.html
      format.json do
        render json: ActivityClassification.order(order_number: :asc)
      end
    end
  end

  def create
    activity_classification = ActivityClassification.new(activity_classification_params)
    if activity_classification.save!
      render json: activity_classification
    else
      render json: {errors: activity_classification.errors}, status: 422
    end
  end

  def update
    activity_classification = ActivityClassification.find(activity_classification_params['id'])
    if activity_classification.update_attributes(activity_classification_params)
      render json: activity_classification
    else
      render json: {errors: activity_classification.errors}, status: 422
    end
  end

  def update_order_numbers
    activity_classifications = params[:activity_classifications]
    activity_classifications.each { |ac| ActivityClassification.find(ac['id']).update(order_number: ac['order_number']) }
    render json: {activity_classifications: ActivityClassification.order(order_number: :asc)}
  end

  def destroy
    activity_classification = ActivityClassification.find(params[:id])
    activity_classification.destroy
    render json: {}
  end

  protected

  def activity_classification_params
    params.require(:activity_classification).permit!
  end
end
