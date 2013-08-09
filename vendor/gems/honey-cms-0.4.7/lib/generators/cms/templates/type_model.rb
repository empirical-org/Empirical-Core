class CMS::<%= @name %> < ActiveRecord::Base
  self.table_name = '<%= @name.collection %>'
<% @type.attributes.select {|attr| attr.reference? }.each do |attribute| -%>
  belongs_to :<%= attribute.name %>, class_name: 'CMS::<%= attribute.reference_to %>'
<% end -%>
<% if @type.references.any? -%>
<% @type.references.each do |type| -%>
  has_many :<%= type.model_name.collection %>, class_name: 'CMS::<%= type %>'
<% end -%>
<% end -%>

<% if @type.orderable? -%>
  include CMS::Orderable
  orderable(:<%= @type.order_attribute.name %><%= @type.order_options %>)
<% end -%>
<% @type.file_attributes.each do |attribute| -%>
  mount_uploader :<%= attribute.name %>, CMS::Uploader
<% end -%>

  belongs_to :author, class_name: 'User'

  def self.name
    '<%= @name %>'
  end
end
