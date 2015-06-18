class CMS::SectionsController < ApplicationController
  before_action :set_section, only: [:show, :edit, :update, :destroy]

  def index
    @sections = Section.all
  end

  def show
  end

  def new
    @section = Section.new
  end

  def edit
  end

  def create
    @section = Section.new(section_params)

    if @section.save
      redirect_to cms_sections_url, notice: 'Chapter level was successfully created.'
    else
      render action: 'new'
    end
  end

  def update
    if @section.update(section_params)
      redirect_to cms_sections_url, notice: 'Chapter level was successfully updated.'
    else
      render action: 'edit'
    end
  end

  def destroy
    @section.destroy
    head :ok
  end

private

  def set_section
    @section = Section.find(params[:id])
  end

  def section_params
    params.require(:section).permit(:name, :position)
  end
end
