import { useMemo, useEffect, Fragment, useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import {
  Box,
  Chip,
  Tabs,
  Tab,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Tooltip,
  LinearProgressProps,
  LinearProgress,
  Typography,
  PaletteColor,
  Grid
} from '@mui/material';

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
import { DeleteTwoTone, EditTwoTone, EyeTwoTone, FileDoneOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { dispatch, useSelector } from 'store';

import InvoiceCard from 'components/cards/invoice/InvoiceCard';
import InvoiceChart from 'components/cards/invoice/InvoiceChart';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import AlertColumnDelete from 'sections/apps/invoice/AlertColumnDelete';
import { CSVExport, HeaderSort, IndeterminateCheckbox, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import { getAllBills } from 'api/services/BillService';

import { GlobalFilter, renderFilterTypes, DateColumnFilter } from 'utils/react-table';
import { IBill } from 'types/bill';
import { alpha, useTheme } from '@mui/material/styles';
import { openSnackbar } from 'store/reducers/snackbar';
import { alertPopupToggle } from 'store/reducers/invoice';
import { NumericFormat } from 'react-number-format';

const moment = require('moment');
interface BillWidgets {
  title: string;
  count: string;
  percentage: number;
  isLoss: boolean;
  invoice: string;
  color: PaletteColor;
  chartData: number[];
}

// ==============================|| REACT TABLE ||============================== //
interface Props {
  columns: Column[];
  data: IBill[];
}

function ReactTable({ columns, data }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'billStatus', value: '' }],
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

  const groups = ['All', ...new Set(data.map((item: IBill) => item.billStatus))];
  const countGroup = data.map((item: IBill) => item.billStatus);
  const counts = countGroup.reduce(
    (acc: any, value: any) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    setFilter('billStatus', activeTab === 'All' ? '' : activeTab);
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
          {groups.map((billStatus: string, index: number) => (
            <Tab
              key={index}
              label={billStatus}
              value={billStatus}
              icon={
                <Chip
                  label={
                    billStatus === 'All'
                      ? data.length
                      : billStatus === 'Cancel'
                      ? counts.Cancel
                      : billStatus === 'Unpaid'
                      ? counts.Unpaid
                      : counts.Paid
                  }
                  color={
                    billStatus === 'All' ? 'primary' : billStatus === 'Paid' ? 'success' : billStatus === 'Unpaid' ? 'warning' : 'error'
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
            size="medium"
          />
        </Stack>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={matchDownSM ? 1 : 0}>
          <TableRowSelection selected={Object.keys(selectedRowIds).length} />
          {headerGroups.map((group: HeaderGroup<{}>, index: number) => (
            <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} {...group.getHeaderGroupProps()}>
              {group.headers.map((column: HeaderGroup<{}>) => (
                <Box {...column.getHeaderProps([{ className: column.className }])}>{column.canFilter ? column.render('Filter') : null}</Box>
              ))}
            </Stack>
          ))}
          <CSVExport data={data} filename={'Bill-list.csv'} />
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
              <TableCell sx={{ p: 2, py: 3 }} colSpan={10}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

// ==============================|| BILL - LIST ||============================== //

const Bills = () => {
  const [bill, setBills] = useState([] as IBill[]);
  const theme = useTheme();
  const navigation = useNavigate();
  const { alertPopup } = useSelector((state) => state.invoice);
  const [getInvoiceId] = useState(0);

  useEffect(() => {
    getAllBills('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((billList) => {
        if (Array.isArray(billList)) {
          setBills(billList);
        } else {
          console.error('API response is not an array:', billList);
        }
      })
      .catch((error) => {
        console.error('Error fetching vendor data:', error);
      });
  }, []);

  const handleClose = (invoiceStatus: boolean) => {
    if (invoiceStatus) {
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
    () =>
      [
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
          Header: 'Create Date',
          accessor: 'billDate',
          Cell: (props) => moment(props.value).format('DD MMM YYYY'),
          disableFilters: true
        },
        {
          Header: 'Bill No',
          accessor: 'billNumber',
          disableFilters: true
        },
        {
          Header: 'Vendor Name',
          accessor: 'vendorName',
          disableFilters: true
        },
        {
          Header: 'Status',
          accessor: 'billStatus',
          className: 'cell-left',
          disableFilters: true,
          filter: 'includes',
          Cell: ({ value }: { value: string }) => {
            switch (value) {
              case 'Cancel':
                return <Chip color="error" label="Cancelled" size="small" variant="light" />;
              case 'Paid':
                return <Chip color="success" label="Paid" size="small" variant="light" />;
              case 'Unpaid':
              default:
                return <Chip color="info" label="Unpaid" size="small" variant="light" />;
            }
          }
        },
        {
          Header: 'Due Date',
          accessor: 'dueDate',
          Cell: (props) => moment(props.value).format('DD MMM YYYY'),
          disableFilters: true
        },
        {
          Header: 'Amount',
          accessor: 'amount',
          Cell: ({ value }: { value: number }) => (
            <div style={{ textAlign: 'right' }}>
              <NumericFormat
                value={value}
                displayType="text"
                thousandSeparator={true}
                prefix={'₹'}
                decimalScale={2}
              />
            </div>
          ),
          disableFilters: false // Enable filters
        },
        {
          Header: 'Tax',
          accessor: 'tax',
          className: 'cell-center',
          disableFilters: true
        },
        {
          Header: 'Term',
          accessor: 'paymentTerm',
          className: 'cell-center',
          disableFilters: true
        },
        {
          Header: 'Actions',
          className: 'cell-right',
          disableSortBy: true,
          Cell: ({ row }: { row: Row<{}> }) => {
            return (
              <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
                <Tooltip title="View">
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      navigation('./create');
                    }}
                  >
                    <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton color="primary">
                    <EditTwoTone twoToneColor={theme.palette.primary.main} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error">
                    <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          }
        }
      ] as Column[],
    [navigation, theme.palette.error.main, theme.palette.primary.main, theme.palette.secondary.main]
  );

  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const widgetsData: BillWidgets[] = [
    {
      title: 'Paid',
      count: '7,825',
      percentage: 70.5,
      isLoss: false,
      invoice: '9',
      color: theme.palette.success,
      chartData: [200, 600, 100, 400, 300, 400, 50]
    },
    {
      title: 'Unpaid',
      count: '1,880',
      percentage: 27.4,
      isLoss: true,
      invoice: '6',
      color: theme.palette.warning,
      chartData: [100, 550, 300, 350, 200, 100, 300]
    },
    {
      title: 'Overdue',
      count: '3,507',
      percentage: 27.4,
      isLoss: true,
      invoice: '4',
      color: theme.palette.error,
      chartData: [100, 550, 200, 300, 100, 200, 300]
    }
  ];

  return (
    <>
      <Grid container direction={matchDownSM ? 'column' : 'row'} spacing={2} sx={{ pb: 2 }}>
        <Grid item md={8}>
          <Grid container direction="row" spacing={2}>
            {widgetsData.map((widget: BillWidgets, index: number) => (
              <Grid item sm={4} xs={12} key={index}>
                <MainCard>
                  <InvoiceCard
                    title={widget.title}
                    count={'\u20B9' + widget.count}
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
                      95.1k
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
              &#x20B9;43,078
            </Typography>
            <Box sx={{ maxWidth: '100%' }}>
              <LinearWithLabel value={50} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <MainCard content={false}>
        <ScrollX>
          <ReactTable columns={columns} data={bill} />
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

export default Bills;
