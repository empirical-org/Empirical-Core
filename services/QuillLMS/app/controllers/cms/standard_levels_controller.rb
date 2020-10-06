class Cms::StandardLevelsController < Cms::CmsController
  before_action :set_standard_level, only: [:show, :edit, :update, :destroy]

  def index
    @standard_levels = StandardLevel.all
  end

  def show
  end

  def new
    @standard_level = StandardLevel.new
  end

  def edit
  end

  def create
    @standard_level = StandardLevel.new(standard_level_params)

    if @standard_level.save
      redirect_to cms_standard_levels_url, notice: 'Chapter level was successfully created.'
    else
      render action: 'new'
    end
  end

  def update
    if @standard_level.update(standard_level_params)
      redirect_to cms_standard_levels_url, notice: 'Chapter level was successfully updated.'
    else
      render action: 'edit'
    end
  end

  def destroy
    @standard_level.destroy
    head :ok
  end

  private

  def set_standard_level
    @standard_level = StandardLevel.find(params[:id])
  end

  def standard_level_params
    params.require(:standard_level).permit(:name, :position)
  end
end
