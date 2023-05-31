# frozen_string_literal: true

RSpec.shared_context 'Snapshots CTE' do
  # BigQuery doesn't support CTE aliases with period in the name.
  # So, we need to remove the 'lms.' and 'special.' prefixes from 'FROM' and 'JOIN' clauses
  let(:query) { pg_query.gsub(/(FROM|JOIN)\s+(?:lms|special)\.(\w+)/, '\1 \2') }

  let(:bq_query) do
    <<-SQL
      WITH
        #{cte}
      #{query}
    SQL
  end

  let(:results) { QuillBigQuery::Runner.execute(bq_query) }

  def cte
    cte_table_collections
      .reject { |collection| collection.empty? }
      .map { |collection| "#{cte_alias(collection)} AS ( #{cte_query(collection)} )" }
      .join(",\n\t")
  end

  def cte_alias(collection)
    collection.first.class.table_name
  end

  def cte_query(records)
    records
      .map { |record| [:SELECT, cte_select_clause(record)].join(' ') }
      .join(" UNION ALL \n")
  end

  def cte_select_clause(record)
    record.attributes.except('order').map { |attr, value| "#{convert_type(record, attr, value)} AS #{attr}" }.join(', ')
  end

  def convert_type(record, attr, value)
    attr_type = record.class.column_for_attribute(attr).type

    if value.nil?
      'NULL'
    elsif value.is_a?(Array)
      value.map { |v| attr_type_value(attr_type, v) }
    else
      attr_type_value(attr_type, value)
    end
  end

  def attr_type_value(attr_type, value)
    case attr_type
    when :boolean, :decimal, :float, :integer then value
    when :jsonb, :string then "'#{value}'"
    when :datetime then "'#{value.iso8601}'"
    else
      raise "Error: type #{attr_type} not found" # "'#{value}'"
    end
  end
end
