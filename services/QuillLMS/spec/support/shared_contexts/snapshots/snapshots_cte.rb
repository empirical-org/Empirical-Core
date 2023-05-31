# frozen_string_literal: true

RSpec.shared_context 'Snapshots CTE' do
  # BigQuery doesn't support CTE aliases with period in the name.
  # So, we need to remove the `lms.` prefix from 'FROM' and 'JOIN' clauses
  let(:query) { pg_query.gsub(/(FROM|JOIN) lms\.(\w+)/, '\1 \2') }

  let(:results) { QuillBigQuery::Runner.execute(bg_query) }
  let(:bq_query) { "WITH #{cte} #{query}" }

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
