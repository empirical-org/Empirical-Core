class CMS::PageArea < ActiveRecord::Base
  self.table_name = 'page_areas'

  def self.name
    'PageArea'
  end
end
