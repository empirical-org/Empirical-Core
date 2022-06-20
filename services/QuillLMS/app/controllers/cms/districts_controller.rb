# frozen_string_literal: true

class Cms::DistrictsController < Cms::CmsController
  before_action :text_search_inputs, only: [:index, :search]
  before_action :set_district, only: [:edit, :new_admin, :show, :new_subscription, :edit_subscription]
  before_action :subscription_data, only: [:new_subscription, :edit_subscription]

  DISTRICTS_PER_PAGE = 30

  def index
    @district_search_query = {}
    @district_search_query_results = []
    @number_of_pages = 0
  end

  def search
    district_search_query = district_query_params
    district_search_query_results = district_query(district_query_params)
    district_search_query_results ||= []
    number_of_pages = (district_search_query_results.count / DISTRICTS_PER_PAGE.to_f).ceil
    render json: {numberOfPages: number_of_pages, districtSearchQueryResults: district_search_query_results}
  end

  def show
    @subscription = @district&.subscription
    @school_data = school_query
    @admins = DistrictAdmin.includes(:user).where(district_id: params[:id].to_i)
  end

  def new
    @district = District.new
    @editable_attributes = editable_district_attributes
  end

  def new_subscription
    @subscription = Subscription.new(
      account_type: Subscription::SCHOOL_DISTRICT_PAID,
      start_date: Subscription.redemption_start_date(@district),
      expiration: Subscription.default_expiration_date(@district)
    )
    @schools = DistrictSchoolsAndSubscriptionStatus.run(@district, @subscription)
  end

  def edit_subscription
    @subscription = @district&.subscription
    @schools = DistrictSchoolsAndSubscriptionStatus.run(@district, @subscription)
  end

  def create
    new_district = District.new(district_params)
    if new_district.save
      redirect_to cms_district_path(new_district)
    else
      redirect_to cms_districts_path, error: new_district.errors, flash: { error: new_district.errors }
    end
  end

  def new_admin; end

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
      result = result.order("#{sort} #{sort_direction}")
    else
      result = result.order("total_students DESC")
    end

    result = add_where_conditions(result).select(:id, :name, :city, :state, :zipcode, :phone, :total_students, :total_schools, :nces_id)
  end

  private def add_where_conditions(districts)
    districts = districts.by_name(district_query_params[:district_name]) if district_query_params[:district_name].present?
    districts = districts.by_city(district_query_params[:district_city]) if district_query_params[:district_city].present?
    districts = districts.by_state(district_query_params[:district_state]) if district_query_params[:district_state].present?
    districts = districts.by_zipcode(district_query_params[:district_zipcode]) if district_query_params[:district_zipcode].present?
    districts = districts.by_nces_id(district_query_params[:nces_id]) if district_query_params[:nces_id].present?
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
      .group('schools.name, schools.id, subscriptions.account_type')
  end

  private def subscription_data
    @premium_types = Subscription::OFFICIAL_DISTRICT_TYPES
    @subscription_payment_methods = Subscription::CMS_PAYMENT_METHODS
  end
end
