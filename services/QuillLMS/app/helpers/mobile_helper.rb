module MobileHelper
  def render_dash(is_mobile)
    if !is_mobile
      '<div class="light-bar"></div>'.html_safe
    end
  end

  def render_content(device, type, url)
    if device == type
      "<div class='video-section'>
        <video class='lazyload' data-src='#{url}' autoplay loop playsinline muted/>
          <p>
            Video not supported
          </p>
        </video>
      </div>".html_safe
    end
  end
end
