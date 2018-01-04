kl = MODELNAME


print "# #{kl}\n\n## Columns\n\n" + kl.first.attributes.map {|k,v| "#### #{k}\nDescription Goes Here\n\nType: #{v.class}\n\nExample: #{v}\n\nDefaults To: \n\nAllowed Values: \n\n"}.join() + "\n\n## Relations\n\n" + kl.reflect_on_all_associations(nil).map { |a| "#{a.macro} => #{a.class_name.underscore.pluralize} #{!a.options[:through].nil? ? 'through ' + a.options[:through].to_s : nil}"}.join("\n\n")