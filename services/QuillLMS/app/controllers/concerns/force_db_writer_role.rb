# frozen_string_literal: true

module ForceDbWriterRole
  extend ActiveSupport::Concern

  def force_writer_db_role(&)
    ActiveRecord::Base.connected_to(role: :writing, &)
  end
end
