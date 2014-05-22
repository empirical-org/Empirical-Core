# have QC share AR's DB connection. This is not thread-safe, but we're using
# unicorn so it doesn't matter. Also, heroku postgres limits connections so we
# could easily hit the limit.

require 'queue_classic'

module QC
  def self.default_conn_adapter=(conn)
    @conn_adapter = conn
  end
end

QC.default_conn_adapter = QC::ConnAdapter.new(
    ActiveRecord::Base.connection.raw_connection)
