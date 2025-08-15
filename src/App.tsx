import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ToolDetailPage } from './pages/ToolDetailPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tool/:id" element={<ToolDetailPage />} />
      </Routes>
    </Layout>
  );
}

export default App;