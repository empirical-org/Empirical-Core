module Evidence
  class Check::Base

    attr_reader :entry, :prompt, :previous_feedback, :error, :response

    def initialize(entry, prompt, previous_feedback)
      @entry = entry
      @prompt = prompt
      @previous_feedback = previous_feedback
    end

    def run
      raise NotImplementedError
    end

    def self.run(entry, prompt, previous_feedback)
      new(entry, prompt, previous_feedback).tap do |check|
        begin
          check.run
        rescue => e
          # TODO log error
          puts e
          @error = e
        end
      end
    end

    def optimal?
      return true unless response

      response['optimal']
    end

    def autoML?
      false
    end

    def success?
      error.nil?
    end
  end
end
