class SchoolsController < ApplicationController
  include CheckboxCallback
  MIN_PREFIX_LENGHT_WHEN_LAT_LON_NOT_PRESENT = 4

  def index
    # TODO: return here
    @radius = params[:radius].presence || 5
    @limit = params[:limit].presence || 10
    @lat, @lng, @prefix = params[:lat],params[:lng], params[:prefix]
    @schools = []

    unless @prefix.blank?
      if @lat.present? and @lng.present?
        school_ids = JSON.load($redis.get("LAT_LNG_RADIUS_TO_SCHOOL_#{@lat}_#{@lng}_#{@radius}"))
      else
        school_ids = JSON.load($redis.get("PREFIX_TO_SCHOOL_#{@prefix}"))
      end

      unless school_ids.blank? 
        @schools = School.where(id: school_ids).where(
          "lower(name) LIKE :prefix", prefix: "#{@prefix.downcase}%"
        ).limit(@limit)
        unless @schools.empty?
          puts 'CACHE HIT'
        end
      end

      if @lat.present? and @lng.present? and @schools.empty?
        zip_arr = ZipcodeInfo.isinradius([@lat.to_f, @lng.to_f], @radius.to_i).map {|z| z.zipcode}
        @schools = School.where(zipcode: zip_arr 
         ).where(
         "lower(name) LIKE :prefix", prefix: "#{@prefix.downcase}%"
         ).limit(@limit)
         $redis.set("LAT_LNG_RADIUS_TO_SCHOOL_#{@lat}_#{@lng}_#{@radius}", @schools.map {|s| s.id}.to_json)
         # short cache, highly specific
        $redis.expire("LAT_LNG_RADIUS_TO_SCHOOL_#{@lat}_#{@lng}_#{@radius}", 60*5)
      end

      if @schools.empty? and @prefix.length < MIN_PREFIX_LENGHT_WHEN_LAT_LON_NOT_PRESENT
        @schools = []
      elsif @schools.empty?
        @schools = School.where(
           "lower(name) LIKE :prefix", prefix: "#{@prefix.downcase}%"
         ).limit(@limit)
        $redis.set("PREFIX_TO_SCHOOL_#{@prefix}", @schools.map {|s| s.id}.to_json)
        # longer cache, more general
        $redis.expire("PREFIX_TO_SCHOOL_#{@prefix}", 60*60)
      end
    end
    
  end

  def new
  end

  def select_school
    respond_to do |format|
      format.html # select_school.html.erb
      format.json {
        @js_file = 'session'
        #if the school does not specifically have a name, we send the type (e.g. not listed, international, etc..)
        if School.find_by_id(school_params[:school_id_or_type])
          school = School.find(school_params[:school_id_or_type])
        else
          school = School.find_or_create_by(
            name: school_params[:school_id_or_type]
          )
        end
        school_user = SchoolsUsers.find_or_initialize_by(
          user_id: current_user.id
        )
        if school_user.update(school_id: school.id)
          SyncSalesContactWorker.perform_async(current_user.id)
        end
        find_or_create_checkbox('Add School', current_user)
        render json: {}
      }
    end
  end

  private

  def school_params
    params.permit(:school_id_or_type)
  end
end
