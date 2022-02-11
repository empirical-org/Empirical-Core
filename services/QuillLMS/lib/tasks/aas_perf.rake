# frozen_string_literal: true

namespace :perf do
  desc 'run'
  task :run, [:count, :colname] => :environment do |t, args|
    records = []

    args[:count].to_i.times do
      record = JsonPerfTest.create!(
        # jsoncol: {foo: [1], bar: [2]},
        # jsonbcol: {foo: [1], bar: [2]}
      )
      records.append(record)
    end

    records.each do |r|
      if args[:colname] == 'jsoncol'
        r.jsoncol = JsonPerfTest::PAYLOAD
      else
        r.jsonbcol = JsonPerfTest::PAYLOAD
      end
    end

    puts "colname: #{args[:colname]}"

    Benchmark.bm do |x|
      x.report do
        records.each {|r| r.save! }
      end
    end

  end
end
