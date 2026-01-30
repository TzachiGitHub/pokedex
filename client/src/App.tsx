import { Container, Box } from '@mui/material';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SortToggle } from './components/SortToggle';
import { PokemonList } from './components/PokemonList';
import { PokemonProvider } from './context/PokemonContext';
import styles from './App.module.css';

function AppContent() {
  return (
    <Box className={styles.appContainer}>
      <Header />
      <Container maxWidth="xl" className={styles.mainContent}>
        <FilterBar />
        <SortToggle />
        <PokemonList />
      </Container>
    </Box>
  );
}

function App() {
  return (
    <PokemonProvider>
      <AppContent />
    </PokemonProvider>
  );
}

export default App;
