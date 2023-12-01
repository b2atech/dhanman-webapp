/* eslint-disable prettier/prettier */
import { useCallback, useEffect, useMemo, useState, FC, Fragment, MouseEvent } from 'react';

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

import ProductDetails from './details';
import AlertProductDelete from './alertProductDelete';
import { InventoryData } from 'types/inventoryInfo';
import { getAllProducts } from 'api/services/InventoryService';

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

const moment = require('moment');
interface Props {
  columns: Column[];
  data: InventoryData[];
  handleAdd: () => void;
  renderRowSubComponent: FC<any>;
  getHeaderProps: (column: HeaderGroup) => {};
  showIdColumn: boolean;
  handleSwitchChange: () => void;
}

function ReactTable({ columns, data, renderRowSubComponent, handleAdd, getHeaderProps }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'productName', desc: false };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
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
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );
  
  const moment = require('moment');
  const now = new Date();const formatedFilename = 'ProductsList' + moment(now).format('YYYY-MM-DD_HH-mm-ss');
  const [isProductIdVisible, setIsProductIdVisible] = useState(false);
  const [isAuditSwitchOn, setIsAuditSwitchOn] = useState(false);

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['avatar', 'email']);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  const handleSwitchChange = () => {
    setIsProductIdVisible((prevIsProductIdVisible) => !prevIsProductIdVisible);
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
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd} size="small">
              Add Paid Payment
            </Button>
            <CSVExport
              data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d: Row) => d.original) : data}
              filename={formatedFilename}
            />
            <Tooltip title={isProductIdVisible ? 'Hide ID' : 'Show ID'}>
              <FormControlLabel
                value=""
                control={<Switch color="success" checked={isProductIdVisible} onChange={handleSwitchChange} />}
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
        <ScrollX sx={{ height: 500, overflowX: 'auto', overflowY: 'auto' }}>
          <TableWrapper>
            <Table {...getTableProps()} stickyHeader>
              <TableHead>
                {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                    {headerGroup.headers.map((column: HeaderGroup) => {
                      if (
                        (column.id === 'id' && !isProductIdVisible) ||
                        (column.id === '12' && !isAuditSwitchOn) ||
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
                            (cell.column.id === 'id' && !isProductIdVisible) ||
                            (cell.column.id === '12' && !isAuditSwitchOn) ||
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
        <Box sx={{ '&:hover': { bgcolor: 'transparent !important' }, p: 2, py: 1 }}>
          <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
        </Box>
      </Stack>
    </>
  );
}

// ==============================|| PRODUCT - LIST ||============================== //

const ProductListPage = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [product, setProduct] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);
  const [products, setProducts] = useState<InventoryData[]>([]);
  const [productDeleteName, setProductDeleteName] = useState<any>('');
  const [productDeleteId, setProductDeleteId] = useState<string>('');
  const [showIdColumn, setShowIdColumn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts('3fa85f64-5717-4562-b3fc-2c963f66afa6')
      .then((productList) => {
        if (Array.isArray(productList)) {
          setProducts(productList);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const memoizedProducts = useMemo(() => products, [products]);

  const handleAdd = () => {
    setAdd(!add);
    if (product && !add) setProduct(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };
  const handleSwitchChange = () => {
    setShowIdColumn(!showIdColumn);
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
        Header: 'PRODUCT ID',
        accessor: 'id',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 300 }}>{value}</Box>
      },
      {
        Header: 'PRODUCT NAME',
        accessor: 'productName',
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="subtitle1" minWidth={150}>{values.productName}</Typography>
            </Stack>
          );
        }
      },
      {
        Header: 'CATEGORY',
        accessor: 'categoryName',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 100 }}>{value}</Box>,
        width: 200
      },
      {
        Header: 'HSN',
        accessor: 'hsnCode',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'SAC',
        accessor: 'sac',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'COST',
        accessor: 'purchasePrice',
        className: 'cell-right',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'RATE',
        accessor: 'sellingPrice',
        className: 'cell-right',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>

      },
      {
        Header: 'CGST',
        accessor: 'cgst',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'SGST',
        accessor: 'sgst',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'IGST',
        accessor: 'igst',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'OPN.STOCK',
        accessor: 'openingStock',
        className: 'cell-right',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'UNIT',
        accessor: 'unit',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'ACTIONS',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: { row: Row<{}> }) => {
          const collapseIcon = row.isExpanded ? (
            <CloseOutlined style={{ color: theme.palette.error.main }} />
          ) : (
            <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
          );
          return (
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0}>
              <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0}>
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
                      setProduct(row.values);
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
                      handleClose();
                      setProductDeleteName(row.values.productName);
                      setProductDeleteId(row.values.id);
                    }}
                  >
                    <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          );
        }
      },
      //pranit: need to change as per accessor name
      {
        Header: 'CREATED ON',
        accessor: '12',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>
      },
      {
        Header: 'MODIFIED ON',
        accessor: 'modifiedOnUtc',
        Cell: (props: CellProps<{}, any>) => <>{moment(props.value).format('DD MMM YYYY')}</>
      },
      {
        Header: 'CREATED BY',
        accessor: 'createdBy'
      },
      {
        Header: 'MODIFIED BY',
        accessor: 'modifiedBy'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const renderRowSubComponent = useCallback(
    ({ row }: { row: Row<{}> }) => <ProductDetails data={memoizedProducts[Number(row.id)]} />,

    [memoizedProducts]
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
            data={memoizedProducts}
            handleAdd={handleAdd}
            renderRowSubComponent={renderRowSubComponent}
            getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
            showIdColumn={showIdColumn}
            handleSwitchChange={handleSwitchChange}
          />
        </ScrollX>
      )}

      <AlertProductDelete title={productDeleteName} open={open} handleClose={handleClose} id={productDeleteId} />

      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
      </Dialog>
    </MainCard>
  );
};

export default ProductListPage;
