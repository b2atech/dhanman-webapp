// third-party
import { Page, View, Document, StyleSheet } from '@react-pdf/renderer';

// project import
import Header from './Header';
import Content from './Content';

// types
import { IBillType } from 'types/bill';

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

// ==============================|| BILL EXPORT  ||============================== //

interface Props {
  list: IBillType | any;
}

const ExportPDFView = ({ list }: Props) => {
  let title = list?.billNumber;
  let customer_name = list?.vendor.firstName + '' + list?.vendor.lastName;

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
