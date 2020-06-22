require 'test_helper'

<% module_namespacing do -%>
class <%= class_name %>Test < ActiveSupport::TestCase


  context 'validations' do
    # TODO put validation tests here.
  end

  context 'relationships' do
    # TODO put relationship tests here.
  end
end
<% end -%>
