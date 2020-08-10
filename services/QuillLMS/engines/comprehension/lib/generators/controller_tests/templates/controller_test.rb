require 'test_helper'

<% module_namespacing do -%>
class <%= controller_class_name %>ControllerTest < ActionController::TestCase
  setup do
<% if mountable_engine? -%>
    @routes = Engine.routes
<% end -%>
  end

  context "index" do
   should "return successfully - no <%= singular_table_name %>" do
      get :index

      parsed_response = JSON.parse(response.body)

      assert_response :success
      assert_equal Array, parsed_response.class
      assert parsed_response.empty?
    end

    context 'with <%= table_name %>' do
      setup do
        <%= "@#{singular_table_name}" %> = create(:<%= namespace.to_s.downcase + '_' + singular_table_name  %>)
      end

      should "return successfully" do
        get :index

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        refute parsed_response.empty?
      <% attributes_names.each do |name| %>
        assert_equal @<%= singular_table_name %>.<%= name %>, parsed_response.first['<%= name %>']
      <%- end %>
      end
    end
  end

  context "create" do
    setup do
      <%= "@#{singular_table_name}" %> = build(:<%= namespace.to_s.downcase + '_' + singular_table_name  %>)
    end

    should "create a valid record and return it as json" do
      post :create, <%= "#{singular_table_name}: { #{attributes_hash} }" %>

      parsed_response = JSON.parse(response.body)

      assert_equal 201, response.code.to_i
    <% attributes_names.each do |name| %>
      assert_equal @<%= singular_table_name %>.<%= name %>, parsed_response.first['<%= name %>']
    <%- end %>
      assert_equal 1, <%= class_name %>.count
    end

    should "not create an invalid record and return errors as json" do
      # FIXME, update the attributes passed to the endpoint get an invalid response and then update the error message below to match
      post :create, <%= "#{singular_table_name}: { #{attributes_hash} }" %>

      parsed_response = JSON.parse(response.body)

      assert_equal 422, response.code.to_i
      # FIXME, update this to the attribute with the invalid value and update the error message
      assert parsed_response['<%= attributes_names.first %>'].include?("FIX ME")
      assert_equal 0, <%= class_name %>.count
    end
  end

  context "show" do
    setup do
      <%= "@#{singular_table_name}" %> = create(:<%= namespace.to_s.downcase + '_' + singular_table_name  %>)
    end

    should "return json if found" do
      get :show, id: <%= "@#{singular_table_name}" %>.id

      parsed_response = JSON.parse(response.body)

      assert_equal 200, response.code.to_i
    <% attributes_names.each do |name| %>
      assert_equal @<%= singular_table_name %>.<%= name %>, parsed_response['<%= name %>']
    <%- end %>
    end

    should "raise if not found (to be handled by parent app)" do
      assert_raises ActiveRecord::RecordNotFound do
        get :show, id: 99999
      end
    end
  end

  context "update" do
    setup do
      <%= "@#{singular_table_name}" %> = create(:<%= namespace.to_s.downcase + '_' + singular_table_name  %>)
    end

    should "update record if valid, return nothing" do
      # FIXME, update the attributes to something different than the original object
      patch :update, id: <%= "@#{singular_table_name}" %>.id, <%= "#{singular_table_name}: { #{attributes_hash} }" %>

      assert_equal "", response.body
      assert_equal 204, response.code.to_i

      <%= "@#{singular_table_name}" %>.reload
      # FIX ME, update the attributes below the new values to confirm they saved
    <% attributes_names.each do |name| %>
      assert_equal "FIX ME", @<%= singular_table_name %>.<%= name %>
    <%- end %>
    end

    should "not update record and return errors as json" do
      # FIXME, update an attribute sent to the endpoint that would result in an invalid record.
      patch :update, id: <%= "@#{singular_table_name}" %>.id, <%= "#{singular_table_name}: { #{attributes_hash} }" %>

      parsed_response = JSON.parse(response.body)

      assert_equal 422, response.code.to_i
      # FIXME, update this to the attribute with the invalid value and update the error message
      assert parsed_response['<%= attributes_names.first %>'].include?("FIX ME")
    end
  end

  context 'destroy' do
    setup do
      <%= "@#{singular_table_name}" %> = create(:<%= namespace.to_s.downcase + '_' + singular_table_name  %>)
    end

    should "destroy record at id" do
      delete :destroy, id: <%= "@#{singular_table_name}" %>.id

      assert_equal "", response.body
      assert_equal 204, response.code.to_i
      assert @<%= singular_table_name %>.id # still in test memory
      assert_nil <%= class_name %>.find_by_id(@<%= singular_table_name %>.id) # not in DB.
    end
  end
end
<% end -%>
