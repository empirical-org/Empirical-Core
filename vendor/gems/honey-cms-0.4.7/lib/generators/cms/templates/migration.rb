class <%= migration_class_name %> < ActiveRecord::Migration
  def change
<% @migration_types.each do |type| -%>
    create_table :<%= type.model_name.collection %> do |t|
<% type.attributes.each do |attribute| -%>
      t.<%= attribute.migration_type %> :<%= attribute.name %><%= attribute.inject_options %>
<% end -%>
      t.belongs_to :author
<% if type.options[:timestamps] -%>
      t.timestamps
<% end -%>
    end

<% type.attributes_with_index.each do |attribute| -%>
    add_index :<%= type.model_name.collection %>, :<%= attribute.index_name %><%= attribute.inject_index_options %>
<% end -%>
<% end -%>

  end
end
