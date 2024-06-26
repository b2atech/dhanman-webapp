import { useEffect, useMemo, useState, Fragment, MouseEvent, useRef } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';

import {
  Button,
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
  Box
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

import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { getAllAccountGroups } from 'api/services/CommonService';
import { IaccountGroup } from 'types/accountgroup';
import moment from 'moment';
import { useSticky } from 'react-table-sticky';
import { useNavigate } from 'react-router';
import config from 'config';

// ==================================================|| REACT TABLE ||========================================================//

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
  data: IaccountGroup[];
  handleAdd: () => void;
  getHeaderProps: (column: HeaderGroup) => {};
  showIdColumn: boolean;
  handleSwitchChange: () => void;
  handleAuditColumnSwitchChange: () => void;
}

function ReactTable({ columns, data, handleAdd, getHeaderProps, showIdColumn, handleAuditColumnSwitchChange }: Props) {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 100,
      width: 200,
      maxWidth: 300,
      margin: 20
    }),
    []
  );
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'orderSequence', desc: false };
  const navigation = useNavigate();
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
      defaultColumn,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 1000,
        hiddenColumns: ['isMainGroup', 'orderSequence', 'level'],
        sortBy: [sortBy]
      }
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
  const now = new Date();
  const formatedFilename = 'AccountGroupsList ' + moment(now).format('YYYY-MM-DD_HH-mm-ss');
  const [isAccountGroupIdVisible, setIsAccountGroupIdVisible] = useState(false);
  const [isAuditSwitchOn, setIsAuditSwitchOn] = useState(false);

  const handleSwitchChange = () => {
    setIsAccountGroupIdVisible((prevIsAccountGroupIdVisible) => !prevIsAccountGroupIdVisible);
  };

  const handleAuditSwitchChange = () => {
    setIsAuditSwitchOn((prevAuditVisible) => !prevAuditVisible);
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
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={(e: any) => {
                e.stopPropagation();
                navigation(`/company/accountgroup/add`);
              }}
              size="small"
            >
              Add Account Group
            </Button>
            <CSVExport
              data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d: Row) => d.original) : data}
              filename={formatedFilename}
            />
            <Tooltip title={isAccountGroupIdVisible ? 'Hide ID' : 'Show ID'}>
              <FormControlLabel
                value=""
                control={<Switch color="success" checked={isAccountGroupIdVisible} onChange={handleSwitchChange} />}
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
        <Box ref={componentRef}>
          <TableWrapper>
            <Table {...getTableProps()} stickyHeader>
              <TableHead>
                {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                    {headerGroup.headers.map((column: HeaderGroup) => {
                      if (
                        (column.id === 'id' && !isAccountGroupIdVisible) ||
                        (column.id === 'createdOnUtc' && !isAuditSwitchOn) ||
                        (column.id === 'createdBy' && !isAuditSwitchOn) ||
                        (column.id === 'modifiedOnUtc' && !isAuditSwitchOn) ||
                        (column.id === 'modifiedBy' && !isAuditSwitchOn)
                      ) {
                        return null;
                      }
                      return (
                        <TableCell sx={{ position: 'sticky !important' }} {...column.getHeaderProps([{ className: column.className }])}>
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
                          if (
                            (cell.column.id === 'id' && !isAccountGroupIdVisible) ||
                            (cell.column.id === 'createdOnUtc' && !isAuditSwitchOn) ||
                            (cell.column.id === 'createdBy' && !isAuditSwitchOn) ||
                            (cell.column.id === 'modifiedOnUtc' && !isAuditSwitchOn) ||
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
          <Box sx={{ '&:hover': { bgcolor: 'transparent !important' }, p: 2, py: 1 }}>
            <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
          </Box>
        </Box>
      </Stack>
    </>
  );
}

// ==============================|| Account Group - LIST ||============================== //

const AccountGroups = () => {
  const theme = useTheme();
  const [accountgroup, setAccountGroup] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);
  const [accountgroups, setAccountGroups] = useState<IaccountGroup[]>([]);
  const [showIdColumn, setShowIdColumn] = useState(false);
  const [showCreatedOnColumn, setshowCreatedOnColumn] = useState(false);
  const [loading, setLoading] = useState(true);
  const companyId: string = String(config.companyId);
  const handleSwitchChange = () => {
    setShowIdColumn(!showIdColumn);
  };

  const handleAuditColumnSwitchChange = () => {
    setshowCreatedOnColumn(!showCreatedOnColumn);
  };

  useEffect(() => {
    getAllAccountGroups(companyId)
      .then((accountGroupList) => {
        if (Array.isArray(accountGroupList)) {
          setAccountGroups(accountGroupList);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [companyId]);

  const memoizedAccountGroups = useMemo(() => accountgroups, [accountgroups]);

  const handleAdd = () => {
    setAdd(!add);
    if (accountgroup && !add) {
      setAccountGroup(null);
    }
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
        disableSortBy: true
      },
      {
        Header: 'ID',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value }: { value: string }) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>
      },
      {
        Header: 'Account Code',
        accessor: 'code'
      },
      {
        Header: ' Account Group Name',
        accessor: 'name',
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="subtitle1">
                {' '}
                <span style={{ whiteSpace: 'pre-wrap' }}>{values.name}</span>
              </Typography>
            </Stack>
          );
        }
      },
      {
        Header: 'Group Code',
        accessor: 'groupCode'
      },
      {
        Header: 'Top Group',
        accessor: 'topGroupCode'
      },
      {
        Header: 'Parent Group Code',
        accessor: 'parentGroupCode'
      },
      {
        Header: 'Schedule',
        accessor: 'schedule'
      },
      {
        Header: 'Order Sequence',
        accessor: 'orderSequence'
      },
      {
        Header: 'Level',
        accessor: 'level'
      },
      {
        Header: 'Actions',
        className: 'cell-left',
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
                    setAccountGroup(row.values);
                    handleAdd();
                  }}
                >
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
      },
      {
        Header: 'Is Main Group',
        accessor: 'isMainGroup',
        disableSortBy: true
      },
      {
        Header: 'Modified On',
        accessor: 'modifiedOnUtc',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>
      },

      {
        Header: 'Created By',
        accessor: 'createdBy',
        Cell: ({ value }: { value: string }) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>,
        disableSortBy: true
      },
      {
        Header: 'Created On',
        accessor: 'createdOnUtc',
        Cell: (props: CellProps<{}, any>) => <div style={{ whiteSpace: 'nowrap' }}>{moment(props.value).format('DD MMM YYYY')}</div>,
        disableSortBy: true
      },
      {
        Header: 'Modified By',
        accessor: 'modifiedBy',
        Cell: ({ value }: { value: string }) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>,
        disableSortBy: true
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
          <Typography variant="body1" style={{ marginTop: '16px' }}>
            Loading, please wait...
          </Typography>
        </Box>
      ) : (
        <ScrollX>
          <ReactTable
            columns={columns}
            data={memoizedAccountGroups}
            handleAdd={handleAdd}
            getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
            showIdColumn={showIdColumn}
            handleSwitchChange={handleSwitchChange}
            handleAuditColumnSwitchChange={handleAuditColumnSwitchChange}
          />
        </ScrollX>
      )}
    </MainCard>
  );
};

export default AccountGroups;
