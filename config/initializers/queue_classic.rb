require 'queue_classic'

# annoying fixin to make work in test/dev

unless ENV.has_key?('DB_URL')

  module QC
    def self.default_conn_adapter=(conn)
      @conn_adapter = conn
    end
  end

  QC.default_conn_adapter = QC::ConnAdapter.new(
    ActiveRecord::Base.connection.raw_connection)

end
