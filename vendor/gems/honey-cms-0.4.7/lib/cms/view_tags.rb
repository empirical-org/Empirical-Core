class CMS::ViewTags
  attr_accessor :context, :controller
  delegate :current_user, :config, to: :context

  include Singleton
  include ApplicationHelper
  include ActionView::Helpers::TextHelper
  include ActionView::Helpers::UrlHelper
  include ActionView::Helpers::AssetTagHelper
  include ApplicationHelper
  include CMS::Helper
  include Rails.application.routes.url_helpers

  def setup opts
    @context = @controller = opts[:context]
  end

  def parse content, opts = {}
    setup(opts)
    # content.gsub(/\xA0/u, ' ')
    content.gsub(/\{\{image [^}}]+\}\}/) do |tag|
      str, name, size = tag.match(/\{\{image (\w+) (\w+)\}\}/).to_a
      cms_image(name, size)
    end.html_safe
  end
end
