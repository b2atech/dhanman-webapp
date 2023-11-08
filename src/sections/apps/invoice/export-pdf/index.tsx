// third-party
import { Page, View, Document, StyleSheet } from '@react-pdf/renderer';

// project import
import Header from './Header';
import Content from './Content';

// types
import { IInvoiceType } from 'types/invoice';

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    '@media max-width: 400': {
      flexDirection: 'column'
    }
  }
});

// ==============================|| EXPORT  ||============================== //

interface Props {
  list: IInvoiceType | any;
}

const ExportPDFView = ({ list }: Props) => {
  let title = list?.invoiceNumber;
  let customer_name = list?.customer.firstName + '' + list?.customer.lastName;

  return (
    <Document title={`${title} ${customer_name}`}>
      <Page size="A4" style={styles.page}>
        <Header list={list} />
        <View style={styles.container}>
          <Content list={list} />
        </View>
      </Page>
    </Document>
  );
};

export default ExportPDFView;
