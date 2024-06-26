import { useMemo, useEffect, Fragment, useState, useRef, ChangeEvent } from 'react';

// material-ui
import { Box, Tabs, Tab, Stack, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery, Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import {
  useExpanded,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
  Column,
  HeaderGroup,
  Row,
  Cell,
  HeaderProps
} from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';

// types
import { IPullRequest } from 'types/git';
import { getAllPRs } from 'api/services/SalesService';

// ==============================|| REACT TABLE ||============================== //
const moment = require('moment');

interface Props {
  columns: Column[];
  data: IPullRequest[];
}

function ReactTable({ columns, data }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'created_at', desc: false };
  const initialState = useMemo(
    () => ({
      filters: [],
      hiddenColumns: ['html_url', 'avatar', 'email'],
      pageIndex: 0,
      pageSize: 5
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    setSortBy,
    allColumns,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      initialState
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const componentRef: React.Ref<HTMLDivElement> = useRef(null);

  // ================ Tab ================

  const groups = ['All', ...new Set(data.map((item: IPullRequest) => item.repository))];
  const countGroup = data.map((item: IPullRequest) => item.repository);
  const counts = countGroup.reduce(
    (acc: any, value: any) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('repository', activeTab === 'All' ? '' : activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <>
      <Box sx={{ p: 3, pb: 0, width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e: ChangeEvent<{}>, value: string) => setActiveTab(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {groups.map((state: string, index: number) => (
            <Tab
              key={index}
              label={state}
              value={state}
              icon={
                <Chip
                  label={
                    state === 'All'
                      ? data.length
                      : state === 'sales'
                      ? counts.sales
                      : state === 'purchase'
                      ? counts.purchase
                      : state === 'webapp'
                      ? counts.webapp
                      : state === 'inventory'
                      ? counts.inventory
                      : counts.common
                  }
                  color={
                    state === 'All'
                      ? 'info'
                      : state === 'sales'
                      ? 'success'
                      : state === 'purchase'
                      ? 'secondary'
                      : state === 'webapp'
                      ? 'warning'
                      : state === 'inventory'
                      ? 'primary'
                      : 'error'
                  }
                  variant="light"
                  size="small"
                />
              }
              iconPosition="end"
            />
          ))}
        </Tabs>
      </Box>
      <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />
        </Stack>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={matchDownSM ? 1 : 0}>
          <SortingSelect sortBy={sortBy.id} setSortBy={setSortBy} allColumns={allColumns} />
          <TableRowSelection selected={Object.keys(selectedRowIds).length} />
          {headerGroups.map((group: HeaderGroup<{}>, index: number) => (
            <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} {...group.getHeaderGroupProps()}>
              {group.headers.map((column: HeaderGroup<{}>) => (
                <Box {...column.getHeaderProps([{ className: column.className }])}>{column.canFilter ? column.render('Filter') : null}</Box>
              ))}
            </Stack>
          ))}
          <CSVExport data={data} filename={'pull-request-list.csv'} />
        </Stack>
      </Stack>
      <Box ref={componentRef}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column: HeaderGroup<{}>) => (
                  <TableCell {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row: Row, i: number) => {
              prepareRow(row);
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell: Cell) => (
                      <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

// ==============================|| Pull Request - LIST ||============================== //

const List = () => {
  const [list, setList] = useState<IPullRequest[]>([]);

  const getAllPullRequests = async () => {
    await Promise.all([
      getAllPRs('dhanman-sales'),
      getAllPRs('dhanman-purchase'),
      getAllPRs('dhanman-webapp'),
      getAllPRs('dhanman-common'),
      getAllPRs('dhanman-inventory')
    ]).then((results) => {
      setList(results[0].concat(results[1]).concat(results[2]).concat(results[3]).concat(results[4]));
    });
  };

  useEffect(() => {
    getAllPullRequests();
  }, []);

  const memoizedPullRequests = useMemo(() => list, [list]);

  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        Header: ({ getToggleAllPageRowsSelectedProps }: HeaderProps<{}>) => (
          <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
        ),
        accessor: 'selection',
        Cell: ({ row }: any) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Repository',
        accessor: 'repository',
        disableFilters: true
      },
      {
        Header: 'Url',
        accessor: 'html_url',
        disableSortBy: true
      },
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({ row }: { row: Row<{}> }) => {
          return (
            <a href={row.values.html_url} target="_blank" rel="noreferrer">
              {row.values.title}
            </a>
          );
        },

        disableFilters: true
      },
      {
        Header: 'Create Date',
        accessor: 'created_at',
        Cell: ({ row }: { row: Row<{}> }) => {
          return moment(row.values.created_at).format('DD MMM YYYY HH:MM A');
        },
        disableFilters: true
      },
      {
        Header: 'Days Old',
        disableFilters: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          return moment(new Date()).diff(moment(row.values.created_at), 'days');
        }
      },
      {
        Header: 'Author',
        accessor: 'user.login',
        disableFilters: true
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={memoizedPullRequests} />
        </ScrollX>
      </MainCard>
    </>
  );
};

export default List;
