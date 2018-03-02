class Cms::ImagesController < ApplicationController

  def save_image
    i = Image.new
    file = params[:file]
    i.file.store!(file)
    i.file = file
    i.save!
    render json: {url: i.file.url}
  end
end
