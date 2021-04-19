class Cms::AuthorsController < Cms::CmsController
  def index
    @authors = Author.all
    respond_to do |format|
      format.html
      format.json do
        render json: @authors
      end
    end
  end

  def new
    @author = Author.new
  end

  def create
    @author = Author.new(author_params)
    if @author.save
      flash[:success] = 'Created successfully!'
      redirect_to cms_authors_path
    else
      flash[:error] = 'Something went wrong.'
      render :new
    end
  end

  def edit
    @author = Author.find(params[:id])
  end

  def update
    author = Author.find(params[:id])
    author.assign_attributes(author_params)
    if author.save
      flash[:success] = 'Updated successfully!'
      redirect_to cms_authors_path
    else
      flash[:error] = 'Something went wrong.'
      @author = Author.find(params[:id])
      render :edit
    end
  end

  private def author_params
    params.require(:author).permit(:id, :name, :avatar, default_params)
  end
end
