class Cms::StandardsController < Cms::CmsController
  def index
    change_logs = []
    standards = Standard.includes(:activities, change_logs: :user).all.map do |s|
      standard = s.attributes
      standard[:activity_count] = s.activities.count
      standard[:change_logs] = s.change_logs.map do |cl|
        change_log = cl.attributes
        change_log[:user] = cl.user
        change_log[:record_name] = s.name
        change_logs.push(change_log)
        change_log
      end
      standard
    end

    render json: { standards: standards, change_logs: change_logs }
  end

  def create
    standard = standard_params

    if standard[:change_logs_attributes]
      standard[:change_logs_attributes] = standard[:change_logs_attributes].map do |cl|
        cl[:user_id] = current_user.id
        cl
      end
    end

    new_standard = Standard.create!(standard)

    render json: { standard: new_standard }
  end

  def update
    standard = standard_params
    standard[:change_logs_attributes] = standard[:change_logs_attributes].map do |cl|
      cl[:user_id] = current_user.id
      cl
    end

    updated_standard = Standard.find_by_id(params[:id]).update(standard)

    render json: { standard: updated_standard }
  end

  def standard_params
    params.require(:standard).permit(
      :name,
      :id,
      :visible,
      :standard_category_id,
      :standard_level_id,
      change_logs_attributes: [
        :action,
        :explanation,
        :changed_attribute,
        :previous_value,
        :new_value,
        :changed_record_id,
        :changed_record_type,
        :user_id
      ]
    )
  end
end
