class Teachers::UnitTemplatesController < ApplicationController
  before_action :is_teacher?, only: [:show, :index, :count]
  before_action :redirect_to_public_index_if_no_unit_template_found, only: [:show]

  include Units

  def index
    respond_to do |format|
      format.json do
        render json: UnitTemplate.user_scope(current_user.try(:flag) || 'production')
                      .includes(:author, :unit_template_category)
                      .map{|ut| UnitTemplateSerializer.new(ut).as_json(root: false)}
                      .sort{ |ut| ut[:order_number] }.reverse
      end

      format.html do
        redirect_to "/teachers/classrooms/activity_planner/featured-activity-packs/#{params[:id]}" if @is_teacher
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
    render json: {data: format_unit_template(ut), related_models: related_models(ut)}
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

  def format_unit_template(unit_template)
    formatted_unit_template = UnitTemplate
                  .includes(:author, :unit_template_category)
                  .where(id: unit_template.id)
                  .map{|ut| UnitTemplateSerializer.new(ut).as_json(root: false)}
                  .first
    formatted_unit_template[:non_authenticated] = !is_teacher?
    formatted_unit_template
  end

  def related_models(ut)
    related_models = UnitTemplate.where(unit_template_category_id: ut.unit_template_category_id).where.not(id: ut.id).limit(3)
    formatted_related_models = []
    related_models.each do |rm|
      formatted_related_models << format_unit_template(rm)
    end
    formatted_related_models
  end

end
