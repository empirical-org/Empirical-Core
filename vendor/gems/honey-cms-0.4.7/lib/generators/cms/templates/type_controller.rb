class CMS::<%= @name.to_s.pluralize %>Controller < CMS::BaseController
  helper_method :subject

  protected

  def subject
    CMS::<%= @name %>
  end

  def <%= @name.singular %>_params
    params.require(:<%= @name.singular %>).permit(<%= @type.accessible_attributes.map {|a| ":#{a.field_name}" }.sort.join(', ') %>)
  end
  alias :subject_params :<%= @name.singular %>_params
end
