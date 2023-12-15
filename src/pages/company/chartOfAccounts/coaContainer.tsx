// material-ui
import { Theme, useTheme } from '@mui/material/styles';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';

// third-party
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';

// project import
import RootAccount from './rootAccount';
import { useSelector } from 'store';

// assets
import { PlusOutlined } from '@ant-design/icons';

// types
import { RootCoa } from 'types/coa';
import MainCard from 'components/MainCard';

const getDropWrapper = (isDraggingOver: boolean, theme: Theme) => ({
  background: isDraggingOver ? theme.palette.secondary.lighter + 65 : 'transparent'
});

// ==============================|| KANBAN - BACKLOGS ||============================== //

const CoaContainer = () => {
  const theme = useTheme();
  const coa = useSelector((state) => state.coa);
  const { rootAccounts, rootAccountOrder } = coa;

  const onDragEnd = (result: DropResult) => {};

  return (
    <MainCard content={false}>
      <TableContainer sx={{ '& .MuiTableCell-root': { p: 1.25 } }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="user-story" type="user-story">
            {(provided, snapshot) => (
              <Table
                size="small"
                aria-label="collapsible table"
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={getDropWrapper(snapshot.isDraggingOver, theme)}
              >
                <TableHead
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    borderTop: 'none',
                    borderBottomWidth: '1px',
                    '& th,& td': { whiteSpace: 'nowrap' }
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ pl: 3 }}>
                      <Tooltip title="Add User Story">
                        <Button variant="dashed" size="extraSmall" color="secondary" endIcon={<PlusOutlined />}>
                          ADD
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody
                  sx={{
                    '& th,& td': { whiteSpace: 'nowrap' },
                    '& .MuiTableRow-root:last-of-type .MuiTable-root .MuiTableCell-root': {
                      borderBottom: `1px solid ${theme.palette.divider}`
                    },
                    '& .MuiTableRow-root:hover': { bgcolor: 'transparent' }
                  }}
                >
                  {rootAccountOrder.map((storyId: string, index: number) => {
                    const story = rootAccounts.filter((item: RootCoa) => item.id === storyId)[0];
                    return <RootAccount key={story.id} story={story} index={index} />;
                  })}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </TableContainer>
    </MainCard>
  );
};

export default CoaContainer;
