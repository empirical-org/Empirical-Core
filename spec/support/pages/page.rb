# cf http://www.neo.com/2014/10/17/clean-up-after-your-capybara
class Page
  extend Capybara::DSL
  include Capybara::DSL

  # FIXME: I don't get why this is a class method [KK - 3/16/15]
  def self.path
    fail "#{self.name} does not implement 'path'"
  end

  def self.visit
    page.visit path
    new
  end

  protected

  def self.has_checkbutton(value_method, element_method, locator)
    # e.g.,
    #   has_checkbutton :accept_terms?,
    #                        :accept_terms_checkbutton,
    #                        :user_terms_of_service
    #   'produces'
    #     has_form_element :accept_terms_checkbutton, :user_terms_of_service
    #     def accept_terms?
    #       accept_terms_checkbutton.checked?
    #     end
    has_form_element element_method, locator

    module_eval_str __LINE__, %{
      public def #{value_method}
        #{element_method}.checked?
      end
    }
  end

  def self.has_form_element(method_name, locator)
    # e.g.,
    #   has_form_element :accepted_tos_field, :user_terms_of_service
    #   'produces'
    #     private def accepted_tos_field
    #       find_field :user_terms_of_service
    #     end
    module_eval_str __LINE__, %{
      private def #{method_name}
        find_field :#{locator}
      end
    }
  end

  def self.has_form_field_value(method_name, element_method)
    # e.g.,
    #   has_form_field_value :zipcode, :zipcode_field
    #   'produces'
    #     def zipcode
    #       zipcode_field.value
    #     end
    module_eval_str __LINE__, %{
      public def #{method_name}
        #{element_method}.value
      end
    }
  end

  def self.has_input_field(value_method, element_method, locator)
    has_form_element   element_method, locator
    has_form_field_value value_method, element_method
  end

  # make :has_radiobutton an alias for :has_checkbutton
  self.singleton_class.send(:alias_method, :has_radiobutton, :has_checkbutton)

  def fill(field, value)
    field.set value if value.present?
  end

  private

  def self.module_eval_str(line_no, str)
    module_eval(str, __FILE__, line_no)
  end
end
