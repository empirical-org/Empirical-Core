# frozen_string_literal: true

class Api::V1::SharedCacheController < Api::ApiController
  before_action :set_custom_cache_key

  BASE_SHARED_CACHE_KEY = 'SHARED_CACHE'
  SHARED_CACHE_EXPIRY = 5.minutes

  def show
    cached_data = Rails.cache.read(cache_key)
    if !cached_data
      return not_found
    end

    render(json: cached_data)
  end

  def update
    data = params[:data]
    Rails.cache.write(cache_key, data.to_json, expires_in: SHARED_CACHE_EXPIRY)
    render(json: data)
  end

  def destroy
    Rails.cache.delete(cache_key)
    render(plain: 'OK')
  end

  private def set_custom_cache_key
    @custom_cache_key = params[:id]
  end

  private def cache_key
    "#{BASE_SHARED_CACHE_KEY}_#{@custom_cache_key}"
  end
end
