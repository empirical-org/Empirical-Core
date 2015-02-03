class Teachers::ClassroomManagerController < ApplicationController
  respond_to :json, :html
  layout 'classroom_manager'
  before_filter :teacher!
  before_filter :authorize!
  layout 'scorebook'
  include ScorebookHelper
  RESULTS_PER_PAGE = 12






  def lesson_planner

  end

  def search_activities
    
    # filter_string = ''
    # params['filters'].each do |pair| 
    #   filter_string = "#{filter_string} AND #{pair[0]}s.id = #{pair[1]}" if pair[1].length > 0
    # end
    
    # filter_string = (filter_string)



    # sort_string = (params['sort']['field'].length > 0) ? "#{params['sort']['field']}s #{params['sort']['asc_or_desc']}" : "activities.name ASC"

    # This is coming in as an hash of hashes with keys "0", "1", "2".

    @activities = Activity.search(search_params[:search_query], search_filters, "activities.name ASC")
    @activity_classifications = @activities.map(&:classification).reject{|ac| ac.nil?}.uniq
    @topics = @activities.map(&:topic).uniq
    @sections = @topics.map(&:section).uniq
    @number_of_pages = @activities.count/RESULTS_PER_PAGE
    @results_per_page = RESULTS_PER_PAGE
    @activities = @activities.map{|a| (ActivitySerializer.new(a)).as_json(root: false)}



    render json: {
      activities: @activities,
      activityClassifications: @activity_classifications,
      topics: @topics,
      sections: @sections,
      filters: @filters,
      number_of_pages: @number_of_pages,
    }

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
    #render partial: 'assign', layout: false
    render json: {
      classrooms_and_their_students: @classrooms_and_their_students
    }
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

  def search_filters
    filter_fields = [:activity_classifications, :topics, :sections]
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
    params.require(:search).permit([:search_query, {filters: [:field, :selected]}])
  end

end




