# frozen_string_literal: true

RSpec.shared_context 'Snapshots CTE' do
  # BigQuery doesn't support CTE aliases with period in the name.
  # So, we need to remove the 'lms.' and 'special.' prefixes from 'FROM' and 'JOIN' clauses
  let(:query) { pg_query.gsub(/(FROM|JOIN)\s+(?:lms|special)\.(\w+)/, '\1 \2') }
  let(:bq_query) { "WITH #{cte} #{query}" }
  let(:results) { QuillBigQuery::Runner.execute(bq_query) }

  def cte_query(records)
    records
      .map { |record| record.attributes.except('order') }
      .map { |attrs| [:SELECT, attrs.map { |k, v| "#{quote_unless_numeric(v)} AS #{k}" }.join(', ')].join(' ') }
      .join(" UNION ALL \n")
  end

  def quote_unless_numeric(value)
    value.is_a?(Numeric) ? value : "'#{value}'"
  end
end
