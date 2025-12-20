import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { StacksPage } from './pages/StacksPage';
import { StackDetailPage } from './pages/StackDetailPage';
import { ComparePage } from './pages/ComparePage';
import { QuizPage } from './pages/QuizPage';
import { ToolsProvider } from './context/ToolsContext';
import { StacksProvider } from './context/StacksContext';

function App() {
  return (
    <ToolsProvider>
      <StacksProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tool/:id" element={<ToolDetailPage />} />
            <Route path="/stacks" element={<StacksPage />} />
            <Route path="/stack/:id" element={<StackDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Routes>
        </Layout>
      </StacksProvider>
    </ToolsProvider>
  );
}

export default App;