import { CSSProperties } from 'react';

// material-ui
import { Theme, useTheme } from '@mui/material/styles';
import { Stack, TableCell, TableRow, Typography } from '@mui/material';

// third-party
import { Draggable } from '@hello-pangea/dnd';

// project imports
//import { openSnackbar } from 'store/reducers/snackbar';
import { useSelector } from 'store';
//import { selectItem, deleteItem } from 'api/reducers/coa';
import { ProfileOutlined } from '@ant-design/icons';

// types
import { CoaItem } from 'types/coa';
import { ThemeMode } from 'types/config';

interface Props {
  itemId: string;
  index: number;
}

// drag wrapper
const getDragWrapper = (isDragging: boolean, theme: Theme): CSSProperties | undefined => {
  const bgcolor = theme.palette.mode === ThemeMode.DARK ? theme.palette.background.paper + 90 : theme.palette.primary.lighter + 99;
  return {
    backgroundColor: isDragging ? bgcolor : 'transparent',
    userSelect: 'none'
  };
};

// ==============================|| KANBAN BACKLOGS - ITEMS ||============================== //

const Items = ({ itemId, index }: Props) => {
  const theme = useTheme();
  //const dispatch = useDispatch();
  const { items } = useSelector((state) => state.coa);

  const item = items.filter((data: CoaItem) => data.id === itemId)[0];
  //const itemColumn = columns.filter((column) => column.itemIds.filter((id) => id === item.id)[0])[0];
  //const itemProfile = profiles.filter((profile) => profile.id === item.assign)[0];

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <TableRow
          hover
          key={item.id}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{
            '& th,& td': {
              whiteSpace: 'nowrap'
            },
            ...getDragWrapper(snapshot.isDragging, theme)
          }}
        >
          <TableCell sx={{ pl: 3, minWidth: 120, width: 120, height: 46 }} />
          <TableCell sx={{ width: 110, minWidth: 110 }}>
            <Stack direction="row" spacing={0.75} alignItems="left">
              <ProfileOutlined style={{ color: theme.palette.info.main, marginTop: -2 }} />
              <Typography variant="subtitle2">{item.accountCode}</Typography>
            </Stack>
          </TableCell>
          <TableCell sx={{ width: 85, minWidth: 85, textTransform: 'capitalize' }}>{item.name}</TableCell>
          <TableCell sx={{ width: 85, minWidth: 85, textTransform: 'capitalize' }}>{item.type}</TableCell>
          <TableCell sx={{ width: 85, minWidth: 85, textTransform: 'capitalize' }}>{item.description}</TableCell>
        </TableRow>
      )}
    </Draggable>
  );
};
export default Items;
