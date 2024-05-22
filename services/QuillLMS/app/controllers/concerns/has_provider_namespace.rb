# frozen_string_literal: true

module HasProviderNamespace
  extend ActiveSupport::Concern

  private def provider_namespace
    self.class.module_parent
  end
end

