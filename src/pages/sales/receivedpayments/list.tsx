import { useEffect, useMemo, useState, Fragment, MouseEvent } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  CircularProgress
} from '@mui/material';

// third-party

import {
  useFilters,
  useExpanded,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
  usePagination,
  Column,
  HeaderGroup,
  Row,
  Cell,
  HeaderProps,
  CellProps
} from 'react-table';
import { useSticky } from 'react-table-sticky';
// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
import {
  CSVExport,
  HeaderSort,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { getAllReceivePayments } from 'api/services/SalesService';
import { ICustomer } from 'types/invoice';
import AlertReceivedPaymentDelete from './AlertReceicedPaymentDelete';
const moment = require('moment');
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
  data: ICustomer[];
  handleAdd: () => void;
  getHeaderProps: (column: HeaderGroup) => {};
  showIdColumn: boolean;
  handleSwitchChange: () => void;
}

function ReactTable({ columns, data, handleAdd, getHeaderProps, showIdColumn }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: '', desc: false };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    allColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, sortBy: [sortBy] },
      hiddenColumns: ['']
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useSticky
  );

  const moment = require('moment');
  const now = new Date();
  const formatedFilename = 'CustomersList' + moment(now).format('YYYY-MM-DD_HH-mm-ss');
  const [isAuditSwitchOn, setIsAuditSwitchOn] = useState(false);
  const [isCustomerIdVisible, setIsCustomerIdVisible] = useState(false);

  const handleSwitchChange = () => {
    setIsCustomerIdVisible((prevIsCustomerIdVisible) => !prevIsCustomerIdVisible);
  };

  const handleAuditSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAuditSwitchOn(event.target.checked);
  };

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            <SortingSelect sortBy={sortBy.id} setSortBy={setSortBy} allColumns={allColumns} />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd} size="small">
              Add Received Payments
            </Button>
            <CSVExport
              data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d: Row) => d.original) : data}
              filename={formatedFilename}
            />
            <Tooltip title={isCustomerIdVisible ? 'Hide ID' : 'Show ID'}>
              <FormControlLabel
                value=""
                control={<Switch color="success" checked={isCustomerIdVisible} onChange={handleSwitchChange} />}
                label=""
                labelPlacement="start"
                sx={{ mr: 0 }}
              />
            </Tooltip>
            <Tooltip title={isAuditSwitchOn ? 'Hide Audit' : 'Show Audit'}>
              <FormControlLabel
                value=""
                control={<Switch color="info" checked={isAuditSwitchOn} onChange={handleAuditSwitchChange} />}
                label=""
                labelPlacement="start"
                sx={{ mr: 0 }}
              />
            </Tooltip>
          </Stack>
        </Stack>

        <ScrollX sx={{ maxHeight: 400, overflowY: 'auto' }}>
          <TableWrapper>
            <Table {...getTableProps()} stickyHeader>
              <TableHead>
                {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                    {headerGroup.headers.map((column: HeaderGroup) => {
                      if (column.id === 'id' && !isCustomerIdVisible) {
                        return null;
                      }
                      return (
                        <TableCell {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}>
                          <HeaderSort column={column} />
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
                        }}
                        sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                      >
                        {row.cells.map((cell: Cell) => {
                          if (cell.column.id === 'id' && !isCustomerIdVisible) {
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
        <Box sx={{ '&:hover': { bgcolor: 'transparent !important' }, p: 2, py: 2 }}>
          <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
        </Box>
      </Stack>
    </>
  );
}

// ==============================|| CUSTOMER - LIST ||============================== //

const List = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [receivedPayment, setReceivedPayment] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [customerDeleteName, setcustomerDeleteName] = useState<any>('');
  const [customerDeleteId, setCustomerDeleteId] = useState<string>('');
  const [showIdColumn, setShowIdColumn] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSwitchChange = () => {
    setShowIdColumn(!showIdColumn);
  };

  useEffect(() => {
    getAllReceivePayments('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((customerList) => {
        if (Array.isArray(customerList)) {
          setCustomers(customerList);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const memoizedCustomers = useMemo(() => customers, [customers]);

  const handleAdd = () => {
    setAdd(!add);
    if (receivedPayment && !add) setReceivedPayment(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        width: 10,
        sticky: 'left',
        Header: ({ getToggleAllPageRowsSelectedProps }: HeaderProps<{}>) => (
          <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
        ),
        accessor: 'selection',
        Cell: ({ row }: any) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        disableSortBy: true
      },
      {
        Header: 'Payments Receive id',
        accessor: 'id',
        width: -200,
        sticky: 'left'
      },
      {
        Header: 'Create Date',
        accessor: 'receivedDate',
        sticky: 'left',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>,
        disableFilters: true
      },
      {
        Header: 'Customer Name',
        accessor: 'customerName',
        width: 200,
        sticky: 'left',
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="subtitle1">{values.customerName}</Typography>
            </Stack>
          );
        }
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        width: 200,
        sticky: 'left'
      },
      {
        Header: 'Description',
        accessor: 'description',
        width: 200,
        sticky: 'left'
      },
      {
        Header: 'Actions',
        className: 'cell-left',
        width: 200,
        sticky: 'left',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          const collapseIcon = row.isExpanded ? (
            <CloseOutlined style={{ color: theme.palette.error.main }} />
          ) : (
            <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
          );
          return (
            <Stack direction="row" alignItems="left" justifyContent="left" spacing={0}>
              <Tooltip title="View">
                <IconButton
                  color="secondary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    row.toggleRowExpanded();
                  }}
                >
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setReceivedPayment(row.values);
                    handleAdd();
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
                    setcustomerDeleteName(row.values.customerName);
                    setCustomerDeleteId(row.values.id);
                    setOpen(true);
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
    [theme]
  );

  return (
    <MainCard content={false}>
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="500px">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body1" style={{ marginTop: '32x' }}>
            Loading, please wait...
          </Typography>
        </Box>
      ) : (
        <ScrollX>
          <ReactTable
            columns={columns}
            data={memoizedCustomers}
            handleAdd={handleAdd}
            getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
            showIdColumn={showIdColumn}
            handleSwitchChange={handleSwitchChange}
          />
        </ScrollX>
      )}

      <AlertReceivedPaymentDelete title={customerDeleteName} open={open} handleClose={handleClose} id={customerDeleteId} />

      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      ></Dialog>
    </MainCard>
  );
};

export default List;
