import { useMemo, useEffect, useState } from 'react';

// material-ui
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Typography } from '@mui/material';

// third-party
import { useFilters, useGlobalFilter, useTable, Column, HeaderGroup, Row, Cell } from 'react-table';
import moment from 'moment';
// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { CSVExport } from 'components/third-party/ReactTable';

//import { openSnackbar } from 'store/reducers/snackbar';
import { renderFilterTypes, GlobalFilter, DefaultColumnFilter } from 'utils/react-table';
import { getAllInvoices } from 'api/services/SalesService';

// types
import { IInvoice } from 'types/invoice';

// @ts-ignore

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }: { columns: Column[]; data: IInvoice[] }) {
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

// ==============================|| INVOICE - LIST ||============================== //

const Invoices = () => {
  const [invoice, setInvoices] = useState([] as IInvoice[]); // Initialize as an empty array with the correct type

  useEffect(() => {
    getAllInvoices('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((invoiceList) => {
        // Ensure customerList is an array before mapping it
        if (Array.isArray(invoiceList)) {
          const invoicesWithSequentialId = invoiceList.map((invoice, index) => ({
            ...invoice,
            sequentialId: index + 1
          }));
          setInvoices(invoicesWithSequentialId);
        } else {
          console.error('API response is not an array:', invoiceList);
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
          Header: 'Invoice Id',
          accessor: 'invoiceNumber'
        },
        {
          Header: 'Date',
          accessor: 'invoiceDate',
          Cell: (props) => {
            return moment(props.value).format('DD-MMM-YYYY');
          }
        },
        {
          Header: 'Due Date',
          accessor: 'dueDate',
          Cell: (props) => {
            return moment(props.value).format('DD-MMM-YYYY');
          }
        },
        {
          Header: 'Notes',
          accessor: 'note'
        },
        {
          Header: 'Customer',
          accessor: 'customerName'
        },
        {
          Header: 'Currency',
          accessor: 'currency'
        },
        {
          Header: 'Created On',
          accessor: 'createdOnUtc',
          Cell: (props) => {
            return moment(props.value).format('DD-MMM-YY, h:mm:ss a');
          }
        }
      ] as Column[],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={invoice} />
      </ScrollX>
    </MainCard>
  );
};

export default Invoices;
