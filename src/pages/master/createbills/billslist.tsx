import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Typography } from '@mui/material';

// third-party
import { useTable, useFilters, useGlobalFilter, Column, Row, HeaderGroup, Cell } from 'react-table';
import moment from 'moment';
// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport } from 'components/third-party/ReactTable';
import { getAllBills } from 'api/services/BillService';

import { GlobalFilter, DefaultColumnFilter, renderFilterTypes } from 'utils/react-table';
import { IBill } from 'types/bill';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }: { columns: Column[]; data: IBill[] }) {
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
  const initialState = useMemo(() => ({ filters: [{ id: 'status', value: '' }] }), []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, preGlobalFilteredRows, setGlobalFilter } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState,
      filterTypes
    },
    useGlobalFilter,
    useFilters
  );

  const sortingRow = rows.slice(0, 10);

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ padding: 2 }}>
        <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
        <CSVExport data={rows.map((d: Row) => d.original)} filename={'filtering-table.csv'} />
      </Stack>

      <Table {...getTableProps()}>
        <TableHead sx={{ borderTopWidth: 2 }}>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: HeaderGroup) => (
                <TableCell {...column.getHeaderProps([{ className: column.className }])}>{column.render('Header')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {headerGroups.map((group: HeaderGroup<{}>) => (
            <TableRow {...group.getHeaderGroupProps()}>
              {group.headers.map((column: HeaderGroup) => (
                <TableCell {...column.getHeaderProps([{ className: column.className }])}>
                  {column.canFilter ? column.render('Filter') : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {sortingRow.length > 0 ? (
            sortingRow.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell: Cell) => (
                    <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableCell colSpan={7} align="center">
              <Stack spacing={2} justifyContent="center" alignItems="center">
                <Typography variant="h5">Loading Please Wait !</Typography>
                <CircularProgress color="success" />
              </Stack>
            </TableCell>
          )}
        </TableBody>
      </Table>
    </>
  );
}

// ==============================|| BILL - LIST ||============================== //

const Bills = () => {
  const [bill, setBills] = useState([] as IBill[]);

  useEffect(() => {
    getAllBills('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((billList) => {
        if (Array.isArray(billList)) {
          const billsWithSequentialId = billList.map((bill, index) => ({
            ...bill,
            billsequentialId: index + 1
          }));
          setBills(billsWithSequentialId);
        } else {
          console.error('API response is not an array:', billList);
        }
      })
      .catch((error) => {
        console.error('Error fetching vendor data:', error);
      });
  }, []);

  const columns = useMemo(
    () =>
      [
        {
          Header: 'Sr. No.',
          accessor: 'billsequentialId'
        },
        {
          Header: 'Date',
          accessor: 'billDate',
          Cell: (props) => {
            return moment(props.value).format('DD-MMM-YYYY');
          }
        },
        {
          Header: 'bill Number',
          accessor: 'billNumber'
        },
        {
          Header: 'Vendor Name',
          accessor: 'vendorName'
        },
        {
          Header: 'Due Date',
          accessor: 'dueDate',
          Cell: (props) => {
            return moment(props.value).format('DD-MMM-YYYY');
          }
        },
        {
          Header: 'Amount',
          accessor: 'amount'
        }
      ] as Column[],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={bill} />
      </ScrollX>
    </MainCard>
  );
};

export default Bills;
