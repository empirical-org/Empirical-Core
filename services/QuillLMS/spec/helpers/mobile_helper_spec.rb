# frozen_string_literal: true

require 'rails_helper'

describe MobileHelper do
  describe '#render_dash' do
    it 'should return dash element if is_mobile is false' do
      expect(helper.render_dash(false)).to eq '<div class="light-bar"></div>'
    end

    it 'should return nil if is_mobile is true' do
      expect(helper.render_dash(true)).to eq nil
    end
  end

  describe '#render_video_content' do
    it 'should return content if device and type arguments match' do
      expect(helper.render_video_content('mobile', 'mobile', 'www.test.com')).to eq(
    "<div class='video-section'>
      <video class='lazyload' data-src='www.test.com' autoplay loop playsinline muted/>
        <p>
          Video not supported
        </p>
      </video>
    </div>"
    )
    end

    it 'should return nil if device and type arguments do not match' do
      expect(helper.render_video_content('mobile', 'desktop', 'www.test.com')).to eq nil
    end
  end
end
