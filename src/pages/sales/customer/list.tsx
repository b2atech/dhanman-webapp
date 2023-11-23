import { useCallback, useEffect, useMemo, useState, FC, Fragment, MouseEvent, useRef } from 'react';

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
  CircularProgress,
  Theme
} from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
import { useSticky } from 'react-table-sticky';
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
import AlertCustomerDelete from '../createinvoice/Customer/AlertCustomerDelete';
import AddCustomer from '../createinvoice/Customer/AddCustomer';
import CustomerDetails from '../createinvoice/Customer/CustomerDetails';
import { getAllCustomers } from 'api/services/SalesService';
import { ICustomer } from 'types/invoice';
import moment from 'moment';

// ==============================|| REACT TABLE ||============================== //
const TableWrapper = styled('div')(({ theme, isAuditSwitchOn }: { theme?: Theme; isAuditSwitchOn: boolean }) => ({
  '.header': {
    position: 'sticky',
    zIndex: 1,
    width: 'fit-content'
  },
  '& th[data-sticky-td]': {
    position: 'sticky',
    zIndex: theme ? theme.zIndex.drawer + 1 : 'auto',
    backgroundColor: theme && theme.palette ? theme.palette.background.paper : 'transparent'
  },
  overflowX: 'auto',
  whiteSpace: 'nowrap'
}));

// const DynamicTableCell = styled(TableCell, {
//   shouldForwardProp: (prop) => prop !== 'isColumnVisible'
// })(({ theme, isSmallScreen, isColumnVisible }: any) => ({
//   position: 'relative',
//   width: isColumnVisible ? 'auto' : 0,
//   overflow: 'hidden',
//   whiteSpace: 'nowrap',
//   textOverflow: 'ellipsis',
//   paddingLeft: '4px',
//   paddingRight: '4px',
//   [theme.breakpoints.down('sm')]: {
//     width: isColumnVisible && isSmallScreen ? 100 : 0
//   }
// }));

interface Props {
  columns: Column[];
  data: ICustomer[];
  handleAdd: () => void;
  renderRowSubComponent: FC<any>;
  getHeaderProps: (column: HeaderGroup) => {};
  showIdColumn: boolean;
  handleSwitchChange: () => void;
  showCreatedOnColumn: boolean;
  handleAuditColumnSwitchChange: () => void;
}

