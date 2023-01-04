import * as React from "react";
import { useTable, useSortBy, usePagination, useFilters, useExpanded, useGroupBy, } from "react-table";

import ReactTablePagination from './reactTablePagination'

import { NumberFilterInputProps } from "../../interfaces";

const DEFAULT_PAGE_SIZE = 100

function columnClassName(isSorted, isSortedDesc) {
  const defaultClassName = 'rt-th -cursor-pointer'
  if (!isSorted) { return defaultClassName }

  if (isSortedDesc) { return `${defaultClassName} -sort-desc` }

  return `${defaultClassName} -sort-asc`
}

export const TextFilter = ({ column, setFilter, }) => {
  return (
    <input
      onChange={event => setFilter(column.id, event.target.value)}
      style={{ width: "100%" }}
      value={column.filterValue}
    />
  )
}

export const NumberFilterInput = ({ handleChange, label, column }: NumberFilterInputProps) => {
  return (
    <div style={{ display: 'flex' }}>
      <input
        aria-label={label}
        defaultValue={column.filterValue || ''}
        onChange={e => handleChange(column.id, e.target.value)}
        placeholder={`0-5, >1, <1`}
        style={{width: '100px', marginRight: '0.5rem'}}
        type="text"
      />
    </div>
  );
}

export const expanderColumn = {
  Header: "",
  id: "expander",
  resizable: false,
  className: "text-center",
  Cell: ({ row }) => {
    return (
      <div
        {...row.getToggleRowExpandedProps()}
        className="rt-td rt-expandable p-0"
        title="Click here to see more information"
      >
        <div className={`rt-expander ${row.isExpanded ? "-open" : ""}`} >
          •
        </div>
      </div>
    );
  }
}

interface ReactTableProps {
  columns: any[],
  data: any[],
  className?: string,
  filterable?: boolean,
  defaultPageSize?: number,
  currentPage?: number,
  defaultSorted?: string,
  onSortedChange?: (sortBy: string) => void,
  onPageChange?: (pageIndex: number) => void,
  showPaginationBottom?: boolean,
  manualSortBy?: boolean,
  manualPagination?: boolean,
  manualPageCount?: boolean,
  defaultGroupBy?: string,
  SubComponent?: any
}

export const ReactTable = ({
  columns,
  data,
  className,
  filterable,
  defaultPageSize,
  currentPage,
  defaultSorted,
  onSortedChange,
  onPageChange,
  showPaginationBottom,
  manualSortBy,
  manualPagination,
  manualPageCount,
  defaultGroupBy,
  SubComponent,
}: ReactTableProps) => {
  const defaultColumn = {
    width: 'min-content',
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    state: { pageIndex, sortBy, }
  } = useTable(
    {
      data,
      defaultColumn,
      manualSortBy,
      manualPagination,
      SubComponent,
      columns,
      autoResetSortBy: false,
      pageCount: manualPageCount,
      initialState: {
        pageIndex: currentPage || 0,
        pageSize: defaultPageSize || data.length || DEFAULT_PAGE_SIZE,
        sortBy: defaultSorted || [],
        groupBy: defaultGroupBy || [],
      }
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
  );

  React.useEffect(() => {
    if (manualSortBy && onSortedChange) {
      onSortedChange(sortBy);
    }
  }, [sortBy]);

  React.useEffect(() => {
    if (manualPagination && onPageChange) {
      onPageChange(pageIndex);
    }
  }, [pageIndex]);

  return (
    <div className={`${className} ReactTable`}>
      <table {...getTableProps()} className="rt-table">
        <thead className="rt-thead -header">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="rt-tr">
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps({
                    style: { minWidth: column.minWidth, width: column.width, maxWidth: column.maxWidth },
                  })}
                  className={columnClassName(column.isSorted, column.isSortedDesc)}
                >
                  <div className="sortable-header" {...column.getSortByToggleProps()}>{column.render("Header")}</div>
                  <div className="column-filter">{filterable && column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="rt-tbody">
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <div className="rt-tr-group">
                <tr {...row.getRowProps()} className="rt-tr">
                  {row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps({
                          style: {
                            minWidth: cell.column.minWidth,
                            width: cell.column.width,
                            maxWidth: cell.column.maxWidth,
                            ...cell.column.style
                          },
                        })}
                        className="rt-td"
                      >
                        {cell.isAggregated ? cell.render("Aggregated") : cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
                {row.isExpanded && row.original && SubComponent ? SubComponent(row) : null}
              </div>
            );
          })}
        </tbody>
      </table>
      {showPaginationBottom && (
        <ReactTablePagination
          canNext={canNextPage}
          canPrevious={canPreviousPage}
          onPageChange={gotoPage}
          page={pageIndex}
          pages={pageCount}
        />
      )}
    </div>
  );
};
