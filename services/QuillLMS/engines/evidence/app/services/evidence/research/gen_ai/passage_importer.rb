# frozen_s

module Evidence
  module Research
    module GenAI
      class PassageImporter < ApplicationService
        attr_reader :filename

        def initialize(filename)
          @filename = filename
        end

        def run
          import_passage
        end

        private def import_passage
          contents = File.read(filename)
          Passage.create!(contents: contents)


        end
      end
    end
  end
end
