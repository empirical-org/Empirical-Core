# frozen_string_literal: true

class ApplicationService
  def self.run(*args, **options, &block)
    new(*args, **options, &block).run
  end
end
