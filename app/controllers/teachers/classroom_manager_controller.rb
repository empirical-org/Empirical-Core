class Teachers::ClassroomManagerController < ApplicationController
  respond_to :json, :html
  layout 'classroom_manager'
  before_filter :teacher!
  before_filter :authorize!
  layout 'scorebook'
  include ScorebookHelper
  RESULTS_PER_PAGE = 12






  def lesson_planner
    @activities = Activity.includes(:classification, :topic => :section)
                    .where("'production' = ANY(activities.flags)")
                    .order("name ASC")
    search_helper
    @filters = [
      {records: @activity_classifications, type: 'activity_classification', alias: 'App'},
      {records: @topics, type: 'topic', alias: 'Concept'},
      {records: @sections, type: 'section', alias: 'Level'}
    ]
  end


  def search_activities

    filter_string = ''
    params['filters'].each do |pair| 
      filter_string = "#{filter_string} AND #{pair[0]}s.id = #{pair[1]}" if pair[1].length > 0
    end
    puts 'filter string : '
    puts filter_string

    sort_string = (params['sort']['field'].length > 0) ? "#{params['sort']['field']}s #{params['sort']['asc_or_desc']}" : "activities.name ASC"

    @activities = Activity.includes(:classification, :topic => :section)
                    .where("'production' = ANY(activities.flags)")
                    .where("((activities.name ILIKE '%#{params[:search_query]}%') OR (topics.name ILIKE '%#{params[:search_query]}%')) #{filter_string}")
                    .order(sort_string).references(:topic)

    @activity_classification_aliases = [
      {id: 1, alias: 'Quill Grammar'},
      {id: 2, alias: 'Quill Proofreader'}
    ]
      
                         
    search_helper

    render json: {
      activities: @activities,
      activity_classifications: @activity_classifications,
      topics: @topics,
      sections: @sections,
      activity_classification_image_paths: @activity_classification_image_paths,
      number_of_pages: @number_of_pages,
      active_page: @active_page
    }

  end

  def search_helper
    @activity_classifications = @activities.map(&:classification).reject{|ac| ac.nil?}.uniq
    @topics = @activities.map(&:topic).uniq
    @sections = @topics.map(&:section).uniq
    @activity_classification_image_paths = @activity_classifications.map{|ac| {id: ac.id, image_path: view_context.image_path(image_for_activity_classification_by_id(ac.id))} }
    @number_of_pages = @activities.count/RESULTS_PER_PAGE
    @active_page = 1
    @results_per_page = RESULTS_PER_PAGE
  end



  def retrieve_classrooms_for_assigning_activities # in response to ajax request
    @activities = Activity.find params[:activities]
    current_user.classrooms.each do |classroom|
      obj = {
        classroom: classroom,
        students: classroom.students
      }
      ( @classrooms_and_their_students ||= [] ).push obj
    end
    render partial: 'assign', layout: false
  end




  def invite_students
    @classrooms = current_user.classrooms
  end

  def scorebook
    @classrooms = current_user.classrooms - [@classroom]
    @unit = Unit.find(params[:unit_id]) if params[:unit_id]
    @units = @classroom.classroom_activities.map(&:unit).uniq - [@unit]
    @are_all_units_selected = (params[:all_units])
  end

  

  private



  def authorize!
    if !params[:classroom_id].nil?
      @classroom = Classroom.find(params[:classroom_id])
    end
    @classroom ||= current_user.classrooms.first
    auth_failed unless @classroom.teacher == current_user
  end



end




