class AddQueueClassic < ActiveRecord::Migration
  def self.up
    ENV['DATABASE_URL'] ||= "postgres://super:4Rh0izHYfmfWx9cV@#{ENV['PG_PORT_5432_TCP_ADDR']}:#{ENV['PG_PORT_5432_TCP_PORT']}/compass_development"

    QC::Setup.create
  end

  def self.down
    QC::Setup.drop
  end
end
