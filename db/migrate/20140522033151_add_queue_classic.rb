class AddQueueClassic < ActiveRecord::Migration
  def self.up
    QC::Setup.create(ActiveRecord::Base.connection.raw_connection)
  end

  def self.down
    QC::Setup.drop
  end
end
