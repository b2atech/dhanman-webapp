import { useMemo, useEffect, Fragment, useState, useRef, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import * as billStataus from 'constants/billStatus';

// material-ui
import {
  Box,
  Chip,
  Tabs,
  Tab,
  FormControlLabel,
  Stack,
  Switch,
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
  Grid,
  styled,
  Button,
  CircularProgress
} from '@mui/material';

// third-party
import { useSticky } from 'react-table-sticky';
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
import { DeleteTwoTone, EditTwoTone, FileDoneOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';

// project import
import InvoiceCard from 'components/cards/invoice/InvoiceCard';
import InvoiceChart from 'components/cards/invoice/InvoiceChart';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import AlertBillDelete from 'sections/apps/bill/AlertBillDelete';
import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

import { GlobalFilter, renderFilterTypes, DateColumnFilter } from 'utils/react-table';
import { IBill, IBillStatus, IUpdateBillNextStatus, IUpdateBillPreviousStatus } from 'types/bill';
import { alpha, useTheme } from '@mui/material/styles';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import { getAllBills, getAllStatus, updateBillNextStatus, updateBillPreviousStatuse } from 'api/services/BillService';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import config from 'config';

const moment = require('moment');
const companyId: string = String(config.companyId);
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
const TableWrapper = styled('div')(({ theme }) => ({
  '.header': {
    position: 'sticky',
    zIndex: 1,
    width: 'fit-content'
  },
  '& th[data-sticky-td]': {
    position: 'sticky',
    zIndex: '5 !important'
  }
}));
interface Props {
  columns: Column[];
  data: IBill[];
  statuses: IBillStatus[];
  getHeaderProps: (column: HeaderGroup) => {};
  handleSwitchChange: () => void;
  handleAuditColumnSwitchChange: () => void;
}

function ReactTable({ columns, data, getHeaderProps, statuses }: Props) {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 80,
      width: 200,
      maxWidth: 400,
      margin: 20,
      Filter: DateColumnFilter
    }),
    []
  );
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const sortBy = { id: 'vendorName', desc: false };
  const navigation = useNavigate();
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
    allColumns,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter,
    setSortBy
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
    useRowSelect,
    useSticky
  );

  const componentRef: React.Ref<HTMLDivElement> = useRef(null);
  // =============================================== Tab ================================================================

  const selectedBillRowIds: string[] = [];
  const groups = [{ id: 0, status: 'All', statusId: billStataus.ALL }];
  const uniqueStatusSet = new Set();
  const [selectedBillIDs, setSelectedBillIds] = useState<string[]>([]);
  const [isBillIdVisible, setIsBillIdVisible] = useState(false);
  const [isAuditSwitchOn, setIsAuditSwitchOn] = useState(false);

  for (const item of data) {
    if (!uniqueStatusSet.has(item.billStatusId)) {
      groups.push({
        id: item.billStatusId,
        status: item.billStatus,
        statusId: item.billStatusId
      });
      uniqueStatusSet.add(item.billStatusId);
    }
  }
  groups.sort((a, b) => a.id - b.id);

  const countGroup = data.map((item: IBill) => item.billStatus);
  const counts = countGroup.reduce(
    (acc: any, value: any) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const handleSwitchChange = () => {
    setIsBillIdVisible((prevIsBillIdVisible) => !prevIsBillIdVisible);
  };

  const handleAuditSwitchChange = () => {
    setIsAuditSwitchOn((prevAuditVisible) => !prevAuditVisible);
  };

  const updateBillDraftStatus = async () => {
    const updateNextStatus: IUpdateBillNextStatus = {
      billIds: selectedBillIDs,
      companyId: companyId
    };
    try {
      await updateBillNextStatus(updateNextStatus);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Bill Status updated successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    } catch (error) {
      console.error(error);
    }
    window.location.reload();
  };

  const updateBillRejectStatuses = async () => {
    const updatePreviousStatus: IUpdateBillPreviousStatus = {
      billIds: selectedBillIDs,
      companyId: companyId
    };
    try {
      await updateBillPreviousStatuse(updatePreviousStatus);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Bill Status updated successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    } catch (error) {
      console.error(error);
    }
    window.location.reload();
  };
  const updateBillCancelStatuses = async () => {
    const updatePreviousStatus: IUpdateBillPreviousStatus = {
      billIds: selectedBillIDs,
      companyId: companyId
    };
    try {
      await updateBillPreviousStatuse(updatePreviousStatus);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Bill Status updated successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    } catch (error) {
      console.error(error);
    }
    window.location.reload();
  };

  const updateBillApproveStatus = async () => {
    const updateNextStatus: IUpdateBillNextStatus = {
      billIds: selectedBillIDs,
      companyId: companyId
    };
    try {
      await updateBillNextStatus(updateNextStatus);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Bill Status updated successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    } catch (error) {
      console.error(error);
    }
    window.location.reload();
  };
  const [selectedStatus, setSelectedStatus] = useState<number>(0);
  const updateStatusButtons = () => {
    const buttons: React.ReactNode[] = [];
    const selectedBillStatus = selectedStatus;

    const selectedStatusObject = statuses.find((status) => status.status === selectedBillStatus);
    switch (selectedStatusObject?.nextStatus) {
      case billStataus.PENDING_APPROVAL:
        buttons.push(
          <Button
            key="sendForApproval"
            variant="contained"
            color="primary"
            onClick={() => updateBillDraftStatus()}
            style={{ marginRight: '10px' }}
          >
            Send for Approval
          </Button>
        );
        break;
      case billStataus.APPROVED:
        buttons.push(
          <>
            <Button
              key="approve"
              variant="contained"
              color="primary"
              onClick={() => updateBillApproveStatus()}
              style={{ marginRight: '10px' }}
            >
              Approve
            </Button>
          </>
        );
        break;
      case billStataus.PARTIALLY_PAID:
        buttons.push(
          <Button
            key="payNow"
            variant="contained"
            color="primary"
            onClick={() => navigation('/sales/payments/add')}
            style={{ marginRight: '10px' }}
          >
            Pay Now
          </Button>
        );
        break;
      case billStataus.PAID:
        buttons.push(
          <Button
            key="payNow"
            variant="contained"
            color="primary"
            onClick={() => navigation('/sales/payments/add')}
            style={{ marginRight: '10px' }}
          >
            Pay Now
          </Button>
        );
        break;
    }
    switch (selectedStatusObject?.previousStatus) {
      case billStataus.CANCELLED:
        buttons.push(
          <Button
            key="cancelled"
            variant="contained"
            color="error"
            onClick={() => updateBillCancelStatuses()}
            style={{ marginRight: '10px' }}
          >
            Cancel
          </Button>
        );
        break;
      case billStataus.REJECTED:
        buttons.push(
          <Button key="reject" variant="contained" color="error" style={{ marginRight: '10px' }} onClick={() => updateBillRejectStatuses()}>
            Reject
          </Button>
        );
        break;
    }
    return buttons;
  };

  useEffect(() => {
    setFilter('billStatusId', selectedStatus === billStataus.ALL ? '' : selectedStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);
  return (
    <>
      <Box sx={{ p: 3, pb: 0, width: '100%' }}>
        <Tabs
          value={selectedStatus}
          onChange={(e: ChangeEvent<{}>, value: number) => setSelectedStatus(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {groups.map(({ id, status, statusId }) => (
            <Tab
              key={id}
              label={status}
              value={statusId}
              icon={
                <Chip
                  label={status === 'All' ? data.length : counts.hasOwnProperty(status) ? counts[status] : billStataus.ALL}
                  color={
                    statusId === billStataus.ALL
                      ? 'primary'
                      : statusId === billStataus.DRAFT || statusId === billStataus.PENDING_APPROVAL
                      ? 'info'
                      : statusId === billStataus.APPROVED || statusId === billStataus.PARTIALLY_PAID || statusId === billStataus.PAID
                      ? 'success'
                      : statusId === billStataus.REJECTED
                      ? 'error'
                      : statusId === billStataus.CANCELLED
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
            size="medium"
          />
        </Stack>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="right" justifyContent="right" spacing={matchDownSM ? 1 : 2}>
          {headerGroups.map((group: HeaderGroup<{}>, index: number) => (
            <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} {...group.getHeaderGroupProps()}>
              {group.headers.map((column: HeaderGroup<{}>) => (
                <Box {...column.getHeaderProps([{ className: column.className }])}>{column.canFilter ? column.render('Filter') : null}</Box>
              ))}
            </Stack>
          ))}
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            {updateStatusButtons()}
            <SortingSelect sortBy={sortBy.id} setSortBy={setSortBy} allColumns={allColumns} />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => navigation('/purchase/bills/create')} size="small">
              Add Bill
            </Button>
            <TableRowSelection selected={Object.keys(selectedRowIds).length} />
            <CSVExport data={data} filename={'invoice-list.csv'} />
            <Tooltip title={isBillIdVisible ? 'Hide ID' : 'Show ID'}>
              <FormControlLabel
                value=""
                control={<Switch color="success" checked={isBillIdVisible} onChange={handleSwitchChange} />}
                label=""
                labelPlacement="start"
                sx={{ margin: '0', padding: '0', marginRight: 0 }}
              />
            </Tooltip>
            <Tooltip title={isAuditSwitchOn ? 'Hide Audit' : 'Show Audit'}>
              <FormControlLabel
                value=""
                control={<Switch color="info" checked={isAuditSwitchOn} onChange={handleAuditSwitchChange} />}
                label=""
                labelPlacement="start"
                sx={{ margin: '0', padding: '0', marginRight: 0 }}
              />
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
      <Box ref={componentRef}>
        <ScrollX sx={{ maxHeight: 400, overflowY: 'auto' }}>
          <TableWrapper>
            <Table {...getTableProps()} stickyHeader>
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                    {headerGroup.headers.map((column: HeaderGroup) => {
                      if (
                        (column.id === 'id' && !isBillIdVisible) ||
                        (column.id === 'createdOnUtc' && !isAuditSwitchOn) ||
                        (column.id === 'modifiedOnUtc' && !isAuditSwitchOn) ||
                        (column.id === 'createdBy' && !isAuditSwitchOn) ||
                        (column.id === 'modifiedBy' && !isAuditSwitchOn)
                      ) {
                        return null;
                      }
                      return (
                        <TableCell
                          sx={{ position: 'sticky !important' }}
                          {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}
                        >
                          <HeaderSort column={column} sort />
                        </TableCell>
                      );
                    })}
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
                          setTimeout(() => {
                            if (row.isSelected) {
                              setSelectedBillIds((prevIds: string[]) => [...prevIds, row.values.id]);
                              selectedBillRowIds.push(row.values.id);
                            } else {
                              setSelectedBillIds((prevIds: string[]) => prevIds.filter((id) => id !== row.values.id));
                            }
                          }, 0);
                        }}
                        sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                      >
                        {row.cells.map((cell: Cell) => {
                          if (
                            (cell.column.id === 'id' && !isBillIdVisible) ||
                            (cell.column.id === 'createdOnUtc' && !isAuditSwitchOn) ||
                            (cell.column.id === 'modifiedOnUtc' && !isAuditSwitchOn) ||
                            (cell.column.id === 'createdBy' && !isAuditSwitchOn) ||
                            (cell.column.id === 'modifiedBy' && !isAuditSwitchOn)
                          ) {
                            return null;
                          }
                          return (
                            <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                          );
                        })}
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableWrapper>
        </ScrollX>
        <Box>
          <Box sx={{ '&:hover': { bgcolor: 'transparent !important' }, p: 2, py: 1 }}>
            <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

// ==============================|| BILL - LIST ||============================== //

const Bills = () => {
  const [bill, setBills] = useState([] as IBill[]);
  const [statuses, setStatuses] = useState<IBillStatus[]>();
  const theme = useTheme();
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [billId, setBillId] = useState<string>('');
  const [getBillName, setGetBillName] = useState<any>('');
  const [open, setOpen] = useState<boolean>(false);
  const [showIdColumn, setShowIdColumn] = useState(false);
  const [showCreatedOnColumn, setshowCreatedOnColumn] = useState(false);

  const handleSwitchChange = () => {
    setShowIdColumn(!showIdColumn);
  };

  const handleAuditColumnSwitchChange = () => {
    setshowCreatedOnColumn(!showCreatedOnColumn);
  };
  const getAllBillRelatedRequests = async () => {
    try {
      const [bill, statuses] = await Promise.all([getAllBills(companyId), getAllStatus(companyId)]);

      if (Array.isArray(bill) && Array.isArray(statuses)) {
        setBills(bill);
        setStatuses(statuses);
        setLoading(false);
      } else {
        console.error('API response is not an array:', bill, statuses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAllBillRelatedRequests();
  }, []);

  const handleClose = () => {
    setOpen(!open);
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
          Header: 'Bill ID',
          accessor: 'id',
          Cell: ({ value }: { value: string }) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>,
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
          disableFilters: true,
          Cell: ({ value, row }: { value: string; row: Row }) => (
            <Tooltip title="View Bill" arrow>
              <span style={{ whiteSpace: 'nowrap' }}>
                <Button component={Link} to={`/purchase/bills/details/${row.values.id}`} color="info" size="small">
                  {value}
                </Button>
              </span>
            </Tooltip>
          )
        },
        {
          Header: 'Vendor Name',
          accessor: 'vendorName',
          disableFilters: true
        },
        {
          Header: 'Status',
          accessor: 'billStatusId',
          className: 'cell-left',
          disableFilters: true,
          Filter: ({ column }) => <>{column.render('Filter')}</>,
          Cell: ({ value }: { value: number }) => {
            switch (value) {
              case billStataus.DRAFT:
                return <Chip color="primary" label="Draft" size="small" variant="light" />;
              case billStataus.PENDING_APPROVAL:
                return <Chip color="secondary" label="Pending Approval" size="small" variant="light" />;
              case billStataus.APPROVED:
                return <Chip color="success" label="Approval" size="small" variant="light" />;
              case billStataus.PARTIALLY_PAID:
                return <Chip color="success" label="Partially Paid" size="small" variant="light" />;
              case billStataus.PAID:
                return <Chip color="success" label="Paid" size="small" variant="light" />;
              case billStataus.REJECTED:
                return <Chip color="error" label="Rejected" size="small" variant="light" />;
              case billStataus.CANCELLED:
                return <Chip color="error" label="Cancelled" size="small" variant="light" />;
              default:
                return <Chip color="warning" label={value} size="small" variant="light" />;
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
          accessor: 'totalAmount',
          Cell: ({ value }: { value: number }) => (
            <div style={{ textAlign: 'right' }}>
              <NumericFormat value={value} displayType="text" thousandSeparator={true} prefix={'₹'} decimalScale={2} />
            </div>
          ),
          disableFilters: true
        },
        {
          Header: 'Tax',
          accessor: 'tax',
          className: 'cell-center',
          Cell: ({ value }) => <>{value}%</>,
          disableFilters: true
        },
        {
          Header: 'Payment Term',
          accessor: 'paymentTerm',
          className: 'cell-center',
          Cell: ({ value }) => <>{value} D</>,
          disableFilters: true
        },
        {
          Header: 'Actions',
          disableSortBy: true,
          Cell: ({ row }: { row: Row<{}> }) => {
            return (
              <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      navigation(`/purchase/bills/edit/${row.values.id}`);
                    }}
                  >
                    <EditTwoTone twoToneColor={theme.palette.primary.main} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setGetBillName(row.values.vendorName);
                      setBillId(row.values.id);
                      handleClose();
                    }}
                  >
                    <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          }
        },
        {
          Header: 'Created On',
          accessor: 'createdOnUtc',
          Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>,
          disableFilters: true
        },
        {
          Header: 'Modified On',
          accessor: 'modifiedOnUtc',
          Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>,
          disableFilters: true
        },
        {
          Header: 'Created By',
          accessor: 'createdBy',
          Cell: ({ value }: { value: string }) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>,
          disableFilters: true
        },
        {
          Header: 'Modified By',
          accessor: 'modifiedBy',
          disableFilters: true
        }
      ] as Column[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="500px">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" style={{ marginTop: '16px' }}>
              Loading, please wait...
            </Typography>
          </Box>
        ) : (
          <ScrollX>
            <ReactTable
              columns={columns}
              data={bill}
              statuses={statuses || []}
              getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
              handleSwitchChange={handleSwitchChange}
              handleAuditColumnSwitchChange={handleAuditColumnSwitchChange}
            />
          </ScrollX>
        )}
      </MainCard>

      <AlertBillDelete title={getBillName} open={open} handleClose={handleClose} id={billId} />
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
