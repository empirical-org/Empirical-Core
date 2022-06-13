# frozen_string_literal: true

module MobileHelper
  def render_dash(is_mobile)
    return if is_mobile

    '<div class="light-bar"></div>'.html_safe
  end

  def render_video_content(device, type, url)
    return unless device == type

    "<div class='video-section'>
      <video class='lazyload' data-src='#{url}' autoplay loop playsinline muted/>
        <p>
          Video not supported
        </p>
      </video>
    </div>".html_safe
  end
end
