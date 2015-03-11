class Teachers::ClassroomManagerController < ApplicationController
  respond_to :json, :html
  layout 'classroom_manager'
  before_filter :teacher!
  before_filter :authorize!
  layout 'scorebook'
  include ScorebookHelper
  RESULTS_PER_PAGE = 12

  def lesson_planner
    if current_user.classrooms.empty?
      redirect_to new_teachers_classroom_path
    end
  end

  def search_activities
    @activities = Activity.search(search_params[:search_query], search_filters, search_params[:sort])
    @activity_classifications = @activities.map(&:classification).uniq.compact
    @topics = @activities.map(&:topic).uniq.compact
    @topic_categories = @topics.map(&:topic_category).uniq.compact
    @sections = @topics.map(&:section).uniq.compact

    @number_of_pages = (@activities.count.to_f/RESULTS_PER_PAGE.to_f).ceil
    @results_per_page = RESULTS_PER_PAGE
    @activities = @activities.map{|a| (ActivitySerializer.new(a)).as_json(root: false)}

    render json: {
      activities: @activities,
      activity_classifications: @activity_classifications,
      topic_categories: @topic_categories,
      sections: @sections,
      number_of_pages: @number_of_pages,
    }
  end

  def retrieve_classrooms_for_assigning_activities # in response to ajax request
    current_user.classrooms.each do |classroom|
      obj = {
        classroom: classroom,
        students: classroom.students
      }
      ( @classrooms_and_their_students ||= [] ).push obj
    end
    #render partial: 'assign', layout: false
    render json: {
      classrooms_and_their_students: @classrooms_and_their_students
    }
  end

  def invite_students
    @classrooms = current_user.classrooms
  end

  def scorebook
    if current_user.classrooms.empty?
      redirect_to new_teachers_classroom_path
    end
    @classrooms = current_user.classrooms - [@classroom]

    if [54569, 60607, 104720].include?(current_user.id) and (params[:unit_id].nil?) # temp fix for users with huge scorebooks
      @unit = current_user.classrooms.map(&:classroom_activities).flatten.map(&:unit).compact.last
    else
      @unit = Unit.find(params[:unit_id]) if params[:unit_id]
    end

    @units = @classroom.classroom_activities.includes(:unit).map(&:unit).uniq - [@unit]
    @are_all_units_selected = (params[:all_units])
  end

  private

  def authorize!
    if current_user.classrooms.any?
      if !params[:classroom_id].nil?
        @classroom = Classroom.find(params[:classroom_id])
      end

      @classroom ||= current_user.classrooms.first
      auth_failed unless @classroom.teacher == current_user
    end
  end

  def search_filters
    filter_fields = [:activity_classifications, :topic_categories, :sections]
    search_params[:filters].reduce({}) do |acc, filter|
      filter_value = filter[1]
      # activityClassification -> activity_classifications
      # Just for the record, this is a terrible hacky workaround.
      model_name = filter_value['field'].to_s.pluralize.underscore.to_sym
      model_id = filter_value['selected'].to_i
      if filter_fields.include?(model_name) and !model_id.zero?
        acc[model_name] = model_id
      end
      acc
    end
  end

  def search_params
    params.require(:search).permit([:search_query, {sort: [:field, :asc_or_desc]},  {filters: [:field, :selected]}])
  end
end
