import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { ToolsProvider } from './context/ToolsContext';

function App() {
  return (
    <ToolsProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tool/:id" element={<ToolDetailPage />} />
        </Routes>
      </Layout>
    </ToolsProvider>
  );
}

export default App;