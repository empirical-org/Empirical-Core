class CMS::Uploader < CarrierWave::Uploader::Base
  def store_dir
    base = File.join('cms-uploads', model.class.model_name.collection.gsub('_', '-'), model.id.try(:to_s))
    base = File.join('uploads', base) if storage.is_a? CarrierWave::Storage::File
    base
  end
end
