import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Typography } from '@mui/material';

// third-party
import { useTable, useFilters, useGlobalFilter, Column, Row, HeaderGroup, Cell } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport } from 'components/third-party/ReactTable';

import { GlobalFilter, DefaultColumnFilter, renderFilterTypes } from 'utils/react-table';
import { IVendor } from 'types/bill';
import { getAllVendors } from 'api/services/BillService';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }: { columns: Column[]; data: IVendor[] }) {
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
// ==============================|| REACT TABLE - FILTERING ||============================== //
const Vendors = () => {
  const [vendor, setCustomers] = useState([] as IVendor[]);

  useEffect(() => {
    getAllVendors('59ac0567-d0ac-4a75-91d5-b5246cfa8ff3')
      .then((customerList) => {
        if (Array.isArray(customerList)) {
          const customersWithSequentialId = customerList.map((customer, index) => ({
            ...customer,
            sequentialId: index + 1
          }));
          setCustomers(customersWithSequentialId);
        } else {
          console.error('API response is not an array:', customerList);
        }
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }, []);

  const columns = useMemo(
    () =>
      [
        {
          Header: 'Sr. No.',
          accessor: 'sequentialId'
        },
        {
          Header: 'First Name',
          accessor: 'firstName'
        },
        {
          Header: 'Last Name',
          accessor: 'lastName'
        },
        {
          Header: 'Email',
          accessor: 'email'
        }
      ] as Column[],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={vendor} />
      </ScrollX>
    </MainCard>
  );
};

export default Vendors;
