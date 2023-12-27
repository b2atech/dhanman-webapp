import { useMemo, useEffect, Fragment, useState, useRef, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import * as invoiceStataus from 'constants/InvoiceStatus';

// material-ui
import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Tabs,
  Tab,
  Grid,
  Typography,
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
  Chip,
  styled,
  Button,
  CircularProgress
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { openDrawer } from 'store/reducers/menu';
import { dispatch, useDispatch } from 'store';

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
import { DeleteTwoTone, EditTwoTone, FileDoneOutlined, InfoCircleOutlined } from '@ant-design/icons';

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

import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';
import { NumericFormat } from 'react-number-format';

// types
import { IInvoiceList, IStatus, IUpdateInvoiceNextStatus, IUpdateInvoicePreviousStatus } from 'types/invoice';
import AlertInvoiceDelete from 'sections/apps/invoice/AlertInvoiceDelete';
import { getAllInvoices, getAllStatus, updateNextStatus, updatePreviousStatuses } from 'api/services/SalesService';
import Avatar from 'types/Avatar';
import InvoiceCard from 'components/cards/invoice/InvoiceCard';
import InvoiceChart from 'components/cards/invoice/InvoiceChart';
import { PaletteColor } from '@mui/material';
import { Link } from 'react-router-dom';
import { openSnackbar } from 'store/reducers/snackbar';
import config from 'config';

const moment = require('moment');
const companyId: string = String(config.companyId);
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
  data: IInvoiceList[];
  statuses: IStatus[];
  getHeaderProps: (column: HeaderGroup) => {};
  showIdColumn: boolean;
  handleSwitchChange: () => void;
  handleAuditColumnSwitchChange: () => void;
}

