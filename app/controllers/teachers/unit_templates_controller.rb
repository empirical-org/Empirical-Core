class Teachers::UnitTemplatesController < ApplicationController
  before_action :is_teacher?, only: [:show, :index, :count]
  before_action :redirect_to_public_index_if_no_unit_template_found, only: [:show]

  include Units

  def index
    respond_to do |format|
      format.json do
        render json: UnitTemplate.user_scope(current_user.try(:flag) || 'production')
                      .includes(:author, :unit_template_category)
                      .reverse
                      .map{|ut| UnitTemplateSerializer.new(ut).as_json(root: false)}
      end

      format.html do
        redirect_to_explore_activity_packs if @is_teacher
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

  def redirect_to_explore_activity_packs
    redirect_to(controller: "teachers/classroom_manager", action: "lesson_planner", tab: "exploreActivityPacks")
  end

end
