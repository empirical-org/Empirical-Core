class Cms::ImagesController < Cms::CmsController
  include HTTParty

  def index
    # list_bucket_result = HTTParty.get('http://s3.amazonaws.com/quill-image-uploads/')
    # keys = list_bucket_result.parsed_response['ListBucketResult']['Contents'].map {|c| c['Key']}
    @images = Image.all
  end

  def save_image
    i = Image.new
    file = params[:file]
    i.file.store!(file)
    i.file = file
    i.save!
    render json: {url: i.file.url}
  end
end
