export interface CoaStateProps {
  columns: CoaColumn[];
  columnsOrder: string[];
  items: CoaItem[];
  selectedItem: string | false;
  rootAccounts: RootCoa[];
  rootAccountOrder: string[];
  error: object | string | null;
}

export type CoaColumn = {
  id: string;
  title: string;
  itemIds: string[];
};

export type CoaItem = {
  assign?: string;
  attachments: [];
  accountCode: string;
  type: string;
  commentIds?: string[];
  description: string;
  dueDate: Date;
  id: string;
  image: string | false;
  priority: 'low' | 'medium' | 'high';
  name: string;
};

export type RootCoa = {
  acceptance: string;
  assign?: string;
  columnId: string;
  accountCode: string;
  type: string;
  commentIds?: string[];
  description: string;
  dueDate: Date;
  id: string;
  childIds: string[];
  name: string;
  priority: string;
};
