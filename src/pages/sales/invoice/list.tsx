import { useMemo, useEffect, Fragment, useState, useRef, ChangeEvent, useCallback, FC } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Tabs,
  Tab,
  Grid,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Tooltip,
  Chip,
  Skeleton
} from '@mui/material';
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
  HeaderProps,
  CellProps
} from 'react-table';
import {
  DeleteTwoTone,
  DownOutlined,
  EditTwoTone,
  EyeTwoTone,
  FileDoneOutlined,
  InfoCircleOutlined,
  RightOutlined
} from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

import { dispatch, useSelector } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { alertPopupToggle, getInvoiceDelete } from 'store/reducers/invoice';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';
import { NumericFormat } from 'react-number-format';

// types
import { IInvoiceList } from 'types/invoice';
import AlertColumnDelete from 'sections/apps/invoice/AlertColumnDelete';
import { getAllInvoices, getInvoiceDetailsByHeaderId } from 'api/services/SalesService';
import Avatar from 'types/Avatar';
import InvoiceCard from 'components/cards/invoice/InvoiceCard';
import InvoiceChart from 'components/cards/invoice/InvoiceChart';
import { PaletteColor } from '@mui/material';

export interface InvoiceWidgets {
  title: string;
  count: string;
  percentage: number;
  isLoss: boolean;
  invoice: string;
  invoiceStatus: string;
  color: PaletteColor;
  chartData: number[];
}

// ==============================|| SUB TABLE ||============================== //

