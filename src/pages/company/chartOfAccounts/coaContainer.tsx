//import { useState } from 'react';

// material-ui
import { Theme, useTheme } from '@mui/material/styles';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';

// third-party
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';

// project import
//import AddStory from './AddStory';
import RootAccount from './rootAccount';
//import ItemDetails from '../Board/ItemDetails';
import { useSelector } from 'store';
//import { updateStoryOrder, updateStoryItemOrder } from 'store/reducers/coa';

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
  //const dispatch = useDispatch();
  const coa = useSelector((state) => state.coa);
  const { rootAccounts, rootAccountOrder } = coa;

  const onDragEnd = (result: DropResult) => {
    // let newUserStory: KanbanUserStory[];
    // const { source, destination, draggableId, type } = result;
    // if (!destination) return;
    // if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    // if (type === 'user-story') {
    //   const newUserStoryOrder = Array.from(rootAccountOrder);
    //   newUserStoryOrder.splice(source.index, 1); // remove dragged column
    //   newUserStoryOrder.splice(destination?.index, 0, draggableId); // set column new position
    //   //dispatch(updateStoryOrder(newUserStoryOrder));
    //   return;
    // }
    // // find dragged item's column
    // const sourceUserStory = rootAccounts.filter((story) => story.id === source.droppableId)[0];
    // // find dropped item's column
    // const destinationUserStory = rootAccounts.filter((story) => story.id === destination.droppableId)[0];
    // // if - moving items in the same list
    // // else - moving items from one list to another
    // if (sourceUserStory === destinationUserStory) {
    //   const newItemIds = Array.from(sourceUserStory.itemIds);
    //   // remove the id of dragged item from its original position
    //   newItemIds.splice(source.index, 1);
    //   // insert the id of dragged item to the new position
    //   newItemIds.splice(destination.index, 0, draggableId);
    //   // updated column
    //   const newSourceUserStory = {
    //     ...sourceUserStory,
    //     itemIds: newItemIds
    //   };
    //   newUserStory = rootAccounts.map((story) => {
    //     if (story.id === newSourceUserStory.id) {
    //       return newSourceUserStory;
    //     }
    //     return story;
    //   });
    // } else {
    //   const newSourceItemIds = Array.from(sourceUserStory.itemIds);
    //   // remove the id of dragged item from its original column
    //   newSourceItemIds.splice(source.index, 1);
    //   // updated dragged items's column
    //   const newSourceUserStory = {
    //     ...sourceUserStory,
    //     itemIds: newSourceItemIds
    //   };
    //   const newDestinationItemIds = Array.from(destinationUserStory.itemIds);
    //   // insert the id of dragged item to the new position in dropped column
    //   newDestinationItemIds.splice(destination.index, 0, draggableId);
    //   // updated dropped item's column
    //   const newDestinationSourceUserStory = {
    //     ...destinationUserStory,
    //     itemIds: newDestinationItemIds
    //   };
    //   // newUserStory = rootAccounts.map((story) => {
    //   //   if (story.id === newSourceUserStory.id) {
    //   //     return newSourceUserStory;
    //   //   }
    //   //   if (story.id === newDestinationSourceUserStory.id) {
    //   //     return newDestinationSourceUserStory;
    //   //   }
    //   //   return story;
    //   // });
    // }
    // //dispatch(updateStoryItemOrder(newUserStory));
  };

  // drawer
  // const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  // const handleDrawerOpen = () => {
  //   setOpenDrawer((prevState) => !prevState);
  // };

  // const addStory = () => {
  //   setOpenDrawer((prevState) => !prevState);
  // };

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
        {/* <AddStory open={openDrawer} handleDrawerOpen={handleDrawerOpen} /> */}
        {/* <ItemDetails /> */}
      </TableContainer>
    </MainCard>
  );
};

export default CoaContainer;