function ReactTable({
  columns,
  data,
  renderRowSubComponent,
  handleAdd,
  getHeaderProps,
  showIdColumn,
  showCreatedOnColumn,
  handleAuditColumnSwitchChange
}: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: '', desc: false };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    setGlobalFilter,
    setSortBy,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['firstName', 'lastName', 'avatar'], sortBy: [sortBy] }
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
  const moment = require('moment');
  const now = new Date();
  const formatedFilename = 'CustomersList' + moment(now).format('YYYY-MM-DD_HH-mm-ss');
  const [isAuditSwitchOn, setIsAuditSwitchOn] = useState(false);
  const [isCustomerIdVisible, setIsCustomerIdVisible] = useState(false);

  const handleSwitchChange = () => {
    setIsCustomerIdVisible((prevIsCustomerIdVisible) => !prevIsCustomerIdVisible);
  };

  const handleAuditSwitchChange = () => {
    setIsAuditSwitchOn((prevAuditVisible) => !prevAuditVisible);
  };

  // const adjustedWidth =
  //   isSmallScreen && (columns.find((column) => column.id === 'createdBy') || columns.find((column) => column.id === 'modifiedBy'))
  //     ? 100
  //     : 200;

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
              Add Customer
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
            <Tooltip title={isAuditSwitchOn ? 'Hide Audit Columns' : 'Show Audit Columns'}>
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
        <Box ref={componentRef} sx={{ overflowX: 'auto' }}>
          <ScrollX sx={{ maxHeight: 400 }}>
            <TableWrapper isAuditSwitchOn={isAuditSwitchOn}>
              <Table {...getTableProps()} stickyHeader>
                <TableHead>
                  {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                      {headerGroup.headers.map((column: HeaderGroup) => {
                        if (
                          (column.id === 'id' && !isCustomerIdVisible) ||
                          (column.id === 'createdOnUtc' && !isAuditSwitchOn) ||
                          (column.id === 'modifiedOnUtc' && !isAuditSwitchOn) ||
                          (column.id === 'createdBy' && !isAuditSwitchOn) ||
                          (column.id === 'modifiedBy' && !isAuditSwitchOn)
                        ) {
                          return null;
                        }

                        // const isColumnVisible = !(
                        //   (column.id === 'createdOnUtc' && !showCreatedOnColumn) ||
                        //   (column.id === 'modifiedOnUtc' && !showCreatedOnColumn) ||
                        //   (column.id === 'createdBy' && !showCreatedOnColumn) ||
                        //   (column.id === 'modifiedBy' && !showCreatedOnColumn)
                        // );

                        // const adjustedWidth = isSmallScreen && (column.id === 'createdBy' || column.id === 'modifiedBy') ? 100 : 200;

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
                    const rowProps = row.getRowProps();

                    return (
                      <Fragment key={row.id}>
                        <TableRow
                          {...row.getRowProps()}
                          onClick={() => {
                            row.toggleRowSelected();
                          }}
                          sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                        >
                          {row.cells.map((cell: Cell) => {
                            if (
                              (cell.column.id === 'id' && !isCustomerIdVisible) ||
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
                        {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns, expanded })}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableWrapper>
          </ScrollX>
          <Box>
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={columns.length}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </Box>
        </Box>
      </Stack>
    </>
  );
}

// ==============================|| CUSTOMER - LIST ||============================== //

const CustomerListPage = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [customerDeleteName, setcustomerDeleteName] = useState<any>('');
  const [customerDeleteId, setCustomerDeleteId] = useState<string>('');
  const [showIdColumn, setShowIdColumn] = useState(false);
  const [showCreatedOnColumn, setshowCreatedOnColumn] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSwitchChange = () => {
    setShowIdColumn(!showIdColumn);
  };

  const handleAuditColumnSwitchChange = () => {
    setshowCreatedOnColumn(!showCreatedOnColumn);
  };

  useEffect(() => {
    getAllCustomers('3fa85f64-5717-4562-b3fc-2c963f66afa6')
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
    if (customer && !add) setCustomer(null);
  };

  const handleClose = (confirmed: boolean) => {
    setOpen(false);
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
        show: false,
        accessor: 'firstName',
        disableSortBy: true,
        width: 20,
        sticky: 'left'
      },
      {
        show: false,
        accessor: 'lastName',
        disableSortBy: true,
        width: 20,
        sticky: 'left'
      },
      {
        Header: 'Customer id',
        accessor: 'id',
        width: -200,
        sticky: 'left'
      },
      {
        Header: 'Customer Name',
        accessor: 'customerName',
        minWidth: 100,
        maxWidth: 200,
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
        Header: 'Contact',
        accessor: 'phoneNumber',
        minWidth: 100,
        maxWidth: 200,
        sticky: 'left',
        Cell: ({ value }: { value: number }) => <PatternFormat displayType="text" format="+91 ##### #####" mask="_" defaultValue={value} />
      },
      {
        Header: 'Email',
        accessor: 'email',
        minWidth: 100,
        maxWidth: 150,
        sticky: 'left'
      },
      {
        Header: 'City',
        accessor: 'city',
        minWidth: 50,
        maxWidth: 100,
        sticky: 'left',
        Cell: ({ value }: { value: any }) => {
          return <div>Jaysingpur</div>;
        }
      },
      {
        Header: 'Actions',
        className: 'cell-right',
        minWidth: 100,
        maxWidth: 200,
        sticky: 'left',
        disableSortBy: true,
        style: { textAlign: 'center' },
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
                    setCustomer(row.values);
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
      },
      {
        Header: 'Created On',
        accessor: 'createdOnUtc',
        minWidth: showCreatedOnColumn ? 120 : 100,
        maxWidth: showCreatedOnColumn ? 150 : 120,
        sticky: 'left',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>
      },
      {
        Header: 'Modified On',
        accessor: 'modifiedOnUtc',
        minWidth: showCreatedOnColumn ? 150 : 100,
        maxWidth: showCreatedOnColumn ? 200 : 150,
        sticky: 'left',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>
      },
      {
        Header: 'Created By',
        accessor: 'createdBy',
        minWidth: showCreatedOnColumn ? 200 : 150,
        maxWidth: showCreatedOnColumn ? 250 : 200,
        sticky: 'left'
      },
      {
        Header: 'Modified By',
        accessor: 'modifiedBy',
        minWidth: showCreatedOnColumn ? 150 : 100,
        maxWidth: showCreatedOnColumn ? 200 : 150,
        sticky: 'left'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const renderRowSubComponent = useCallback(
    ({ row }: { row: Row<{}> }) => <CustomerDetails data={memoizedCustomers[Number(row.id)]} />,

    [memoizedCustomers]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="500px">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" style={{ marginTop: '32x' }}>
              Loading, please wait...
            </Typography>
          </Box>
        ) : (
          <ReactTable
            columns={columns}
            data={memoizedCustomers}
            handleAdd={handleAdd}
            renderRowSubComponent={renderRowSubComponent}
            getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
            showIdColumn={showIdColumn}
            handleSwitchChange={handleSwitchChange}
            handleAuditColumnSwitchChange={handleAuditColumnSwitchChange}
            showCreatedOnColumn={showCreatedOnColumn}
          />
        )}
      </ScrollX>
      <AlertCustomerDelete title={customerDeleteName} open={open} handleClose={handleClose} id={customerDeleteId} />

      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <AddCustomer customer={customer} onCancel={handleAdd} />
      </Dialog>
    </MainCard>
  );
};

export default CustomerListPage;