function ReactSubTable({ columns, data, loading }: { columns: Column[]; data: []; loading: boolean }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  if (loading) {
    return (
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {[0, 1, 2].map((item: number) => (
            <TableRow key={item}>
              {[0, 1, 2, 3, 4, 5].map((col: number) => (
                <TableCell key={col}>
                  <Skeleton animation="wave" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: HeaderGroup) => (
              <TableCell {...column.getHeaderProps([{ className: column.className }])}>{column.render('Header')}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell: Cell) => (
                <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
// ==============================|| SUB ROW - ASYNC DATA ||============================== //

function SubRowAsync({ invoiceId }: { invoiceId: string }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<[]>([]);

  useEffect(() => {
    getInvoiceDetailsByHeaderId(invoiceId)
      .then((invoiceList) => {
        if (Array.isArray(invoiceList)) {
        }
        setData(invoiceList);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [invoiceId]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }: { value: string }) => (
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
        )
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ value }: { value: number }) => (
          <NumericFormat value={value} displayType="text" thousandSeparator={true} prefix={'₹'} decimalScale={2} />
        )
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        disableFilters: true,
        Cell: ({ value }: { value: number }) => (
          <NumericFormat value={value} displayType="text" thousandSeparator={true} prefix={'₹'} decimalScale={2} />
        )
      }
    ],
    []
  );

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  return (
    <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` } }}>
      <TableCell colSpan={8} sx={{ p: 2.5 }}>
        <MainCard content={false} sx={{ ml: { xs: 2.5, sm: 5, md: 6, lg: 10, xl: 12 } }}>
          <ReactSubTable columns={columns} data={data} loading={loading} />
        </MainCard>
      </TableCell>
    </TableRow>
  );
}

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Column[];
  data: IInvoiceList[];
  renderRowSubComponent: FC<any>;
}

function ReactTable({ columns: userColumns, data, renderRowSubComponent }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'customerName', desc: false };
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'invoiceStatus', value: '' }],
      hiddenColumns: ['avatar', 'email'],
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
    visibleColumns,
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
      columns: userColumns,
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

  const groups = ['All', ...new Set(data.map((item: IInvoiceList) => item.invoiceStatus))];
  const countGroup = data.map((item: IInvoiceList) => item.invoiceStatus);
  const counts = countGroup.reduce(
    (acc: any, value: any) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('invoiceStatus', activeTab === 'All' ? '' : activeTab);
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
          {groups.map((invoiceStatus: string, index: number) => (
            <Tab
              key={index}
              label={invoiceStatus}
              value={invoiceStatus}
              icon={
                <Chip
                  label={
                    invoiceStatus === 'All'
                      ? data.length
                      : invoiceStatus === 'Paid'
                      ? counts.Paid
                      : invoiceStatus === 'Unpaid'
                      ? counts.Unpaid
                      : counts.Closed
                  }
                  color={
                    invoiceStatus === 'All'
                      ? 'primary'
                      : invoiceStatus === 'Paid'
                      ? 'success'
                      : invoiceStatus === 'Unpaid'
                      ? 'warning'
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
          <CSVExport data={data} filename={'invoice-list.csv'} />
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
              const rowProps = row.getRowProps();
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
                  {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
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

// ==============================|| INVOICE - LIST ||============================== //

const List = () => {
  const { alertPopup } = useSelector((state) => state.invoice);
  const [invoice, setList] = useState<IInvoiceList[]>([]);
  const [invoiceId, setInvoiceId] = useState(0);
  const [getInvoiceId, setGetInvoiceId] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    getAllInvoices('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((invoiceList) => {
        setList(invoiceList);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const navigation = useNavigate();
  const handleClose = (invoiceStatus: boolean) => {
    if (invoiceStatus) {
      dispatch(getInvoiceDelete(invoiceId));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Column deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
    dispatch(
      alertPopupToggle({
        alertToggle: false
      })
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: () => null,
        id: 'expander',
        className: 'cell-center',
        Cell: ({ row }: CellProps<any>) => {
          const collapseIcon = row.isExpanded ? <DownOutlined /> : <RightOutlined />;
          return (
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              <span
                onClick={() => {
                  setExpandedRows((prevState: { [key: string]: boolean }) => ({
                    ...prevState,
                    [row.id]: !prevState[row.id]
                  }));
                  row.toggleRowExpanded();
                }}
              >
                {collapseIcon}
              </span>
            </Box>
          );
        },
        SubCell: () => null
      },
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
        Header: 'Customer Name',
        accessor: 'customerName',
        disableFilters: true
      },
      {
        Header: 'Create Date',
        accessor: 'invoiceDate'
      },
      {
        Header: 'Due Date',
        accessor: 'dueDate'
      },
      {
        Header: 'Amount',
        accessor: 'totalAmount',
        Cell: ({ value }: { value: number }) => (
          <NumericFormat value={value} displayType="text" thousandSeparator={true} prefix={'₹'} decimalScale={2} />
        ),
        disableFilters: true
      },
      {
        Header: 'Status',
        accessor: 'invoiceStatus',
        disableFilters: true,
        filter: 'includes',
        Cell: ({ value }: { value: string }) => {
          switch (value) {
            case 'Closed':
              return <Chip color="error" label="Closed" size="small" variant="light" />;
            case 'Paid':
              return <Chip color="success" label="Paid" size="small" variant="light" />;
            case 'Unpaid':
            default:
              return <Chip color="info" label="Unpaid" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton
                  color="secondary"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    navigation(`/apps/invoice/details/${row.values.id}`);
                  }}
                >
                  <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    navigation(`/apps/invoice/edit/${row.values.id}`);
                  }}
                >
                  <EditTwoTone twoToneColor={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setInvoiceId(row.values.id);
                    setGetInvoiceId(row.values.invoice_id); // row.original
                    dispatch(
                      alertPopupToggle({
                        alertToggle: true
                      })
                    );
                  }}
                >
                  <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const renderRowSubComponent = useCallback(
    ({ row }: { row: any }) => {
      if ((expandedRows as { [key: string]: boolean })[row.id]) {
        return <SubRowAsync invoiceId={row.original.id} />;
      }
      return null;
    },
    [expandedRows]
  );

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const widgetsData: InvoiceWidgets[] = [
    {
      title: 'Paid',
      count: '$7,825',
      percentage: 70.5,
      isLoss: false,
      invoice: '9',
      invoiceStatus: 'invoiceStatus',
      color: theme.palette.success,
      chartData: [200, 600, 100, 400, 300, 400, 50]
    },
    {
      title: 'Unpaid',
      count: '$1,880',
      percentage: 27.4,
      isLoss: true,
      invoice: '9',
      invoiceStatus: 'invoiceStatus',
      color: theme.palette.warning,
      chartData: [100, 550, 300, 350, 200, 100, 300]
    },
    {
      title: 'Overdue',
      count: '$3,507',
      percentage: 27.4,
      isLoss: true,
      invoice: '4',
      invoiceStatus: 'invoiceStatus',
      color: theme.palette.error,
      chartData: [100, 550, 200, 300, 100, 200, 300]
    }
  ];

  return (
    <>
      <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 2 }}>
        <Grid item md={8}>
          <Grid container direction="row" spacing={2}>
            {widgetsData.map((widget: InvoiceWidgets, index: number) => (
              <Grid item sm={4} xs={12} key={index}>
                <MainCard>
                  <InvoiceCard
                    title={widget.title}
                    count={widget.count}
                    percentage={widget.percentage}
                    isLoss={widget.isLoss}
                    invoice={widget.invoice}
                    color={widget.color.main}
                  >
                    <InvoiceChart color={widget.color} data={widget.chartData} />
                  </InvoiceCard>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Box
            sx={{
              background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              borderRadius: 1,
              p: 1.75
            }}
          >
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar alt="Natacha" variant="rounded" type="filled">
                  <FileDoneOutlined style={{ fontSize: '20px' }} />
                </Avatar>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" color="white">
                      Total Recievables
                    </Typography>
                    <InfoCircleOutlined style={{ color: theme.palette.background.paper }} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2" color="white">
                      Current
                    </Typography>
                    <Typography variant="body1" color="white">
                      109.1k
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" color="white">
                  Overdue
                </Typography>
                <Typography variant="body1" color="white">
                  62k
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="h4" color="white" sx={{ pt: 2, pb: 1, zIndex: 1 }}>
              $43,078
            </Typography>
            <Box sx={{ maxWidth: '100%' }}>
              <LinearWithLabel value={90} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={invoice} renderRowSubComponent={renderRowSubComponent} />
        </ScrollX>
      </MainCard>
      <AlertColumnDelete title={`${getInvoiceId}`} open={alertPopup} handleClose={handleClose} />
    </>
  );
};

function LinearWithLabel({ value, ...others }: LinearProgressProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color="warning" variant="determinate" value={value} {...others} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="white">{`${Math.round(value!)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default List;
