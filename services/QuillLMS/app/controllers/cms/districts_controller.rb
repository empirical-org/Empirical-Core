# frozen_string_literal: true

class Cms::DistrictsController < Cms::CmsController

  before_action :text_search_inputs, only: [:index, :search]
  before_action :set_district, only: [
    :show
  ]

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
    number_of_pages = (district_search_query_results.count / DISTRICTS_PER_PAGE).ceil
    render json: {numberOfPages: number_of_pages, districtSearchQueryResults: district_search_query_results}
  end

  def show
    @school_data = school_query
    @admins = DistrictAdmin.includes(:user).where(district_id: params[:id].to_i)
  end

  def new_admin
    @district = District.find(params[:id])
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
    page = [district_query_params[:page].to_i - 1, 0].max
    result = District.distinct.limit(DISTRICTS_PER_PAGE).offset(DISTRICTS_PER_PAGE * page)

    sort = district_query_params[:sort]
    sort_direction = district_query_params[:sort_direction]
    if sort && sort_direction && sort != 'undefined' && sort_direction != 'undefined'
      result = result.order("#{sort} #{sort_direction}")
    else
      result = result.order("total_students DESC")
    end

    result = add_where_conditions(result).select(:id, :name, :city, :state, :zipcode, :phone, :total_students, :total_schools, :nces_id)
    # then write `add_where_conditions` function that just does `result = result.where(...)` for each condition you already have logic for
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

  private def edit_or_add_district_params
    params.require(:district).permit(:id, editable_district_attributes.values)
  end

  private def school_query
    @district.schools.select('schools.name, schools.id, subscriptions.account_type, count(schools_users.id) as number_teachers, count(schools_admins.id) as number_admins')
      .joins(:schools_users)
      .joins(:schools_admins)
      .joins(school_subscription: :subscription)
      .where('subscriptions.expiration > ? AND subscriptions.start_date <= ?', Date.today, Date.today)
      .group('schools.name, schools.id, subscriptions.account_type')
  end

end
