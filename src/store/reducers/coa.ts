// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import { dispatch } from '../index';

// types
import { CoaStateProps } from 'types/coa';
import { getAllChartOfAccount, getAllRootChartOfAccount } from 'api/services/CommonService';
const initialState: CoaStateProps = {
  error: null,
  columns: [],
  columnsOrder: [],
  items: [],
  selectedItem: false,
  rootAccounts: [],
  rootAccountOrder: []
};

const slice = createSlice({
  name: 'chartOfAccounts',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // ADD COLUMN
    addColumnSuccess(state) {
      //Add later
    },

    // EDIT COLUMN
    editColumnSuccess(state, action) {
      state.columns = action.payload.columns;
    },

    // UPDATE COLUMN ORDER
    updateColumnOrderSuccess(state, action) {
      state.columnsOrder = action.payload.columnsOrder;
    },

    // DELETE COLUMN
    deleteColumnSuccess(state, action) {
      state.columns = action.payload.columns;
      state.columnsOrder = action.payload.columnsOrder;
    },

    // ADD ITEM
    addItemSuccess(state, action) {
      state.items = action.payload.items;
      state.columns = action.payload.columns;
      state.rootAccounts = action.payload.userStory;
    },

    // EDIT ITEM
    editItemSuccess(state, action) {
      state.items = action.payload.items;
      state.columns = action.payload.columns;
      state.rootAccounts = action.payload.userStory;
    },

    // UPDATE COLUMN ITEM ORDER
    updateColumnItemOrderSuccess(state, action) {
      state.columns = action.payload.columns;
    },

    // SELECT ITEM
    selectItemSuccess(state, action) {
      state.selectedItem = action.payload.selectedItem;
    },

    // ADD ITEM COMMENT
    addItemCommentSuccess(state, action) {
      state.items = action.payload.items;
    },

    // DELETE ITEM
    deleteItemSuccess(state, action) {
      state.items = action.payload.items;
      state.columns = action.payload.columns;
      state.rootAccounts = action.payload.userStory;
    },

    // ADD STORY
    addStorySuccess(state, action) {
      state.rootAccounts = action.payload.userStory;
      state.rootAccountOrder = action.payload.userStoryOrder;
    },

    // EDIT STORY
    editStorySuccess(state, action) {
      state.rootAccounts = action.payload.userStory;
    },

    // UPDATE STORY ORDER
    updateStoryOrderSuccess(state, action) {
      state.rootAccountOrder = action.payload.userStoryOrder;
    },

    // UPDATE STORY ITEM ORDER
    updateStoryItemOrderSuccess(state, action) {
      state.rootAccounts = action.payload.userStory;
    },

    // ADD STORY COMMENT
    addStoryCommentSuccess(state, action) {
      state.rootAccounts = action.payload.userStory;
    },

    // DELETE STORY
    deleteStorySuccess(state, action) {
      state.rootAccounts = action.payload.userStory;
      state.rootAccountOrder = action.payload.userStoryOrder;
    },

    // GET COLUMNS
    getColumnsSuccess(state) {
      // var columns = [
      //   {
      //     id: 'column-1',
      //     title: 'New',
      //     itemIds: ['3542', '8903', '1381']
      //   },
      //   {
      //     id: 'column-2',
      //     title: 'Active',
      //     itemIds: ['6739', '3950', '6924']
      //   },
      //   {
      //     id: 'column-3',
      //     title: 'Resolved',
      //     itemIds: ['4398']
      //   },
      //   {
      //     id: 'column-4',
      //     title: 'Closed',
      //     itemIds: ['9589', '3410', '8679']
      //   }
      // ];
      //state.columns = JSON.stringify(columns);
    },

    // GET COLUMNS ORDER
    getColumnsOrderSuccess(state) {
      state.columnsOrder = ['column-1', 'column-2', 'column-3', 'column-4'];
    },

    // GET COMMENTS
    getCommentsSuccess(state, action) {
      //state.comments = action.payload;
    },

    // GET PROFILES
    getProfilesSuccess(state, action) {
      //state.profiles = action.payload;
    },

    // GET ITEMS
    getItemsSuccess(state, action) {
      state.items = action.payload;
    },

    // GET USER STORY
    getRootChartOfAccountsSuccess(state, action) {
      state.rootAccounts = action.payload;
    },

    // GET USER STORY ORDER
    getRootChartOfAccountsOrderSuccess(state) {
      state.rootAccountOrder = [
        'fde7160a-f1ee-4073-a6f6-05d39fe7e082',
        'a551e319-06ac-4e99-a572-cc967dd2157e',
        'add54892-c39a-4e23-afe3-a80534a93367',
        'b4e793d2-c504-4a2e-abe7-78c20c4a9a2f',
        'ff067859-adc8-4868-97bc-a1547ebf4c6f',
        '2076dffb-6d0e-4676-be49-51341466c348',
        '8be62def-c416-4901-bb0a-e4a21e58eeb8',
        '96489d72-a86b-477f-a5ee-290764cfa484',
        'bd5c8b8e-5f6a-4248-90f4-909ad0a88392',
        'a04dc6c5-982c-4085-95f0-52b89816cb48',
        'c6dbfe26-3e36-4fa8-b164-9673f547148a',
        'cf798b4a-f198-4765-92c6-f54815029ec2',
        '6d6aba90-65e6-43ee-bcd6-0c6a7df0a107',
        'de60289c-8e41-48fe-857c-578986962eb4',
        'e159c5e5-7f38-42d8-8b04-786835db4d50',
        'eb769e3c-96de-4d49-b289-236c3f54e1a7',
        'f0781fd4-093c-49ca-a7dc-c64288e83617',
        '1e0449e3-caac-410d-a70d-cb93b64020be',
        '4ed6fed2-328e-4713-9e34-11ddeb344fe5',
        'b3970a76-593f-4214-be67-06366d563871',
        '67a77e9e-a03a-440e-82db-19befee846b6',
        '707f91b5-9ad3-45f5-b6bc-14f456c4c956',
        'e329d6cf-e99d-452e-bdba-891695e04eb2',
        'e69ccba4-7df1-44f6-b576-9624732c5a55',
        'ec5531ea-90b0-4a9d-923a-0868d7c3b013',
        'eebfeab2-3561-437a-ae94-6bbc7f5d6bcf',
        '56468f65-e4a4-4019-bdc8-2f73793bc7ea',
        'a4b6094f-9194-405a-aa55-e699eb71a159',
        'ff03c4b6-1e4a-4ec4-a77b-306e8d79ea80',
        'ff43d9e0-ee96-4a58-a685-a88c37566e52',
        '3c3e96d8-ea6e-42e7-8b0c-d63e612db9bb',
        '41767bff-538e-475f-a7fe-caa4de157262',
        'a9082c62-72db-46da-8966-82663f3739d9',
        'cfd36b66-72ce-45e8-bdc6-8a1b789429fb',
        'dd6dcf5d-aea9-4052-9f88-4fb88d5329c8',
        'e8c5d3c1-23ac-462e-acbd-285527b401be',
        'ebde1539-ab69-4851-b46f-8cec6b6956a8',
        '8958917b-d9de-450d-8734-261c4be33322',
        '2762e426-9f82-4cf4-81c1-d47c8eb5d00a',
        '347de035-8b3f-4ebe-9cc4-62475d68069d'
      ];
    }
  }
});

// Reducer
export default slice.reducer;

export function getColumns() {
  return async () => {
    try {
      dispatch(slice.actions.getColumnsSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getColumnsOrder() {
  return async () => {
    try {
      dispatch(slice.actions.getColumnsOrderSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getItems() {
  return async () => {
    try {
      const response = await getAllChartOfAccount('3fa85f64-5717-4562-b3fc-2c963f66afa6');
      dispatch(slice.actions.getItemsSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getRootChartOfAccounts() {
  return async () => {
    try {
      const response = await getAllRootChartOfAccount('3fa85f64-5717-4562-b3fc-2c963f66afa6');
      dispatch(slice.actions.getRootChartOfAccountsSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getRootChartOfAccountsOrder() {
  return async () => {
    try {
      //const response = await GetCOAOrder('3fa85f64-5717-4562-b3fc-2c963f66afa6');
      dispatch(slice.actions.getRootChartOfAccountsOrderSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
