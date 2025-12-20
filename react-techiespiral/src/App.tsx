import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Spinner, VStack } from '@chakra-ui/react';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { ToolsProvider } from './context/ToolsContext';
import { StacksProvider } from './context/StacksContext';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage').then(module => ({ default: module.ToolDetailPage })));
const StacksPage = lazy(() => import('./pages/StacksPage').then(module => ({ default: module.StacksPage })));
const StackDetailPage = lazy(() => import('./pages/StackDetailPage').then(module => ({ default: module.StackDetailPage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(module => ({ default: module.ComparePage })));
const QuizPage = lazy(() => import('./pages/QuizPage').then(module => ({ default: module.QuizPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(module => ({ default: module.BlogPage })));
const ArticlePage = lazy(() => import('./pages/ArticlePage').then(module => ({ default: module.ArticlePage })));

// Loading component
const PageLoader = () => (
  <VStack spacing={4} py={20} justify="center" minH="50vh">
    <Spinner size="xl" color="blue.500" thickness="4px" />
  </VStack>
);

function App() {
  return (
    <ToolsProvider>
      <StacksProvider>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tool/:id" element={<ToolDetailPage />} />
              <Route path="/stacks" element={<StacksPage />} />
              <Route path="/stack/:id" element={<StackDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticlePage />} />
            </Routes>
          </Suspense>
        </Layout>
      </StacksProvider>
    </ToolsProvider>
  );
}

export default App;