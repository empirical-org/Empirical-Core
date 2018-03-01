class Cms::ImagesController < ApplicationController
  # mount_uploader :image, ImageUploader

  def save_image
    i = Image.new
    file = params[:file].gsub("\u0000", '')
    i.file.store!(file)
    i.save!
    render json: {url: i.file.url}
    # stored_image = image.store!(params[:file])
    # binding.pry
    # render json: {}
    # params[:id] = params[:activity_id]
    # @activity = subject
  end
end
