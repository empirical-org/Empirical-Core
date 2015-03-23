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
      number_of_pages: @number_of_pages
    }
  end

  def retrieve_classrooms_for_assigning_activities # in response to ajax request
    current_user.classrooms.each do |classroom|
      obj = {
        classroom: classroom,
        students: classroom.students.sort_by(&:sorting_name)
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
  end

  def scores
    classrooms = current_user.classrooms.includes(:classroom_activities => [:unit])
    units = classrooms.map(&:classroom_activities).flatten.map(&:unit).uniq.compact

    if params[:no_load_has_ever_occurred_yet] == 'true'
      params[:classroom_id] = current_user.classrooms.first
      was_classroom_selected_in_controller = true
      selected_classroom = Classroom.find params[:classroom_id]
    else
      was_classroom_selected_in_controller = false
      selected_classroom = nil
    end

    scores, is_last_page = current_user.scorebook_scores params[:current_page].to_i, params[:classroom_id], params[:unit_id], params[:begin_date], params[:end_date]

    render json: {
      classrooms: classrooms,
      units: units,
      scores: scores,
      is_last_page: is_last_page,
      was_classroom_selected_in_controller: was_classroom_selected_in_controller,
      selected_classroom: selected_classroom
    }
  end

  private

  def authorize!
    if current_user.classrooms.any?
      if params[:classroom_id].present? and params[:classroom_id].length > 0
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
