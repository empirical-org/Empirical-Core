class Cms::StandardCategoriesController < Cms::CmsController
  before_action :set_standard_category, only: [:show, :edit, :update, :destroy]

  def index
    @standard_categories = StandardCategory.all
  end

  def show
  end

  def new
  end

  def edit
  end

  def create
    StandardCategory.create(standard_category_params)
    redirect_to cms_standard_categories_url
  end

  def update
    if @standard_category.update_attributes(standard_category_params)
      redirect_to cms_standard_categories_url, notice: "Standard Category was successfully created"
    else
      render action: 'edit'
    end
  end

  def destroy
    @standard_category.destroy
    head :ok
  end

  private

  def set_standard_category
    @standard_category = StandardCategory.find(params[:id])
  end

  def standard_category_params
    params.require(:standard_category).permit(:name)
  end
end
