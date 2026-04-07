import { useSnackbar } from '@/contexts/SnackbarProvider';
import UserService, { IUsersList } from '@/services/user.service';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  DataTable,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { snack } = useSnackbar();

  const itemsPerPage = 10;
  const [list, setList] = useState<IUsersList>({
    meta: { total: 0, offset: 0, limit: itemsPerPage },
    items: [],
  });

  const listUsers = async (offset = 0): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await UserService.list(offset, itemsPerPage);
      setList(data);
    } catch (error: any) {
      snack(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changePage = (page: number): void => {
    setCurrentPage(page);
    listUsers(page * itemsPerPage);
  };

  useEffect(() => {
    listUsers();
    //eslint-disable-next-line
  }, []);

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

        {isLoading ? (
          <DataTable.Row>
            <DataTable.Cell style={{ justifyContent: 'center' }}>
              <ActivityIndicator />
            </DataTable.Cell>
          </DataTable.Row>
        ) : (
          list.items.map((item) => (
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
          ))
        )}

        <DataTable.Pagination
          page={currentPage}
          numberOfPages={Math.ceil(list.meta.total / itemsPerPage)}
          onPageChange={changePage}
          label={`${currentPage + 1} de ${Math.ceil(list.meta.total / itemsPerPage)}`}
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
