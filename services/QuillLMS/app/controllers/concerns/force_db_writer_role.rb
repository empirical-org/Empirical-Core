# frozen_string_literal: true

module ForceDbWriterRole
  extend ActiveSupport::Concern

  def force_writer_db_role(&block)
    ActiveRecord::Base.connected_to(role: :writing, &block)
  end
end
