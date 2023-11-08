// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import { Text, View, StyleSheet } from '@react-pdf/renderer';

// types
import { IInvoiceType } from 'types/invoice';

const textPrimary = '#262626';
const textSecondary = '#8c8c8c';
const border = '#f0f0f0';

// custom Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    '@media max-width: 400': {
      paddingTop: 10,
      paddingLeft: 0
    }
  },
  card: {
    border: `1px solid ${border}`,
    borderRadius: '2px',
    padding: '20px',
    width: '48%'
  },
  title: {
    color: textPrimary,
    fontSize: '12px',
    fontWeight: 500
  },
  caption: {
    color: textSecondary,
    fontSize: '10px'
  },
  tableTitle: {
    color: textPrimary,
    fontSize: '10px',
    fontWeight: 500
  },
  tableCell: {
    color: textPrimary,
    fontSize: '10px'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },

  subRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 0,
    paddingBottom: 20
  },
  column: {
    flexDirection: 'column'
  },

  paragraph: {
    color: '#1F2937',
    fontSize: '12px'
  },

  tableHeader: {
    justifyContent: 'space-between',
    borderBottom: '1px solid #f0f0f0',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '10px',
    paddingBottom: '10px',
    margin: 0,
    paddingLeft: 10
  },
  tableRow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: 10,
    paddingTop: 10,
    margin: 0,
    paddingLeft: 10
  },
  amountSection: { margin: 0, paddingRight: 25, paddingTop: 16, justifyContent: 'flex-end' },
  amountRow: { margin: 0, width: '40%', justifyContent: 'space-between' },
  pb5: { paddingBottom: 5 },
  flex03: { flex: '0.3 1 0px' },
  flex07: { flex: '0.7 1 0px' },
  flex17: { flex: '1.7 1 0px' },
  flex20: { flex: '2 1 0px' }
});

interface Props {
  list: IInvoiceType | null;
}

// ==============================|| INVOICE EXPORT - CONTENT  ||============================== //

const Content = ({ list }: Props) => {
  const theme = useTheme();
  const subTotal = (list?.lines ?? []).reduce((total, row) => {
    return total + row.amount;
  }, 0);
  const taxRate = (Number(list?.tax) * subTotal) / 100;
  const discountRate = (Number(list?.discount) * subTotal) / 100;
  const cashierInfo = {
    name: 'Belle J. Richter',
    address: '1300 Cooks Mine, NM 87829',
    phoneNumber: '305-829-7809',
    email: 'belljrc23@gmail.com'
  };
  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.subRow]}>
        <View style={styles.card}>
          <Text style={[styles.title, { marginBottom: 8 }]}>From:</Text>
          <Text style={[styles.caption, styles.pb5]}>{cashierInfo?.name}</Text>
          <Text style={[styles.caption, styles.pb5]}>{cashierInfo?.address}</Text>
          <Text style={[styles.caption, styles.pb5]}>{cashierInfo?.phoneNumber}</Text>
          <Text style={[styles.caption, styles.pb5]}>{cashierInfo?.email}</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.title, { marginBottom: 8 }]}>To:</Text>
          <Text style={[styles.caption, styles.pb5]}>
            {list?.customer?.firstName && list?.customer?.lastName
              ? `${list.customer.firstName} ${list.customer.lastName}`
              : list?.customer?.firstName}
          </Text>
          {/* <Text style={[styles.caption, styles.pb5]}>{list?.customer?.city}</Text> */}
          <Text style={[styles.caption, styles.pb5]}>{list?.customer?.phoneNumber}</Text>
          <Text style={[styles.caption, styles.pb5]}>{list?.customer?.email}</Text>
        </View>
      </View>
      <View>
        <View style={[styles.row, styles.tableHeader, { backgroundColor: theme.palette.grey[100] }]}>
          <Text style={[styles.tableTitle, styles.flex03]}>#</Text>
          <Text style={[styles.tableTitle, styles.flex17]}>NAME</Text>
          <Text style={[styles.tableTitle, styles.flex20]}>DESCRIPTION</Text>
          <Text style={[styles.tableTitle, styles.flex07]}>QUANTITY</Text>
          <Text style={[styles.tableTitle, styles.flex07]}>PRICE</Text>
          <Text style={[styles.tableTitle, styles.flex07]}>AMOUNT</Text>
        </View>
        {list?.lines.map((row: any, index: number) => {
          return (
            <View style={[styles.row, styles.tableRow]} key={row.id}>
              <Text style={[styles.tableCell, styles.flex03]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.flex17, { textOverflow: 'ellipsis' }]}>{row.name}</Text>
              <Text style={[styles.tableCell, styles.flex20]}>{row.description}</Text>
              <Text style={[styles.tableCell, styles.flex07]}>{row.quantity}</Text>
              <Text style={[styles.tableCell, styles.flex07]}>{`$${Number(row.price).toFixed(2)}`}</Text>
              <Text style={[styles.tableCell, styles.flex07]}>{`$${Number(row.price * row.quantity).toFixed(2)}`}</Text>
            </View>
          );
        })}
      </View>
      <View style={[styles.row, { paddingTop: 25, margin: 0, paddingRight: 25, justifyContent: 'flex-end' }]}>
        <View style={[styles.row, styles.amountRow]}>
          <Text style={styles.caption}>Sub Total:</Text>
          <Text style={styles.tableCell}>${subTotal?.toFixed(2)}</Text>
        </View>
      </View>
      <View style={[styles.row, styles.amountSection]}>
        <View style={[styles.row, styles.amountRow]}>
          <Text style={styles.caption}>Discount:</Text>
          <Text style={[styles.caption, { color: theme.palette.success.main }]}>${discountRate?.toFixed(2)}</Text>
        </View>
      </View>
      <View style={[styles.row, styles.amountSection]}>
        <View style={[styles.row, styles.amountRow]}>
          <Text style={styles.caption}>Tax:</Text>
          <Text style={[styles.caption]}>${taxRate?.toFixed(2)}</Text>
        </View>
      </View>
      <View style={[styles.row, styles.amountSection]}>
        <View style={[styles.row, styles.amountRow]}>
          <Text style={styles.tableCell}>Grand Total:</Text>
          <Text style={styles.tableCell}>${list?.totalAmount?.toFixed(2)}</Text>
        </View>
      </View>
      <View style={[styles.row, { alignItems: 'flex-start', marginTop: 20, width: '95%' }]}>
        <Text style={styles.caption}>Note </Text>
        <Text style={styles.tableCell}> {list?.note}</Text>
      </View>
    </View>
  );
};

export default Content;
