class PopulateRawScoresByActivity < ActiveRecord::Migration
  RAW_SCORES = ["BR100-0", "0-100", "100-200", "200-300", "300-400", "400-500", "500-600", "600-700",
                "700-800", "800-900", "900-1000", "1000-1100", "1100-1200", "1200-1300", "1300-1400",
                "1400-1500"]

  def change
    RAW_SCORES.each { |rs| RawScore.create(name: rs) }

    table = CSV.parse(File.read("lib/data/readability_levels_by_activity.csv"), headers: true)
    table.each do |row|
      begin
        activity = Activity.find(row["Activity ID"])
        raw_score = RawScore.find_by(name: row["Lexile Raw"])
        activity.raw_score_id = raw_score.id
        activity.save!
      rescue => e
        puts e
      end
    end
  end
end
