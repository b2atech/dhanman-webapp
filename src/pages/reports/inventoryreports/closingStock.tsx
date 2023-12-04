/* eslint-disable prettier/prettier */
import { useCallback, useMemo, useState, Fragment, FC } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
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
  useMediaQuery
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
  HeaderGroup,
  Row,
  Cell,
  Column
} from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import {
  CSVExport,
  HeaderSort,
  SortingSelect,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';

import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

import { InventoryData } from 'types/inventoryInfo';
import ProductDetails from 'pages/inventory/products/productDetails';

// ==============================|| REACT TABLE ||============================== //
const TableWrapper = styled('div')(() => ({
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

// ==============================|| REPORT - LIST ||============================== //

const ReportPage = () => {
  const theme = useTheme();
  const [products] = useState<InventoryData[]>([]);
  const [showIdColumn, setShowIdColumn] = useState(false);

  const memoizedProducts = useMemo(() => products, [products]);

  const handleAdd = () => {
    
  };

  const handleSwitchChange = () => {
    setShowIdColumn(!showIdColumn);
  };

  const columns = useMemo(
    () => [
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
        Header: 'Opening Stock',
        accessor: 'hsnCode',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'Purchase Quantity',
        accessor: 'sac',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'Sales Quantity',
        accessor: 'purchasePrice',
        className: 'cell-right',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      {
        Header: 'Current Stock',
        accessor: 'sellingPrice',
        className: 'cell-right',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>

      },
      {
        Header: 'Unit',
        accessor: 'cgst',
        className: 'cell-center',
        Cell: ({ value }: { value: string }) => <Box sx={{ minWidth: 50 }}>{value}</Box>
      },
      
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const renderRowSubComponent = useCallback(
    ({ row }: { row: Row<{}> }) => <ProductDetails data={memoizedProducts[Number(row.id)]} />,

    [memoizedProducts]
  );

  return (
    <MainCard>      
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
    </MainCard>
  );
};

export default ReportPage;