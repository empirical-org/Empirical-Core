class Cms::StandardsController < Cms::CmsController
  before_action :set_standard, only: [:show, :edit, :update, :destroy]

  def index
    @standards = Standard.includes(:standard_level).order('standard_levels.name ASC')
  end

  def show
  end

  def new
    @standard = Standard.new
  end

  def edit
  end

  def create
    @standard = Standard.new(standard_params)

    if @standard.save
      redirect_to cms_standards_url, notice: 'Standard was successfully created.'
    else
      render action: 'new'
    end
  end

  def update
    if @standard.update(standard_params)
      redirect_to cms_standards_url, notice: 'Standard was successfully updated.'
    else
      render action: 'edit'
    end
  end

  def destroy
    @standard.destroy
    redirect_to cms_standards_url, notice: 'Standard was successfully deleted.'
  end

  private

  def set_standard
    @standard = Standard.find(params[:id])
  end

  def standard_params
    params.require(:standard).permit(:name, :standard_level_id, :standard_category_id)
  end
end