function ReactTable({ columns: userColumns, data, statuses, getHeaderProps, handleAuditColumnSwitchChange }: Props) {
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
    useRowSelect,
    useSticky
  );

  const componentRef: React.Ref<HTMLDivElement> = useRef(null);

  // =============================================== Tab ================================================================
  const groups = [{ id: 0, status: 'All', statusId: 0 }];

  const uniqueStatusSet = new Set();

  for (const item of data) {
    if (!uniqueStatusSet.has(item.invoiceStatusId)) {
      groups.push({
        id: item.invoiceStatusId,
        status: item.invoiceStatus,
        statusId: item.invoiceStatusId
      });
      uniqueStatusSet.add(item.invoiceStatusId);
    }
  }
  groups.sort((a, b) => a.id - b.id);

  const countGroup = data.map((item: IInvoiceList) => item.invoiceStatus);
  const counts = countGroup.reduce(
    (acc: any, value: any) => ({
      ...acc,
      [value]: (acc[value] || 0) + 1
    }),
    {}
  );

  const [selectedInvoiceIDs, setSelectedInvoiceIds] = useState<string[]>([]);
  const [isInvoiceIdVisible, setIsInvoiceIdVisible] = useState(false);
  const [isAuditSwitchOn, setIsAuditSwitchOn] = useState(false);
  const navigation = useNavigate();

  const handleSwitchChange = () => {
    setIsInvoiceIdVisible((prevIsInvoiceIdVisible) => !prevIsInvoiceIdVisible);
  };

  const handleAuditSwitchChange = () => {
    setIsAuditSwitchOn((prevAuditVisible) => !prevAuditVisible);
  };

  const updateInvoiceDraftStatus = async () => {
    const updateInvoiceStatusData: IUpdateInvoiceNextStatus = {
      invoiceIds: selectedInvoiceIDs,
      companyId: companyId
    };
    try {
      await updateNextStatus(updateInvoiceStatusData);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Invoice Status updated successfully',
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

  const updateInvoiceRejectStatuses = async () => {
    const updateInvoiceStatusData: IUpdateInvoicePreviousStatus = {
      invoiceIds: selectedInvoiceIDs,
      companyId: companyId
    };
    try {
      await updatePreviousStatuses(updateInvoiceStatusData);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Invoice Status updated successfully',
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

  const updateInvoiceCancelStatuses = async () => {
    const updateInvoiceStatusData: IUpdateInvoicePreviousStatus = {
      invoiceIds: selectedInvoiceIDs,
      companyId: companyId
    };
    try {
      await updatePreviousStatuses(updateInvoiceStatusData);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Invoice Status updated successfully',
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

  const updateInvoiceApproveStatus = async () => {
    const updateInvoiceStatusData: IUpdateInvoiceNextStatus = {
      invoiceIds: selectedInvoiceIDs,
      companyId: companyId
    };
    try {
      await updateNextStatus(updateInvoiceStatusData);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Invoice Status updated successfully',
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
    const selectedInvoiceStatus = selectedStatus;

    // Find the selected status object from the statuses list
    const selectedStatusObject = statuses.find((status) => status.status === selectedInvoiceStatus);
    switch (selectedStatusObject?.nextStatus) {
      case invoiceStataus.PENDING_APPROVAL:
        buttons.push(
          <Button
            key="sendForApproval"
            variant="contained"
            color="primary"
            onClick={() => updateInvoiceDraftStatus()}
            style={{ marginRight: '10px' }}
          >
            Send for Approval
          </Button>
        );
        break;
      case invoiceStataus.APPROVED:
        buttons.push(
          <>
            <Button
              key="approve"
              variant="contained"
              color="primary"
              onClick={() => updateInvoiceApproveStatus()}
              style={{ marginRight: '10px' }}
            >
              Approve
            </Button>
          </>
        );
        break;
      case invoiceStataus.PARTIALLY_PAID:
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
      case invoiceStataus.PAID:
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
      case invoiceStataus.CANCELLED:
        buttons.push(
          <Button
            key="cancelled"
            variant="contained"
            color="error"
            onClick={() => updateInvoiceCancelStatuses()}
            style={{ marginRight: '10px' }}
          >
            Cancel
          </Button>
        );
        break;
      case invoiceStataus.REJECTED:
        buttons.push(
          <Button
            key="reject"
            variant="contained"
            color="error"
            style={{ marginRight: '10px' }}
            onClick={() => updateInvoiceRejectStatuses()}
          >
            Reject
          </Button>
        );
        break;
    }
    return buttons;
  };

  useEffect(() => {
    setFilter('invoiceStatusId', selectedStatus === 0 ? '' : selectedStatus);
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
                  label={status === 'All' ? data.length : counts.hasOwnProperty(status) ? counts[status] : invoiceStataus.ALL}
                  color={
                    statusId === invoiceStataus.ALL
                      ? 'primary'
                      : statusId === invoiceStataus.DRAFT || statusId === invoiceStataus.PENDING_APPROVAL
                      ? 'info'
                      : statusId === invoiceStataus.APPROVED ||
                        statusId === invoiceStataus.PARTIALLY_PAID ||
                        statusId === invoiceStataus.PAID
                      ? 'success'
                      : statusId === invoiceStataus.REJECTED
                      ? 'error'
                      : statusId === invoiceStataus.CANCELLED
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
            <TableRowSelection selected={Object.keys(selectedRowIds).length} />
            <CSVExport data={data} filename={'invoice-list.csv'} />
            <Tooltip title={isInvoiceIdVisible ? 'Hide ID' : 'Show ID'}>
              <FormControlLabel
                value=""
                control={<Switch color="success" checked={isInvoiceIdVisible} onChange={handleSwitchChange} />}
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
        <ScrollX sx={{ maxHeight: 500 }}>
          <TableWrapper>
            <Table {...getTableProps()} stickyHeader>
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                    {headerGroup.headers.map((column: HeaderGroup<{}>) => {
                      if (
                        (column.id === 'id' && !isInvoiceIdVisible) ||
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
                        sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                        onClick={() => {
                          row.toggleRowSelected();
                          setTimeout(() => {
                            if (row.isSelected) {
                              setSelectedInvoiceIds((prevIds: string[]) => [...prevIds, row.values.id]);
                            } else {
                              setSelectedInvoiceIds((prevIds: string[]) => prevIds.filter((id) => id !== row.values.id));
                            }
                          }, 0);
                        }}
                      >
                        {row.cells.map((cell: Cell) => {
                          if (
                            (cell.column.id === 'id' && !isInvoiceIdVisible) ||
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

// ==============================|| INVOICE - LIST ||============================== //

const List = () => {
  const [invoice, setList] = useState<IInvoiceList[]>([]);
  const [statuses, setStatuses] = useState<IStatus[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [getInvoiceName, setGetInvoiceName] = useState<any>('');
  const [showIdColumn, setShowIdColumn] = useState(false);
  const [showCreatedOnColumn, setshowCreatedOnColumn] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  dispatch(openDrawer(false));

  const handleSwitchChange = () => {
    setShowIdColumn(!showIdColumn);
  };

  const handleAuditColumnSwitchChange = () => {
    setshowCreatedOnColumn(!showCreatedOnColumn);
  };

  const getAllInvoicesRelatedRequests = async () => {
    try {
      const [invoices, statuses] = await Promise.all([getAllInvoices(companyId), getAllStatus(companyId)]);

      if (Array.isArray(invoices) && Array.isArray(statuses)) {
        setList(invoices);
        setStatuses(statuses);
        setLoading(false);
      } else {
        console.error('API response is not an array:', invoices, statuses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAllInvoicesRelatedRequests();
  }, []);

  const navigation = useNavigate();

  const handleClose = () => {
    setOpen(!open);
  };

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
        Header: 'Invoice ID',
        accessor: 'id',
        disableFilters: true,
        Cell: ({ value }: { value: string }) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>,
        disableSortBy: true
      },
      {
        Header: 'Invoice Number',
        accessor: 'invoiceNumber',
        disableFilters: true,
        Cell: ({ row }: { row: Row<{}> }) => (
          <Link to={`/sales/invoices/details/${row.values.id}`} style={{ whiteSpace: 'nowrap' }}>
            {row.values.invoiceNumber}
          </Link>
        )
      },
      {
        Header: 'Customer Name',
        accessor: 'customerName',
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="subtitle1">
                {' '}
                <span style={{ whiteSpace: 'nowrap' }}>{values.customerName}</span>
              </Typography>
            </Stack>
          );
        },
        disableFilters: true
      },
      {
        Header: 'Create Date',
        accessor: 'invoiceDate',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>,
        disableFilters: true
      },
      {
        Header: 'Due Date',
        accessor: 'dueDate',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>,
        disableFilters: true
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
        accessor: 'invoiceStatusId',
        disableFilters: true,
        Filter: ({ column }: { column: any }) => <>{column.render('Filter')}</>,
        Cell: ({ value }: { value: number }) => {
          switch (value) {
            case invoiceStataus.DRAFT:
              return <Chip color="primary" label="Draft" size="small" variant="light" />;
            case invoiceStataus.PENDING_APPROVAL:
              return <Chip color="secondary" label="Pending Approval" size="small" variant="light" />;
            case invoiceStataus.APPROVED:
              return <Chip color="success" label="Approval" size="small" variant="light" />;
            case invoiceStataus.PARTIALLY_PAID:
              return <Chip color="success" label="Partially Paid" size="small" variant="light" />;
            case invoiceStataus.PAID:
              return <Chip color="success" label="Paid" size="small" variant="light" />;
            case invoiceStataus.REJECTED:
              return <Chip color="error" label="Rejected" size="small" variant="light" />;
            case invoiceStataus.CANCELLED:
              return <Chip color="error" label="Cancelled" size="small" variant="light" />;
            default:
              return <Chip color="warning" label={value} size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Actions',
        className: '',
        style: { textAlign: 'center' },
        disableSortBy: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          return (
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    navigation(`/sales/invoices/edit/${row.values.id}`);
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
                    setGetInvoiceName(row.values.customerName);
                    setInvoiceId(row.values.id);
                    setOpen(true);
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
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Modified On',
        accessor: 'modifiedOnUtc',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>,
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Created By',
        accessor: 'createdBy',
        Cell: ({ value }: { value: string }) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>,
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: 'Modified By',
        accessor: 'modifiedBy',
        disableSortBy: true,
        disableFilters: true
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
          {loading ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="500px">
              <CircularProgress size={0} thickness={4} />
              <Typography variant="body1" style={{ marginTop: '32x' }}>
                Loading, please wait...
              </Typography>
            </Box>
          ) : (
            <ReactTable
              columns={columns}
              data={invoice}
              statuses={statuses || []}
              getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
              showIdColumn={showIdColumn}
              handleSwitchChange={handleSwitchChange}
              handleAuditColumnSwitchChange={handleAuditColumnSwitchChange}
            />
          )}
        </ScrollX>
      </MainCard>
      <AlertInvoiceDelete title={getInvoiceName} open={open} handleClose={handleClose} id={invoiceId} />
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
