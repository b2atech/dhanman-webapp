import { useEffect, useMemo, useState, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  CircularProgress,
  styled,
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
  HeaderProps,
  Cell,
} from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import {
  CSVExport,
  IndeterminateCheckbox,
  SortingSelect,
  TablePagination,
  TableRowSelection,
} from 'components/third-party/ReactTable';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { PlusOutlined } from '@ant-design/icons';
import { getAllProjects } from 'api/services/TimeSheetService';
import { useSticky } from 'react-table-sticky';
import { IProject } from 'types/timeSheet';

// ==============================|| REACT TABLE ||============================== //
const TableWrapper = styled('div')(({ theme }) => ({
  '.header': {
    position: 'sticky',
    zIndex: 1,
    width: 'fit-content',
  },
  '& th[data-sticky-td]': {
    position: 'sticky',
    zIndex: '5 !important',
  },
}));

interface Props {
  columns: Column[];
  data: IProject[];
  handleAdd: () => void;
  getHeaderProps: (column: HeaderGroup) => {};
}

function ReactTable({ columns, data, handleAdd, getHeaderProps }: Props) {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 80,
      width: 200,
      maxWidth: 400,
      margin: 20,
    }),
    []
  );
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
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    setSortBy,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        hiddenColumns: [],
        sortBy: [sortBy],
      },
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
  const formatedFilename =
    'ProjectList' + moment(now).format('YYYY-MM-DD_HH-mm-ss');
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
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            alignItems="center"
            spacing={1}
          >
            <SortingSelect
              sortBy={sortBy.id}
              setSortBy={setSortBy}
              allColumns={allColumns}
            />
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={handleAdd}
              size="small"
            >
              Add Project
            </Button>
            <CSVExport
              data={
                selectedFlatRows.length > 0
                  ? selectedFlatRows.map((d: Row) => d.original)
                  : data
              }
              filename={formatedFilename}
            />
          </Stack>
        </Stack>
        <Box ref={componentRef}>
          <ScrollX sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <TableWrapper>
              <Table {...getTableProps()}>
                <TableHead>
                  {headerGroups.map((headerGroup: HeaderGroup<{}>) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column: HeaderGroup<{}>) => (
                        <TableCell
                          {...column.getHeaderProps([
                            { className: column.className },
                          ])}
                        >
                          {column.render('Header')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody
                  {...getTableBodyProps()}
                  {...{ className: 'striped' }}
                >
                  {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                      <TableRow {...row.getRowProps()}>
                        {row.cells.map((cell: Cell<{}>) => (
                          <TableCell
                            {...cell.getCellProps([
                              { className: cell.column.className },
                            ])}
                          >
                            {cell.render('Cell')}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableWrapper>
          </ScrollX>
          <Box
            sx={{
              '&:hover': { bgcolor: 'transparent !important' },
              p: 2,
              py: 1,
            }}
          >
            <TablePagination
              gotoPage={gotoPage}
              rows={rows}
              setPageSize={setPageSize}
              pageSize={pageSize}
              pageIndex={pageIndex}
            />
          </Box>
        </Box>
      </Stack>
    </>
  );
}

// ==============================|| Project - LIST ||============================== //

const ProjectListPage = () => {
  const [customer, setCustomer] = useState<any>(null);
  const [add, setAdd] = useState<boolean>(false);
  const [projects, setProjects] = useState<IProject[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then((projectList) => {
        if (Array.isArray(projectList)) {
          setProjects(projectList);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const memoizedProjects = useMemo(() => projects, [projects]);

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        Header: ({ getToggleAllPageRowsSelectedProps }: HeaderProps<{}>) => (
          <IndeterminateCheckbox
            indeterminate
            {...getToggleAllPageRowsSelectedProps()}
          />
        ),
        accessor: 'selection',
        Cell: ({ row }: any) => (
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        ),
        disableSortBy: true,
      },
      {
        Header: 'Project id',
        accessor: 'id',
        Cell: ({ value }: { value: string }) => (
          <span style={{ whiteSpace: 'nowrap' }}>{value}</span>
        ),
      },
      {
        Header: 'Project Name',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
    ],
    []
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="500px"
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" style={{ marginTop: '32x' }}>
              Loading, please wait...
            </Typography>
          </Box>
        ) : (
          <ReactTable
            columns={columns}
            data={memoizedProjects}
            handleAdd={handleAdd}
            getHeaderProps={(column: HeaderGroup) =>
              column.getSortByToggleProps()
            }
          />
        )}
      </ScrollX>
    </MainCard>
  );
};

export default ProjectListPage;
