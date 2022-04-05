# frozen_string_literal: true

class Cms::DistrictsController < Cms::CmsController
  before_action :signed_in!

  before_action :text_search_inputs, only: [:index, :search]
  before_action :set_district, only: [
    :show
  ]

  DISTRICTS_PER_PAGE = 30.0

  def index
    @district_search_query = {}
    @district_search_query_results = []
    @number_of_pages = 0
  end

  def search
    district_search_query = district_query_params
    district_search_query_results = district_query(district_query_params)
    district_search_query_results ||= []
    number_of_pages = (number_of_districts_matched / DISTRICTS_PER_PAGE).ceil
    render json: {numberOfPages: number_of_pages, districtSearchQueryResults: district_search_query_results}
  end

  def show
    @district = {
      'Name' => @district.name,
      'City' => @district.city,
      'State' => @district.state,
      'ZIP' => @district.zipcode,
      'Clever ID' => @district.clever_id,
      'NCES ID' => @district.nces_id,
      'Phone' => @district.phone,
      'Total Students' => @district.total_students,
      'Total Schools' => @district.total_schools,
      'Grade Range' => @district.grade_range,
      'Total Invoice Amount' => @district.total_invoice
    }
    @school_data = school_query
    @admins = DistrictsAdmins.includes(:user).where(district_id: params[:id].to_i).map do |admin|
      {
        name: admin.user.name,
        email: admin.user.email,
        district_id: admin.district_id,
        user_id: admin.user_id
      }
    end
  end

  def new_admin
    @district = District.find(params[:id])
  end

  def add_admin_by_email
    begin
      user = User.find_by(email: params[:email_address])
      district = District.find(params[:id])
      DistrictsAdmins.create(user_id: user.id, district_id: district.id)
      flash[:success] = "Yay! It worked! 🎉"
      redirect_to cms_district_path(params[:id])
    rescue
      flash[:error] = "It didn't work! 😭😭😭"
      redirect_back(fallback_location: fallback_location)
    end
  end

  def remove_admin
    admin = DistrictsAdmins.find_by(user_id: params[:user_id], district_id: params[:district_id])
    flash[:error] = 'Something went wrong.' unless admin.destroy
    flash[:success] = 'Success! 🎉'
    redirect_back(fallback_location: cms_district_path)
  end

  def edit
    @district = District.find(params[:id])
    @editable_attributes = editable_district_attributes
  end

  def update
    if District.find(edit_or_add_district_params[:id]).update(edit_or_add_district_params)
      redirect_to cms_district_path(edit_or_add_district_params[:id])
    else
      render :edit
    end
  end

  private def set_district
    @district = District.find params[:id]
  end

  private def text_search_inputs
    @text_search_inputs = ['district_name', 'district_city', 'district_state', 'district_zip', 'district_name', 'nces_id']
  end

  private def all_search_inputs
    @text_search_inputs.map(&:to_sym) + [:sort, :sort_direction, :page, :premium_status]
  end

  private def district_query_params
    params.permit(default_params + all_search_inputs)
  end

  private def district_query(params)
    RawSqlRunner.execute(
      <<-SQL
        SELECT
          districts.name AS district_name,
          districts.city AS district_city,
          districts.state AS district_state,
          districts.zipcode AS district_zip,
          districts.total_students AS total_students,
          districts.total_schools AS total_schools,
          districts.nces_id AS nces_id,
          districts.id AS id,
          districts.phone AS phone
        FROM districts
        #{where_query_string_builder}
        GROUP BY
          districts.name,
          districts.nces_id,
          districts.phone,
          districts.city,
          districts.state,
          districts.zipcode,
          districts.total_students,
          districts.total_schools,
          districts.id
        #{order_by_query_string}
        #{pagination_query_string}
      SQL
    ).to_a
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def where_query_string_builder
    conditions = []
    # This converts all of the search inputs into strings so we can iterate
    # over them and grab the value from params. The weird ternary here is in
    # case we have arrays as inputs (e.g. the 'premium_status' field).
    all_search_inputs.map{|i| i.instance_of?(Symbol) ? i.to_s : i.keys[0].to_s}.each do |param|
      param_value = district_query_params[param]
      if param_value && !param_value.empty?
        conditions << where_query_string_clause_for(param, param_value)
      end
    end
    conditions = conditions.reject(&:nil?)
    "WHERE #{conditions.join(' AND ')}" unless conditions.empty?
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def where_query_string_clause_for(param, param_value)
    sanitized_fuzzy_param_value = ActiveRecord::Base.connection.quote("%#{param_value}%")
    sanitized_param_value = ActiveRecord::Base.connection.quote(param_value)

    case param
    when 'district_name'
      "districts.name ILIKE #{sanitized_fuzzy_param_value}"
    when 'district_city'
      "districts.city ILIKE #{sanitized_fuzzy_param_value}"
    when 'district_state'
      "(UPPER(districts.state) = UPPER(#{sanitized_param_value}))"
    when 'district_zip'
      "(districts.zipcode = #{sanitized_param_value})"
    when 'nces_id'
      "districts.nces_id = #{sanitized_param_value}"
    else
      nil
    end
  end

  private def pagination_query_string
    page = [district_query_params[:page].to_i - 1, 0].max
    "LIMIT #{DISTRICTS_PER_PAGE} OFFSET #{DISTRICTS_PER_PAGE * page}"
  end

  private def number_of_districts_matched
    result = RawSqlRunner.execute(
      <<-SQL
        SELECT COUNT(*) as count
        FROM (
          SELECT COUNT(districts.id) AS count
          FROM districts
          #{where_query_string_builder}
          GROUP BY districts.id
        ) AS subquery
      SQL
    )

    result.to_a[0]['count'].to_i
  end

  private def editable_district_attributes
    {
      'District Name' => :name,
      'District City' => :city,
      'District State' => :state,
      'District ZIP' => :zipcode,
      'District Phone' => :phone,
      'NCES ID' => :nces_id,
      'Clever ID' => :clever_id,
      'Total Schools' => :total_schools,
      'Total Students' => :total_students,
      'Grade Range' => :grade_range
    }
  end

  private def edit_or_add_district_params
    params.require(:district).permit(:id, editable_district_attributes.values)
  end

  private def order_by_query_string
    sort = district_query_params[:sort]
    sort_direction = district_query_params[:sort_direction]
    if sort && sort_direction && sort != 'undefined' && sort_direction != 'undefined'
      "ORDER BY #{sort} #{sort_direction}"
    else
      "ORDER BY total_students DESC"
    end
  end


  private def school_query
    # This should return an array of hashes that look like this:
    # [
    #   {
    #     school_name: 'school name',
    #     district_name: 'district name',
    #     school_city: 'school city',
    #     school_state: 'school state',
    #     school_zip: Number(school zip),
    #     frl: Number(frl),
    #     number_teachers: Number(# of teachers),
    #     premium_status: 'premium status',
    #     number_admins: Number(# of admins),
    #     id: '#',
    #   }
    # ]

    # NOTE: IF YOU CHANGE THIS QUERY'S CONDITIONS, PLEASE BE SURE TO
    # ADJUST THE PAGINATION QUERY STRING AS WELL.
    RawSqlRunner.execute(
      <<-SQL
        SELECT
          schools.name AS school_name,
          COUNT(DISTINCT schools_users.id) AS number_teachers,
          subscriptions.account_type AS premium_status,
          COUNT(DISTINCT schools_admins.id) AS number_admins,
          schools.id AS school_id
        FROM schools
        LEFT JOIN schools_users
          ON schools_users.school_id = schools.id
        LEFT JOIN schools_admins
          ON schools_admins.school_id = schools.id
        LEFT JOIN school_subscriptions
          ON school_subscriptions.school_id = schools.id
        LEFT JOIN subscriptions
          ON subscriptions.id = school_subscriptions.subscription_id
        LEFT JOIN districts
          ON schools.district_id = districts.id
        WHERE districts.id = #{params[:id]}
        GROUP BY
          schools.name,
          subscriptions.account_type,
          schools.id
      SQL
    ).to_a
  end

end
