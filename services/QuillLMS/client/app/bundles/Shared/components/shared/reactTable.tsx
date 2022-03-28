import * as React from "react";
import { useTable, useSortBy, usePagination, } from "react-table";

function columnClassName(isSorted, isSortedDesc) {
  const defaultClassName = 'rt-th -cursor-pointer'
  if (!isSorted) { return defaultClassName }

  if (isSortedDesc) { return `${defaultClassName} -sort-desc` }

  return `${defaultClassName} -sort-asc`
}

const ReactTable = ({
  columns,
  data,
  className,
  showPagination,
  defaultSorted,
  minRows,
  onChangeSort,
  showPageSizeOptions,
  showPaginationBottom,
  showPaginationTop,
  manualSortBy,
}) => {
  const defaultColumn = {
    width: 'min-content',
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy, }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      manualSortBy,
      autoResetSortBy: false,
      initialState: { pageIndex: 0, sortBy: defaultSorted, }
    },
    useSortBy,
    usePagination
  );

  React.useEffect(() => {
    onChangeSort(sortBy);
  }, [onChangeSort, sortBy]);

  return (
    <div className={`${className} ReactTable`}>
      <table {...getTableProps()} className="rt-table">
        <thead className="rt-thead -header">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="rt-tr">
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps({
                    ...column.getSortByToggleProps(),
                    style: { minWidth: column.minWidth, width: column.width, maxWidth: column.maxWidth },
                  })}
                  className={columnClassName(column.isSorted, column.isSortedDesc)}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="rt-tbody">
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="rt-tr">
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps({
                        style: {
                          minWidth: cell.column.minWidth,
                          width: cell.column.width,
                          maxWidth: cell.column.maxWidth
                        },
                      })}
                      className="rt-td"
                    >
                    {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export { ReactTable, }
