# frozen_string_literal: true

module Evidence
  class ApplicationService
    def self.run(*args, **options, &block)
      new(*args, **options, &block).run
    end
  end
end
