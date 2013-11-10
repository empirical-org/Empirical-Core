class CMS::ChapterLevelsController < ApplicationController
  before_action :set_chapter_level, only: [:show, :edit, :update, :destroy]

  def index
    @chapter_levels = ChapterLevel.all
  end

  def show
  end

  def new
    @chapter_level = ChapterLevel.new
  end

  def edit
  end

  def create
    @chapter_level = ChapterLevel.new(chapter_level_params)

    if @chapter_level.save
      redirect_to cms_chapter_levels_url, notice: 'Chapter level was successfully created.'
    else
      render action: 'new'
    end
  end

  def update
    if @chapter_level.update(chapter_level_params)
      redirect_to cms_chapter_levels_url, notice: 'Chapter level was successfully updated.'
    else
      render action: 'edit'
    end
  end

  def destroy
    @chapter_level.destroy
    head :ok
  end

private

  def set_chapter_level
    @chapter_level = ChapterLevel.find(params[:id])
  end

  def chapter_level_params
    params.require(:chapter_level).permit(:name, :position)
  end
end
