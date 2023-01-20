# frozen_string_literal: true

class Teachers::UnitTemplatesController < ApplicationController
  before_action :is_teacher?, only: [:show, :index, :count]
  before_action :redirect_to_public_index_if_no_unit_template_found, only: [:show]
  before_action :set_root_url

  def index
    respond_to do |format|
      format.html do
        if params[:id]
          unit_template = UnitTemplate
            .includes(activities: :classification)
            .find(params[:id])

          @image_link = unit_template&.image_link
          @title = "Activity Pack: #{unit_template&.name}"
          @content = unit_template&.meta_description
        end
        redirect_to "/assign/featured-activity-packs/#{params[:id]}" if @is_teacher
        @defer_js = true # opt for faster page load for public page, i.e. !@is_teacher
      end
      format.json do
        render json: { unit_templates: cached_formatted_unit_templates }
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
    @content = @unit_template.meta_description
    @image_link = @unit_template.image_link
    @unit_template_id = @unit_template.id
    render 'public_show' if !@is_teacher
  end

  def count
    @count = UnitTemplate.count
    render json: {count: @count}
  end

  def profile_info
    ut = UnitTemplate.find(params[:id])
    formatted = format_unit_template(ut.id)
    formatted = formatted.merge({ flag: ut.flag })
    response = { data: formatted }
    response = response.merge({ referral_code: current_user.referral_code }) if current_user && current_user.teacher?
    render json: response
  end

  def assigned_info
    render json: {
      name: UnitTemplate.find(params[:id]).name,
      last_classroom_name: current_user.classrooms_i_teach.last.name,
      last_classroom_id: current_user.classrooms_i_teach.last.id
    }
  end

  def previously_assigned_activities
    ids = JSON.parse(params[:activity_ids])
    results = UnitTemplate.previously_assigned_activity_data(ids, current_user)
    render json: results
  end

  private def is_teacher?
    @is_teacher = (current_user && current_user.role == 'teacher')
  end

  private def redirect_to_public_index_if_no_unit_template_found
    begin
      @unit_template = UnitTemplate.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to :public_index
    end
  end

  private def format_unit_template(ut_id)
    formatted_unit_template = get_formatted_unit_template_for_profile(ut_id)
    formatted_unit_template[:non_authenticated] = !is_teacher?
    formatted_unit_template
  end

  private def current_user_testing_flag
    return unless current_user.present?

    current_user.testing_flag
  end

  private def related_models_flag
    current_user_testing_flag || "production"
  end

  private def unit_templates_by_user_testing_flag
    UnitTemplate.user_scope(related_models_flag)
    .includes(:author, :unit_template_category)
    .order(:order_number)
    .map{ |ut| ut.get_cached_serialized_unit_template }
  end

  private def cached_formatted_unit_templates
    ut_cache_name = "#{related_models_flag}_unit_templates"
    cached = $redis.get(ut_cache_name)
    set_cache_if_necessary_and_return(cached, ut_cache_name)
  end

  private def set_cache_if_necessary_and_return(cached, ut_cache_name)
    ut_cache = cached.nil? || cached&.blank? ? nil : JSON.parse(cached)
    if ut_cache
      ut_cache
    else
      uts = unit_templates_by_user_testing_flag
      $redis.set(ut_cache_name, uts.to_json)
      uts
    end
  end

  private def get_formatted_unit_template_for_profile(id)
    # TODO: remove this where and replace with find, and then figure out why there is a map
    ut = UnitTemplate.includes(:author, :unit_template_category).find id
    ut.get_cached_serialized_unit_template('profile')
  end

  private def set_root_url
    @root_url = root_url
  end
end
