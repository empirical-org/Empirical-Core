Array.wrap(command_options).each do |factory_options|
  factory_method = factory_options.shift

  begin
    factory_options.map! do |option|
      case option
      when String
        option.to_sym
      when Hash
        option.symbolize_keys
      else
        option
      end
    end

    puts "Running #{factory_method}, #{factory_options}"
    CypressDev::SmartFactoryWrapper.public_send(factory_method, *factory_options)
  rescue => e
    puts "#{e.class}: #{e.message}"
    puts "#{e.record.inspect}" if e.is_a?(ActiveRecord::RecordInvalid)

    raise e
  end
end
