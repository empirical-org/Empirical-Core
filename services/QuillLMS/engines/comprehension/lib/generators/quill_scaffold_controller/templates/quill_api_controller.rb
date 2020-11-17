<% module_namespacing do -%>
class <%= controller_class_name %>Controller < ApplicationController
  before_action <%= ":set_#{singular_table_name}" %>, only: [:show, :update, :destroy]

  # GET <%= route_url %>.json
  def index
    @<%= plural_table_name %> = <%= namespace %>::<%= orm_class.all(class_name) %>

    render json: <%= "@#{plural_table_name}" %>
  end

  # GET <%= route_url %>/1.json
  def show
    render json: <%= "@#{singular_table_name}" %>
  end

  # POST <%= route_url %>.json
  def create
    @<%= singular_table_name %> = <%= namespace %>::<%= orm_class.build(class_name, "#{singular_table_name}_params") %>

    if @<%= orm_instance.save %>
      render json: <%= "@#{singular_table_name}" %>, status: :created
    else
      render json: <%= "@#{orm_instance.errors}" %>, status: :unprocessable_entity
    end
  end


  # PATCH/PUT <%= route_url %>/1.json
  def update
    if @<%= orm_instance.update("#{singular_table_name}_params") %>
      head :no_content
    else
      render json: <%= "@#{orm_instance.errors}" %>, status: :unprocessable_entity
    end
  end

  # DELETE <%= route_url %>/1.json
  def destroy
    @<%= orm_instance.destroy %>
    head :no_content
  end

  private def <%= "set_#{singular_table_name}" %>
    @<%= singular_table_name %> = <%= namespace %>::<%= orm_class.find(class_name, "params[:id]") %>
  end

  private def <%= "#{singular_table_name}_params" %>
    <%- if defined?(attributes_names) -%>
    params.require(:<%= singular_table_name %>).permit(<%= attributes_names.map { |name| ":#{name}" }.join(', ') %>)
    <%- else -%>
    params[:<%= singular_table_name %>]
    <%- end -%>
  end
end
<% end -%>
