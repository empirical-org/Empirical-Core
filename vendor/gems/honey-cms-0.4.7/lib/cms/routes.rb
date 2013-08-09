class CMS::Routes < SimpleDelegator
  def draw
    namespace :cms do
      get 'description' => 'root#description'
      get '' => 'root#index'

      CMS::Configuration.types.each do |type|
        resources type.model_name.route_key
      end

      yield if block_given?
    end

    CMS::Configuration.pages.each do |page|
      if page.editable?
        get page.route => 'cms/pages#show', page: page.action, as: "cms_#{page.action}"
      else
        get page.route => 'cms/pages#static_page', page: page.action, as: "cms_#{page.action}"
      end
    end
  end
end
