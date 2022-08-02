# frozen_string_literal: true

module Evidence
  class ApplicationService
    def self.run(*args, &block)
      new(*args, &block).run
    end
  end
end
