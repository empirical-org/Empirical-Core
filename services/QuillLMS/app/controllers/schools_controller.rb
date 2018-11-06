class SchoolsController < ApplicationController
  include CheckboxCallback
  MIN_PREFIX_LENGHT_WHEN_LAT_LON_NOT_PRESENT = 4

  def index
    @radius = params[:radius].presence || 5
    @limit = params[:limit].presence || 10
    @lat, @lng, @prefix = params[:lat],params[:lng], params[:prefix]
    @schools = []

    school_ids = []
    if @lat.present? and @lng.present?
      school_ids = JSON.load($redis.get("LAT_LNG_RADIUS_TO_SCHOOL_#{@lat}_#{@lng}_#{@radius}"))
    else
      school_ids = JSON.load($redis.get("PREFIX_TO_SCHOOL_#{@prefix}"))
      @schools = School.select("*, COUNT(DISTINCT schools_users.id) AS number_of_teachers")
      .joins('JOIN schools_users ON schools_users.school_id = schools.id')
      .where(id: school_ids)
      .group("schools.id, schools_users.school_id, schools_users.user_id, schools_users.id")
      .limit(@limit)
      puts 'CACHE HIT 1'
    end

    if @schools.empty? and school_ids.present?
      @schools = School.select("*, COUNT(DISTINCT schools_users.id) AS number_of_teachers")
      .joins('JOIN schools_users ON schools_users.school_id = schools.id')
      .where(id: school_ids)
      .where(
        "lower(name) LIKE :prefix", prefix: "#{@prefix.downcase}%"
      ).group("schools.id, schools_users.school_id, schools_users.user_id, schools_users.id")
      .limit(@limit)
      unless @schools.empty?
        puts 'CACHE HIT 2'
      end
    end

    if @lat.present? and @lng.present? and @schools.empty?
      zip_arr = ZipcodeInfo.isinradius([@lat.to_f, @lng.to_f], @radius.to_i).map {|z| z.zipcode}
      if zip_arr.present?
        @schools = School.select("*, COUNT(DISTINCT schools_users.id) AS number_of_teachers")
        .joins('JOIN schools_users ON schools_users.school_id = schools.id')
        .where(
          "zipcode in #{self.array_to_postgres_array_helper(zip_arr)} OR mail_zipcode in #{self.array_to_postgres_array_helper(zip_arr)}"
         ).where(
         "lower(name) LIKE :prefix", prefix: "%#{@prefix.downcase}%"
        ).group("schools.id, schools_users.school_id, schools_users.user_id, schools_users.id")
         .limit(@limit)
         $redis.set("LAT_LNG_RADIUS_TO_SCHOOL_#{@lat}_#{@lng}_#{@radius}", @schools.map {|s| s.id}.to_json)
         # short cache, highly specific
        $redis.expire("LAT_LNG_RADIUS_TO_SCHOOL_#{@lat}_#{@lng}_#{@radius}", 60*5)
      end
    end

    if @schools.empty? and @prefix.length < MIN_PREFIX_LENGHT_WHEN_LAT_LON_NOT_PRESENT
      @schools = []
    elsif @schools.empty?
      @schools = School
        .select("*, COUNT(DISTINCT schools_users.id) AS number_of_teachers")
        .joins('JOIN schools_users ON schools_users.school_id = schools.id')
        .where(
           "lower(name) LIKE :prefix", prefix: "#{@prefix.downcase}%"
         ).group("schools.id, schools_users.school_id, schools_users.user_id, schools_users.id")
         .limit(@limit)
      $redis.set("PREFIX_TO_SCHOOL_#{@prefix}", @schools.map {|s| s.id}.to_json)
      # longer cache, more general
      $redis.expire("PREFIX_TO_SCHOOL_#{@prefix}", 60*60)
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

  def array_to_postgres_array_helper(ruby_array)
    array_encoder = PG::TextEncoder::Array.new
    literal_encoder = PG::TextEncoder::QuotedLiteral.new
    r = array_encoder.encode(ruby_array.map {|v| literal_encoder.encode(v)})
    r.sub('{','(').sub('}', ')')
  end


  private



  def school_params
    params.permit(:school_id_or_type, :prefix, :lat, :lng, :limit, :radius)
  end
end
