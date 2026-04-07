import dayjs from 'dayjs';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { DataTable, IconButton, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;
  const data = [
    {
      id: 1,
      name: 'Guilherme Barbosa',
      created_at: Date.now(),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge">Usuários</Text>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{ flex: 1.8 }}>Nome</DataTable.Title>
          <DataTable.Title>Data de criação</DataTable.Title>
          <DataTable.Title style={{ justifyContent: 'flex-end' }}>
            Ações
          </DataTable.Title>
        </DataTable.Header>

        {data.map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell style={{ flex: 1.8 }}>{item.name}</DataTable.Cell>
            <DataTable.Cell>
              {dayjs(item.created_at).format('DD/MM/YYYY')}
            </DataTable.Cell>
            <DataTable.Cell style={{ justifyContent: 'flex-end' }}>
              <IconButton icon="pen" iconColor={theme.colors.primary} />
              <IconButton icon="delete" iconColor={theme.colors.error} />
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${page + 1} de ${Math.ceil(data.length / itemsPerPage)}`}
        />
      </DataTable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
