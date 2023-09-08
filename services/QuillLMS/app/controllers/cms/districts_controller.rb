# frozen_string_literal: true

class Cms::DistrictsController < Cms::CmsController
  before_action :text_search_inputs, only: [:index, :search]
  before_action :set_district, only: [:edit, :new_admin, :show, :new_subscription, :edit_subscription]
  before_action :subscription_data, only: [:new_subscription, :edit_subscription]

  DISTRICTS_PER_PAGE = 30
  PREMIUM_STATUS_SORT = 'premium_status'

  def index
    @district_search_query = {}
    @district_search_query_results = []
    @number_of_pages = 0
  end

  def search
    district_search_query = district_query_params
    district_search_query_results = district_query(district_query_params)
    district_search_query_results ||= []
    number_of_pages = (district_search_query_results.size / DISTRICTS_PER_PAGE.to_f).ceil
    render json: {numberOfPages: number_of_pages, districtSearchQueryResults: district_search_query_results}
  end

  def show
    @subscription = @district&.subscription
    @school_data = school_query
    @admins = DistrictAdmin.includes(:user).where(district_id: params[:id].to_i)
    @district_subscription_info = {
      'District Premium Type' => @district&.subscription&.account_type,
      'Expiration' => @district&.subscription&.expiration&.strftime('%b %d, %Y')
    }
  end

  def new
    @district = District.new
    @editable_attributes = editable_district_attributes
  end

  def new_admin
    id = params[:id]
    @js_file = 'staff'
    @style_file = "#{ApplicationController::STAFF}.scss"
    @cms_district_path = cms_district_path(id)
  end

  def new_subscription
    @subscription = Subscription.new(
      account_type: Subscription::SCHOOL_DISTRICT_PAID,
      start_date: Subscription.redemption_start_date(@district),
      expiration: Subscription.default_expiration_date(@district)
    )
    @schools = Cms::DistrictSchoolsAndSubscriptionStatus.run(@district, @subscription)
  end

  def edit_subscription
    @subscription = @district&.subscription
    @schools = Cms::DistrictSchoolsAndSubscriptionStatus.run(@district, @subscription)
  end

  def create
    new_district = District.new(district_params)
    if new_district.save
      redirect_to cms_district_path(new_district)
    else
      redirect_to cms_districts_path, error: new_district.errors, flash: { error: new_district.errors.full_messages }
    end
  end

  def edit
    @editable_attributes = editable_district_attributes
  end

  def update
    district = District.find(district_params[:id])
    if district.update(district_params)
      redirect_to cms_district_path(params[:id])
    else
      redirect_to cms_district_path(district_params[:id]), error: district.errors
    end
  end

  private def set_district
    @district = District.find(params[:id])
  end

  private def text_search_inputs
    @text_search_inputs = ['district_name', 'district_city', 'district_state', 'district_zip', 'district_name', 'nces_id']
    @district_premium_types = Subscription::OFFICIAL_DISTRICT_TYPES
  end

  private def all_search_inputs
    @text_search_inputs.map(&:to_sym) + [:sort, :sort_direction, :page, :premium_status]
  end

  private def district_query_params
    params.permit(default_params + all_search_inputs)
  end

  private def district_query(params)
    page = [district_query_params[:page].to_i - 1, 0].max
    result = District.distinct.offset(DISTRICTS_PER_PAGE * page)

    sort = district_query_params[:sort]
    sort_direction = district_query_params[:sort_direction]
    if sort && sort_direction && sort != 'undefined' && sort_direction != 'undefined'
      if sort == PREMIUM_STATUS_SORT
        result = result.includes(:subscriptions).order("subscriptions.account_type #{sort_direction}")
      else
        result = result.order("#{sort} #{sort_direction}")
      end
    else
      result = result.order("total_students DESC")
    end

    result = add_where_conditions(result).includes(:subscriptions).select('subscriptions.account_type AS premium_status, districts.id, districts.name, districts.city, districts.state, districts.zipcode, districts.phone, districts.total_students, districts.total_schools, districts.nces_id').references(:subscriptions)
  end

  private def add_where_conditions(districts)
    districts = districts.by_name(district_query_params[:district_name]) if district_query_params[:district_name].present?
    districts = districts.by_city(district_query_params[:district_city]) if district_query_params[:district_city].present?
    districts = districts.by_state(district_query_params[:district_state]) if district_query_params[:district_state].present?
    districts = districts.by_zipcode(district_query_params[:district_zipcode]) if district_query_params[:district_zipcode].present?
    districts = districts.by_nces_id(district_query_params[:nces_id]) if district_query_params[:nces_id].present?
    districts = districts.by_premium_status(district_query_params[:premium_status]) if district_query_params[:premium_status].present?
    districts
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

  private def district_params
    params.require(:district).permit(:id, editable_district_attributes.values)
  end

  private def school_query
    @district
      .schools
      .select(
        'schools.name,
        schools.id,
        schools.city,
        schools.state,
        schools.free_lunches,
        subscriptions.account_type,
        count(distinct schools_users.id) as number_teachers,
        count(distinct schools_admins.id) as number_admins'
      )
      .left_joins(:schools_users)
      .left_joins(:schools_admins)
      .left_joins(school_subscriptions: :subscription)
      .where("subscriptions.de_activated_date IS NULL")
      .group('schools.name, schools.id, subscriptions.account_type')
  end

  private def subscription_data
    @premium_types = Subscription::OFFICIAL_DISTRICT_TYPES
    @subscription_payment_methods = Subscription::CMS_PAYMENT_METHODS
  end
end
