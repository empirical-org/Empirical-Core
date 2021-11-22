class ApplicationService
  def self.run(*args, &block)
    new(*args, &block).run
  end
end
