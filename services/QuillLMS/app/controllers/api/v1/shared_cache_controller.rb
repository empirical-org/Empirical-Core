# frozen_string_literal: true

class Api::V1::SharedCacheController < Api::ApiController
  before_action :set_custom_cache_key

  BASE_SHARED_CACHE_KEY = 'SHARED_CACHE'
  SHARED_CACHE_EXPIRY = 300

  def show
    cached_data = $redis.get(cache_key)
    if !cached_data
      return not_found
    end

    render(json: cached_data)
  end

  def update
    data = params[:data]
    $redis.set(cache_key, data.to_json, {ex: SHARED_CACHE_EXPIRY})
    render(json: data)
  end

  def destroy
    $redis.del(cache_key)
    render(plain: 'OK')
  end

  private def set_custom_cache_key
    @custom_cache_key = params[:id]
  end

  private def cache_key
    "#{BASE_SHARED_CACHE_KEY}_#{@custom_cache_key}"
  end
end
