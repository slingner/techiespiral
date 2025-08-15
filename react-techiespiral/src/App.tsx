import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { ToolsProvider } from './context/ToolsContext';

function App() {
  return (
    <ToolsProvider>
      <ScrollToTop />
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