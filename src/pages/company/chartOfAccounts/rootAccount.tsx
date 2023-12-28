import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import { Theme, useTheme } from '@mui/material/styles';
import { Box, Collapse, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from '@mui/material';

// third-party
import { Droppable, Draggable } from '@hello-pangea/dnd';

// project imports
//import AddItem from './AddItem';
//import EditStory from './EditStory';
//import AlertStoryDelete from './AlertStoryDelete';
import Items from './items';
//import { openSnackbar } from 'store/reducers/snackbar';
//import { useDispatch, useSelector } from 'store';
//import { deleteStory } from 'store/reducers/kanban';
import IconButton from 'components/@extended/IconButton';

// assets
import { DownOutlined, RightOutlined, PlusSquareTwoTone, ClusterOutlined } from '@ant-design/icons';

// types
import { RootCoa } from 'types/coa';
import { ThemeMode } from 'types/config';

interface Props {
  story: RootCoa;
  index: number;
}

// drag wrapper
const getDragWrapper = (isDragging: boolean, theme: Theme, open: boolean): CSSProperties | undefined => {
  let bgcolor = 'transparent';
  if (open) {
    bgcolor = theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.secondary.lighter;
  }

  if (isDragging) {
    bgcolor = theme.palette.mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.primary.lighter;
  }

  return {
    backgroundColor: bgcolor,
    userSelect: 'none'
  };
};

// drop wrapper
const getDropWrapper = (isDraggingOver: boolean, theme: Theme) => {
  return {
    background: 'transparent'
  };
};

// ==============================|| KANBAN BACKLOGS - USER STORY ||============================== //

const RootAccount = ({ story, index }: Props) => {
  const theme = useTheme();
  const navigation = useNavigate();
  //const dispatch = useDispatch();
  //const coa = useSelector((state) => state.coa);
  //const { columns, rootAccounts, rootAccountOrder } = coa;
  const [open, setOpen] = React.useState(index === 0);

  //const storyColumn = columns.filter((column) => column.id === story.columnId)[0];
  //const storyProfile = profiles.filter((profile) => profile.id === story.assign)[0];

  // drawer
  //const [setOpenDrawer] = useState<boolean>(false);
  //   const handleDrawerOpen = () => {
  //     setOpenDrawer((prevState) => !prevState);
  //   };

  //const [openStoryDrawer, setOpenStoryDrawer] = useState<boolean>(false);
  //   const handleStoryDrawerOpen = () => {
  //     setOpenStoryDrawer((prevState) => !prevState);
  //   };
  //const [setOpenModal] = useState(false);

  //   const handleModalClose = (status: boolean) => {
  //     setOpenModal(false);
  //     if (status) {
  //       //dispatch(deleteStory(story.id, userStory, userStoryOrder));
  //       dispatch(
  //         openSnackbar({
  //           open: true,
  //           message: 'Task Deleted successfully',
  //           anchorOrigin: { vertical: 'top', horizontal: 'right' },
  //           variant: 'alert',
  //           alert: {
  //             color: 'success'
  //           },
  //           close: false
  //         })
  //       );
  //     }
  //   };

  return (
    <>
      <Draggable draggableId={story.id} index={index}>
        {(provided, snapshot) => (
          <>
            <TableRow
              hover
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              sx={{
                ...getDragWrapper(snapshot.isDragging, theme, open),
                ...(!open && {
                  '& .MuiTableCell-root': {
                    border: 'none'
                  }
                })
              }}
            >
              <TableCell sx={{ pl: 3, minWidth: 120, width: 120, height: 46 }}>
                <Stack direction="row" spacing={0.5} alignItems="left">
                  <Tooltip title="Add Task">
                    <IconButton
                      aria-label="expand row"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        navigation('/company/coa/create');
                      }}
                      size="small"
                      sx={{ fontSize: '1.15rem' }}
                    >
                      <PlusSquareTwoTone color={theme.palette.primary.main} />
                    </IconButton>
                  </Tooltip>
                  <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} color="secondary">
                    {open ? <DownOutlined /> : <RightOutlined />}
                  </IconButton>
                </Stack>
              </TableCell>
              <TableCell sx={{ width: 110, minWidth: 110 }}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <ClusterOutlined style={{ color: theme.palette.primary.main, marginTop: -2 }} />
                  <Typography variant="subtitle2">{story.accountCode}</Typography>
                </Stack>
              </TableCell>
              <TableCell sx={{ width: 85, minWidth: 85 }}>{story.type}</TableCell>
              <TableCell sx={{ width: 85, minWidth: 85, textTransform: 'capitalize' }}>{story.type}</TableCell>
              <TableCell sx={{ width: 85, minWidth: 85 }}>{story.description}</TableCell>
            </TableRow>

            <Droppable droppableId={story.id} type="item">
              {(providedDrop, snapshotDrop) => (
                <TableRow
                  ref={providedDrop.innerRef}
                  {...providedDrop.droppableProps}
                  sx={getDropWrapper(snapshotDrop.isDraggingOver, theme)}
                >
                  <TableCell style={{ padding: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      {open && (
                        <Box sx={{ margin: 0 }}>
                          <TableContainer>
                            <Table size="small" aria-label="purchases">
                              <TableBody>
                                {story.childIds?.map((itemId: string, i: number) => (
                                  <Items key={itemId} itemId={itemId} index={i} />
                                ))}
                                {providedDrop.placeholder}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </Droppable>
          </>
        )}
      </Draggable>
      {/* <EditStory story={story} open={openStoryDrawer} handleDrawerOpen={handleStoryDrawerOpen} />
      <AddItem open={openDrawer} handleDrawerOpen={handleDrawerOpen} storyId={story.id} /> */}
    </>
  );
};

export default RootAccount;
