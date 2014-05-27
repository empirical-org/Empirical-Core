unless Rails.env.test?
  aws_credentials = AWS::Core::CredentialProviders::ENVProvider.new('AWS')

  CarrierWave.configure do |config|
    config.cache_dir = "#{Rails.root}/tmp/"
    config.storage = :fog
    config.permissions = 0666

    config.fog_credentials = {
      provider:              'AWS',
      aws_access_key_id:     aws_credentials.access_key_id,
      aws_secret_access_key: aws_credentials.secret_access_key,
    }

    config.fog_directory = 'empirical-grammar-production'
  end
end
