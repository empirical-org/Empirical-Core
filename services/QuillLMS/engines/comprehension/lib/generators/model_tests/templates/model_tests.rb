require 'test_helper'

<% module_namespacing do -%>
class <%= class_name %>Test < ActiveSupport::TestCase


  context 'validations' do
    # FIXME put validation tests here.
  end

  context 'relationships' do
    # FIXME put relationship tests here.
  end
end
<% end -%>
