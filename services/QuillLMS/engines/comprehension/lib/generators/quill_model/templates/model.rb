<% module_namespacing do -%>
class <%= class_name %> < ActiveRecord::Base
  # FIXME, add relationships

  # FIXME, add validations

  # FIXME, fill in attributes for json
  def serializable_hash(options = nil)
    options ||= {}

    super(options.reverse_merge(
      only: [],
      include: [],
      methods: []
    ))
  end
end
<% end -%>
