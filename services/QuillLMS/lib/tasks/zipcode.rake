namespace :zipcode do
  desc "TODO"
  task populate: :environment do
    # TODO: perhaps copy from a zipped file to reduce heroku bundle size?

    zipcodes_file_path = Rails.root.join('lib', 'data', 'zipcodes.copy')
    conn = ActiveRecord::Base.connection
    rc = conn.raw_connection
    rc.exec("COPY zipcode_infos (zipcode,zipcode_type,city,
            state,timezone,lat,lng,_secondary_cities,county,
            decommissioned,estimated_population,
            _area_codes) FROM STDIN")
    file = File.open(zipcodes_file_path, 'r')
    until file.eof?
      data = file.readline
      rc.put_copy_data(data)
    end
    rc.put_copy_end
  end

end
