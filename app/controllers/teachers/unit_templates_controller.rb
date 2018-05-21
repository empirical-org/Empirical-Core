class Teachers::UnitTemplatesController < ApplicationController
  before_action :is_teacher?, only: [:show, :index, :count]
  before_action :redirect_to_public_index_if_no_unit_template_found, only: [:show]

  include Units

  def index
    respond_to do |format|
      format.html do
        redirect_to "/teachers/classrooms/assign_activities/featured-activity-packs/#{params[:id]}" if @is_teacher
      end
      format.json do
        render json: get_cached_formatted_unit_templates
      end
    end
  end

  def fast_assign
    if current_user.classrooms_i_teach.empty?
      render json: { error_message: 'You must create a classroom before you can assign an activity pack. You can create a new classroom on the classes page.'}, status: 400
    else
      FastAssignWorker.perform_async(current_user.id, params[:id])
      render json: {}
    end
  end

  def show
    @content = "Try out the #{@unit_template.name} Activity Pack I’m using at Quill.org"
    @unit_template_id = @unit_template.id
    render 'public_show' if not @is_teacher
  end

  def count
    @count = UnitTemplate.count
    render json: {count: @count}
  end

  def profile_info
    ut = UnitTemplate.find(params[:id])
    render json: {data: format_unit_template(ut.id), related_models: related_models(ut)}
  end

  def assigned_info
    render json: {
      name: UnitTemplate.find(params[:id]).name,
      last_classroom_name: current_user.classrooms_i_teach.last.name,
      last_classroom_id: current_user.classrooms_i_teach.last.id
    }
  end

  private

  def is_teacher?
    @is_teacher = (current_user && current_user.role == 'teacher')
  end

  def redirect_to_public_index_if_no_unit_template_found
    begin
      @unit_template = UnitTemplate.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to :public_index
    end
  end

  def format_unit_template(ut_id)
    formatted_unit_template = get_formatted_unit_template_for_profile(ut_id)
    formatted_unit_template[:non_authenticated] = !is_teacher?
    formatted_unit_template
  end

  def related_models(ut)
    related_models = UnitTemplate.related_models(current_user, ut)
    formatted_related_models = []
    related_models.each do |rm|
      formatted_related_models << format_unit_template(rm)
    end
    formatted_related_models
  end

  def get_unit_templats_by_user_testing_flag
    UnitTemplate.user_scope(current_user&.testing_flag || 'production')
    .includes(:author, :unit_template_category)
    .order(:order_number)
    .map{ |ut| ut.get_cached_serialized_unit_template }
  end

  def get_cached_formatted_unit_templates
    flag = current_user&.testing_flag || 'production'
    ut_cache_name = "#{flag}_unit_templates"
    cached = $redis.get(ut_cache_name)
    set_cache_if_necessary_and_return(cached, ut_cache_name)
  end

  def set_cache_if_necessary_and_return(cached, ut_cache_name)
    ut_cache = cached.nil? || cached&.blank? ? nil : eval(cached)
    if ut_cache
      ut_cache
    else
      uts = get_unit_templats_by_user_testing_flag
      $redis.set(ut_cache_name, uts)
      uts
    end
  end

  def get_formatted_unit_template_for_profile(id)
    # TODO: remove this where and replace with find, and then figure out why there is a map
    ut = UnitTemplate.includes(:author, :unit_template_category).find id
    ut.get_cached_serialized_unit_template('profile')
  end

end
