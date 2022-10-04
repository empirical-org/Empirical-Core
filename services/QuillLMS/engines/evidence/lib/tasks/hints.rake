# frozen_string_literal: true

namespace :hints do

  desc "Migrate the Rule <> Hint relationship from one-to-one to many-to-one"
  task :create_rule_hints => :environment do
    # Note that while we could just straightforwardly move the existing
    # relationships from one-to-one to many-to-one, one of the reasons that
    # we're doing this is that a bunch of these are duplicates, and we want
    # to de-duplicate.  With that in mind, we're treating all Hints with the
    # same `explanation` as duplicates, and will use the lowest-numbered ID
    # as the "canonical" version to use in our new table.
    Evidence::Hint.find_each do |hint|
      canonical_hint = Evidence::Hint.where(explanation: hint.explanation).order(:id).first
      Evidence::RuleHint.create!(rule_id: hint.rule_id, hint_id: canonical_hint.id)
    end
  end

  desc "Delete hints that aren't connected to any Rules"
  task :delete_orphans => :environment do
    # WARNING: Intended to be run only after `create_rule_hints` as we will
    # identify orphaned Hints by finding the ones with no Rule relationships
    Evidence::Hint.left_outer_joins(:rules).where(rules: {id: nil}).destroy_all
  end
end
