# frozen_string_literal: true

class SchoolsController < ApplicationController
  before_action :require_user, only: [:select_school]

  include CheckboxCallback
  MIN_PREFIX_LENGHT_WHEN_LAT_LON_NOT_PRESENT = 4

  # rubocop:disable Metrics/CyclomaticComplexity
  def index
    @radius = params[:radius].presence || 5
    @lat = params[:lat]
    @lng = params[:lng]
    @search = params[:search]
    @prefix,@zipcode = get_prefix_and_zipcode(@search)
    @limit = @prefix || @zipcode ? nil : params[:limit].presence || 10
    @schools = []

    school_ids = []
    if @lat.present? and @lng.present?
      stored_school_ids = $redis.get("LAT_LNG_RADIUS_TO_SCHOOL_#{@lat}_#{@lng}_#{@radius}")
      school_ids = stored_school_ids ? JSON.parse(stored_school_ids) : nil
    elsif @zipcode.present?
      stored_school_ids = $redis.get("ZIPCODE_RADIUS_TO_SCHOOL_#{@zipcode}_#{@radius}")
      school_ids = stored_school_ids ? JSON.parse(stored_school_ids) : nil
    else
      stored_school_ids = $redis.get("PREFIX_TO_SCHOOL_#{@prefix}")
      school_ids = stored_school_ids ? JSON.parse(stored_school_ids) : nil
      @schools = School.select("schools.id, name, zipcode, mail_zipcode, street, mail_street, city, mail_city, state, mail_state, COUNT(schools_users.id) AS number_of_teachers")
      .joins('LEFT JOIN schools_users ON schools_users.school_id = schools.id')
      .where(id: school_ids)
      .group("schools.id")
      .limit(@limit)
    end

    if @schools.empty? and school_ids.present?
      @schools = School.select("schools.id, name, zipcode, mail_zipcode, street, mail_street, city, mail_city, state, mail_state, COUNT(schools_users.id) AS number_of_teachers")
      .joins('LEFT JOIN schools_users ON schools_users.school_id = schools.id')
      .where(id: school_ids)
      .where(
        "lower(name) LIKE :prefix", prefix: "#{@prefix.downcase}%"
      ).group("schools.id")
      .limit(@limit)
    end

    if ((@lat.present? and @lng.present?) or @zipcode.present?) and @schools.empty?
      zip_arr = []
      cache_id = "LAT_LNG"
      if @zipcode.present?
        zip_arr << @zipcode
        cache_id = "ZIPCODE"
      else
        zip_arr += ZipcodeInfo.isinradius([@lat.to_f, @lng.to_f], @radius.to_i).map {|z| z.zipcode}
      end

      if zip_arr.present?
        @schools = School.select("schools.id, name, zipcode, mail_zipcode, street, mail_street, city, mail_city, state, mail_state, COUNT(schools_users.id) AS number_of_teachers")
        .joins('LEFT JOIN schools_users ON schools_users.school_id = schools.id')
        .where(
          "zipcode in #{array_to_postgres_array_helper(zip_arr)} OR mail_zipcode in #{array_to_postgres_array_helper(zip_arr)}"
         ).where(
         "lower(name) LIKE :prefix", prefix: "%#{@prefix.downcase}%"
         ).group("schools.id")
         .limit(@limit)
        $redis.set("#{cache_id}_RADIUS_TO_SCHOOL_#{@lat}_#{@lng}_#{@radius}", @schools.map {|s| s.id}.to_json)
         # short cache, highly specific
        $redis.expire("#{cache_id}_RADIUS_TO_SCHOOL_#{@lat}_#{@lng}_#{@radius}", 60*5)
      end
    end

    if @schools.empty? and @prefix.length < MIN_PREFIX_LENGHT_WHEN_LAT_LON_NOT_PRESENT
      @schools = []
    elsif @schools.empty?
      @schools = School.select("schools.id, name, zipcode, mail_zipcode, street, mail_street, city, mail_city, state, mail_state, COUNT(schools_users.id) AS number_of_teachers")
      .joins('LEFT JOIN schools_users ON schools_users.school_id = schools.id')
      .where(
         "lower(name) LIKE :prefix", prefix: "#{@prefix.downcase}%"
       ).group("schools.id")
       .limit(@limit)
      $redis.set("PREFIX_TO_SCHOOL_#{@prefix}", @schools.map {|s| s.id}.to_json)
      # longer cache, more general
      $redis.expire("PREFIX_TO_SCHOOL_#{@prefix}", 60*60)
    end

  end
  # rubocop:enable Metrics/CyclomaticComplexity

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
        school_user.school_id = school.id
        school_user.save
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

  private def get_prefix_and_zipcode(search)
    prefix = ''
    zipcode = nil
    if search.present?
      zipcode = search.match(/\d{5}/).to_s
      prefix = search.gsub(/\d{5}/, "").strip()
    end
    unless zipcode.present?
      zipcode = nil
    end
    [prefix, zipcode]
  end

  private def school_params
    params.permit(:school_id_or_type, :prefix, :lat, :lng, :limit, :radius, :authenticity_token, :school => {})
  end
end
