class Cms::StandardLevelsController < Cms::CmsController
  def index
    change_logs = []
    standard_levels = StandardLevel.includes(:activities, change_logs: :user).all.map do |sl|
      standard_level = sl.attributes
      standard_level[:activity_count] = sl.activities.count
      standard_level[:change_logs] = sl.change_logs.map do |cl|
        change_log = cl.attributes
        change_log[:user] = cl.user
        change_log[:record_name] = sl.name
        change_logs.push(change_log)
        change_log
      end
      standard_level
    end

    render json: { standard_levels: standard_levels, change_logs: change_logs }
  end

  def create
    standard_level = standard_level_params

    if standard_level[:change_logs_attributes]
      standard_level[:change_logs_attributes] = standard_level[:change_logs_attributes].map do |cl|
        cl[:user_id] = current_user.id
        cl
      end
    end

    new_standard_level = StandardLevel.create!(standard_level)

    render json: { standard_level: new_standard_level }
  end

  def update
    standard_level = standard_level_params
    standard_level[:change_logs_attributes] = standard_level[:change_logs_attributes].map do |cl|
      cl[:user_id] = current_user.id
      cl
    end

    updated_standard_level = StandardLevel.find_by_id(params[:id]).update(standard_level)

    render json: { standard_level: updated_standard_level }
  end

  def standard_level_params
    params.require(:standard_level).permit(
      :name,
      :id,
      :visible,
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
