# frozen_string_literal: true

class Cms::DistrictsController < Cms::CmsController
  before_action :signed_in!

  before_action :text_search_inputs, only: [:index, :search]
  before_action :set_district, only: [
    :new_subscription,
    :edit_subscription,
    :show,
    :complete_sales_stage,
  ]

  DISTRICTS_PER_PAGE = 30.0

  # This allows staff members to view and search through districts.
  def index
    @district_search_query = {
      'search_districts_with_zero_teachers' => true
    }
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

  # # This allows staff members to drill down on a specific district, including
  # # viewing an index of teachers at this district.
  # # rubocop:disable Metrics/CyclomaticComplexity
  # def show
  #   @subscription = @district&.subscription
  #   @district_subscription_info = {
  #     'district Premium Type' => @district&.subscription&.account_type,
  #     'Expiration' => @district&.subscription&.expiration&.strftime('%b %d, %Y')
  #   }
  #   @district = {
  #     'Name' => @district.name,
  #     'City' => @district.city || @district.mail_city,
  #     'State' => @district.state || @district.mail_state,
  #     'ZIP' => @district.zipcode || @district.mail_zipcode,
  #     'District' => @district.leanm,
  #     'Free and Reduced Price Lunch' => "#{@district.free_lunches}%",
  #     'NCES ID' => @district.nces_id,
  #     'PPIN' => @district.ppin,
  #     'Clever ID' => @district.clever_id
  #   }
  #   @teacher_data = teacher_search_query_for_district(params[:id])
  #   @admins = districtsAdmins.includes(:user).where(district_id: params[:id].to_i).map do |admin|
  #     {
  #       name: admin.user.name,
  #       email: admin.user.email,
  #       district_id: admin.district_id,
  #       user_id: admin.user_id
  #     }
  #   end
  # end
  # # rubocop:enable Metrics/CyclomaticComplexity

  # # This allows staff members to edit certain details about a district.
  # def edit
  #   @district = district.find(params[:id])
  #   @editable_attributes = editable_district_attributes
  # end

  # def update
  #   if district.find(edit_or_add_district_params[:id]).update(edit_or_add_district_params)
  #     redirect_to cms_district_path(edit_or_add_district_params[:id])
  #   else
  #     render :edit
  #   end
  # end

  # def edit_subscription
  #   @subscription = @district&.subscription
  # end

  # def new_subscription
  #   @subscription = Subscription.new(start_date: Subscription.redemption_start_date(@district), expiration: Subscription.default_expiration_date(@district))
  # end

  # # This allows staff members to create a new district.
  # def new
  #   @district = district.new
  #   @editable_attributes = editable_district_attributes
  # end

  # def create
  #   new_district = district.new(edit_or_add_district_params)
  #   if new_district.save
  #     redirect_to cms_district_path(new_district.id)
  #   else
  #     render :new
  #   end
  # end

  # def new_admin
  #   @district = district.find(params[:id])
  # end

  # def add_existing_user
  #   @district = district.find(params[:id])
  # end

  # def add_admin_by_email
  #   begin
  #     user = User.find_by(email: params[:email_address])
  #     district = district.find(params[:id])
  #     districtsAdmins.create(user_id: user.id, district_id: district.id)
  #     flash[:success] = "Yay! It worked! 🎉"
  #     redirect_to cms_district_path(params[:id])
  #   rescue
  #     flash[:error] = "It didn't work! 😭😭😭"
  #     redirect_back(fallback_location: fallback_location)
  #   end
  # end

  # def add_existing_user_by_email
  #   begin
  #     user = User.find_by!(email: params[:email_address])
  #     raise ArgumentError if user.role != 'teacher'

  #     district = district.find_by!(id: params[:id])
  #     districtsUsers.where(user: user).destroy_all
  #     districtsUsers.create!(user_id: user.id, district_id: district.id)
  #     flash[:success] = "Yay! It worked! 🎉"
  #     redirect_to cms_district_path(params[:id])
  #   rescue ActiveRecord::RecordNotFound
  #     flash[:error] = "It didn't work! Make sure the email you typed is correct."
  #     redirect_back(fallback_location: fallback_location)
  #   rescue ArgumentError
  #     flash[:error] = "It didn't work! Make sure the account you entered belogs to a teacher, not staff or student."
  #     redirect_back(fallback_location: fallback_location)
  #   rescue
  #     flash[:error] = "It didn't work. See a developer about this issue."
  #     redirect_back(fallback_location: fallback_location)
  #   end
  # end

  # def unlink
  #   begin
  #     teacher = User.find(params[:teacher_id])
  #     if teacher.unlink
  #       flash[:success] = "Yay! It worked! 🎉"
  #     else
  #       flash[:error] = "It didn't work. See a developer about this issue."
  #     end
  #     redirect_back(fallback_location: fallback_location)
  #   rescue
  #     flash[:error] = "It didn't work. Make sure the teacher still exists and belongs to this district."
  #   end
  # end

  private def set_district
    @district = district.find params[:id]
  end

  private def text_search_inputs
    # These are the text input fields, but they are not all of the fields in the form.
    @text_search_inputs = ['district_name', 'district_city', 'district_state', 'district_zip', 'district_name', 'nces_id']
  end

  private def all_search_inputs
    @text_search_inputs.map(&:to_sym) + [:sort, :sort_direction, :page, :search_districts_with_zero_teachers, :premium_status]
  end

  private def district_query_params
    params.permit(default_params + all_search_inputs)
  end

  private def district_query(params)
    # This should return an array of hashes that look like this:
    # [
    #   {
    #     district_name: 'district name',
    #     district_name: 'district name',
    #     district_city: 'district city',
    #     district_state: 'district state',
    #     district_zip: Number(district zip),
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
          districts.name AS district_name,
          districts.city AS district_city,
          districts.state AS district_state,
          districts.zipcode AS district_zip,
          districts.total_students AS total_students,
          districts.total_schools AS total_schools,
          districts.nces_id AS nces_id,
          districts.id AS id
        FROM districts
        #{where_query_string_builder}
        GROUP BY
          districts.name,
          districts.nces_id,
          districts.city,
          districts.state,
          districts.zipcode,
          districts.total_students,
          districts.total_schools,
          districts.id
        #{having_string}
        #{order_by_query_string}
        #{pagination_query_string}
      SQL
    ).to_a
  end

  private def having_string
    # We have to use HAVING here instead of including this in the WHERE query
    # builder because we're doing an aggregation here. This will merely filter
    # the results at the end.
    return if district_query_params[:search_districts_with_zero_teachers].present? && district_query_params[:search_districts_with_zero_teachers] != 'false'

    'HAVING COUNT(total_students.*) != 0'
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
    # Potential params by which to search:
    # district name: districts.name
    # district city: districts.city or districts.mail_city
    # district state: districts.state or districts.mail_state
    # district zip: districts.zipcode or districts.mail_zipcode
    # District name: districts.leanm
    # Premium status: subscriptions.account_type
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
          #{having_string}
        ) AS subquery
      SQL
    )

    result.to_a[0]['count'].to_i
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

  private def edit_or_add_district_params
    params.require(:district).permit(:id, editable_district_attributes.values)
  end

  private def editable_district_attributes
    {
      'district Name' => :name,
      'district City' => :city,
      'district State' => :state,
      'district ZIP' => :zipcode,
      'District Name' => :leanm,
      'FRP Lunch' => :free_lunches,
      'NCES ID' => :nces_id,
      'Clever ID' => :clever_id
    }
  end

  private def subscription_params
    params.permit([:id, :premium_status, :expiration_date => [:day, :month, :year]] + default_params)
  end

  private def teacher_search_query_for_district(district_id)
    Cms::TeacherSearchQuery.new(district_id).run
  end

  def fallback_location
    cms_district_path(params[:id].to_i)
  end
end
