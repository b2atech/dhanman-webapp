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
  CircularProgress
} from '@mui/material';

// third-party
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
  HeaderProps
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

import { IInventory } from 'types/invoice';
import { getAllProducts } from 'api/services/InventoryService';
import AddProduct from './addproduct';
import ProductDetails from './productDetails';
import AlertProductDelete from './alertProductDelete';
import { InventoryData } from 'types/inventoryInfo';

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
  data: InventoryData[];
  handleAdd: () => void;
  renderRowSubComponent: FC<any>;
  getHeaderProps: (column: HeaderGroup) => {};
  showIdColumn: boolean;
  handleSwitchChange: () => void;
}

function ReactTable({ columns, data, renderRowSubComponent, handleAdd, getHeaderProps, showIdColumn }: Props) {
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
  const formatedFilename = 'ProductsList' + moment(now).format('YYYY-MM-DD_HH-mm-ss');
  const [isAuditSwitchOn, setIsAuditSwitchOn] = useState(false);
  const [isProductIdVisible, setIsProductIdVisible] = useState(false);

  const handleSwitchChange = () => {
    setIsProductIdVisible((prevIsProductIdVisible) => !prevIsProductIdVisible);
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
              Add Product
            </Button>
            <CSVExport
              data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d: Row) => d.original) : data}
              filename={formatedFilename}
            />
            <Tooltip title={isProductIdVisible ? 'Close ID' : 'Show ID'}>
              <FormControlLabel
                value=""
                control={<Switch color="success" checked={isProductIdVisible} onChange={handleSwitchChange} />}
                label=""
                labelPlacement="start"
                sx={{ mr: 0 }}
              />
            </Tooltip>
            <Tooltip title={isAuditSwitchOn ? 'Close Audit' : 'Show Audit'}>
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
          <ScrollX sx={{ maxHeight: 400, overflow: 'auto' }}>
            <TableWrapper>
              <Table {...getTableProps()} stickyHeader>
                <TableHead>
                  {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                      {headerGroup.headers.map((column: HeaderGroup) => {
                        if (column.id === 'id' && !isProductIdVisible) {
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
                            if (cell.column.id === 'id' && !isProductIdVisible) {
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
            <Box sx={{ '&:hover': { bgcolor: 'transparent !important' }, p: 2, py: 1 }}>
              <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
            </Box>
          </Box>
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
  const [products, setProducts] = useState<IInventory[]>([]);
  const [productDeleteName, setProductDeleteName] = useState<any>('');
  const [productDeleteId, setProductDeleteId] = useState<string>('');
  const [showIdColumn, setShowIdColumn] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSwitchChange = () => {
    setShowIdColumn(!showIdColumn);
  };

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

  const handleClose = (confirmed: boolean) => {
    setOpen(false);
  };

  const columns = useMemo(
    () => [
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
        Header: 'Product id',
        accessor: 'id',
        width: -200,
        sticky: 'left'
      },
      {
        Header: 'Product Name',
        accessor: 'productName',
        width: 220,
        sticky: 'left',
        Cell: ({ row }: { row: Row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="subtitle1">{values.productName}</Typography>
            </Stack>
          );
        }
      },
      {
        Header: 'Description',
        accessor: 'description',
        width: 200,
        sticky: 'left'
      },
      {
        Header: 'Quantity',
        accessor: 'quntityInStock',
        width: 200,
        sticky: 'left'
      },
      {
        Header: 'Price',
        accessor: 'unitPrice',
        width: 200,
        sticky: 'left'
      },
      {
        Header: 'Recorder Level',
        accessor: 'recorderLevel',
        width: 200,
        sticky: 'left'
      },
      {
        Header: 'Actions',
        className: 'cell-right',
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
                    setProductDeleteName(row.values.productName);
                    setProductDeleteId(row.values.id);
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

  const renderRowSubComponent = useCallback(
    ({ row }: { row: Row<{}> }) => <ProductDetails data={memoizedProducts[Number(row.id)]} />,

    [memoizedProducts]
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
            data={memoizedProducts}
            handleAdd={handleAdd}
            renderRowSubComponent={renderRowSubComponent}
            getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
            showIdColumn={showIdColumn}
            handleSwitchChange={handleSwitchChange}
          />
        )}
      </ScrollX>
      <AlertProductDelete title={productDeleteName} open={open} handleClose={handleClose} id={productDeleteId} />

      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <AddProduct product={product} onCancel={handleAdd} />
      </Dialog>
    </MainCard>
  );
};

export default ProductListPage;
