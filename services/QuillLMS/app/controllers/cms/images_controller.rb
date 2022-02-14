# frozen_string_literal: true

class Cms::ImagesController < Cms::CmsController

  def index
    @images = Image.all
  end

  def create
    i = Image.new
    file = params[:file]
    split_filename = file.original_filename.split(/(.*)\.([^.]*)$/)
    file.original_filename = "#{split_filename[1]}_#{Image.last.id + 1}.#{split_filename[2]}"
    i.file.store!(file)
    i.file = file
    i.save!
    render json: {url: i.file.url}
  end

  def destroy
    image = Image.find(params["id"])
    if image
      hosted_image = directory.files.get(image.file.path)
      hosted_image.destroy if hosted_image
      image.destroy
    end
    redirect_to action: "index"
  end

  def update
  end

  private def directory
    credentials = {
      provider: 'AWS',
      aws_access_key_id: ENV['AWS_UPLOADS_ACCESS_KEY_ID'],
      aws_secret_access_key: ENV['AWS_UPLOADS_SECRET_ACCESS_KEY']
    }
    connection = Fog::Storage.new(credentials)
    connection.directories.get(ENV['FOG_UPLOADS_DIRECTORY'])
  end
end
