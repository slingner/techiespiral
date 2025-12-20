import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  Button,
  Divider,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SEO } from '../components/SEO';
import { useArticle } from '../hooks/useArticles';

export const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading, error } = useArticle(slug!);

  if (loading) {
    return (
      <VStack spacing={4} py={20} justify="center" minH="50vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text color="gray.600">Loading article...</Text>
      </VStack>
    );
  }

  if (error || !article) {
    return (
      <Alert status="error" rounded="md">
        {error || 'Article not found'}
      </Alert>
    );
  }

  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Schema markup for Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "datePublished": article.publishedDate,
    "author": {
      "@type": "Organization",
      "name": "TechieSpiral"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TechieSpiral",
      "logo": {
        "@type": "ImageObject",
        "url": "https://techiespiral.com/images/logo.png"
      }
    },
    "articleSection": article.category,
    "wordCount": article.wordCount
  };

  return (
    <>
      <SEO
        title={article.title}
        description={article.description}
        url={`https://techiespiral.com/blog/${article.slug}`}
        keywords={article.keywords}
        type="article"
        schema={articleSchema}
      />

      <VStack spacing={8} align="stretch">
        {/* Back button */}
        <Button
          as={RouterLink}
          to="/blog"
          variant="ghost"
          size="sm"
          alignSelf="flex-start"
        >
          ← Back to Articles
        </Button>

        {/* Article Header */}
        <Box
          bg="white"
          border="1px"
          borderColor="nyt.border"
          p={{ base: 6, md: 10 }}
        >
          <VStack align="stretch" spacing={4}>
            {/* Meta info */}
            <HStack spacing={3} flexWrap="wrap">
              <Badge
                bg="nyt.black"
                color="white"
                fontSize="10px"
                px={2}
                py={1}
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                {article.category}
              </Badge>
              <Text
                fontSize="12px"
                color="nyt.mediumGray"
                fontFamily="body"
              >
                {formattedDate}
              </Text>
              <Text
                fontSize="12px"
                color="nyt.lightGray"
                fontFamily="body"
              >
                {article.wordCount} words · {Math.ceil(article.wordCount / 200)} min read
              </Text>
            </HStack>

            {/* Title */}
            <Heading
              as="h1"
              fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
              fontWeight="700"
              color="nyt.black"
              lineHeight="1.2"
              letterSpacing="-0.02em"
            >
              {article.title}
            </Heading>

            {/* Description */}
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="nyt.darkGray"
              lineHeight="1.6"
            >
              {article.description}
            </Text>

            {/* Tool tags */}
            {article.toolNames && article.toolNames.length > 0 && article.toolNames[0] !== 'Various' && (
              <>
                <Divider borderColor="nyt.border" />
                <HStack spacing={2} flexWrap="wrap">
                  <Text fontSize="12px" color="nyt.mediumGray" fontWeight="600">
                    Tools compared:
                  </Text>
                  {article.toolNames.map((tool, i) => (
                    <Badge
                      key={i}
                      bg="nyt.veryLightGray"
                      color="nyt.mediumGray"
                      fontSize="11px"
                      px={2}
                      py={1}
                    >
                      {tool}
                    </Badge>
                  ))}
                </HStack>
              </>
            )}
          </VStack>
        </Box>

        {/* Article Content */}
        <Box
          bg="white"
          border="1px"
          borderColor="nyt.border"
          p={{ base: 6, md: 10 }}
          className="article-content"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({children}) => (
                <Heading
                  as="h2"
                  fontSize={{ base: 'xl', md: '2xl' }}
                  fontWeight="700"
                  color="nyt.black"
                  mt={8}
                  mb={4}
                  borderBottom="2px"
                  borderColor="nyt.border"
                  pb={2}
                >
                  {children}
                </Heading>
              ),
              h3: ({children}) => (
                <Heading
                  as="h3"
                  fontSize={{ base: 'lg', md: 'xl' }}
                  fontWeight="600"
                  color="nyt.black"
                  mt={6}
                  mb={3}
                >
                  {children}
                </Heading>
              ),
              p: ({children}) => (
                <Text
                  fontSize={{ base: '16px', md: '18px' }}
                  lineHeight="1.8"
                  color="nyt.darkGray"
                  mb={4}
                >
                  {children}
                </Text>
              ),
              ul: ({children}) => (
                <Box as="ul" pl={6} mb={4}>
                  {children}
                </Box>
              ),
              li: ({children}) => (
                <Text
                  as="li"
                  fontSize={{ base: '16px', md: '18px' }}
                  lineHeight="1.8"
                  color="nyt.darkGray"
                  mb={2}
                >
                  {children}
                </Text>
              ),
              table: ({children}) => (
                <Box overflowX="auto" mb={6}>
                  <Box
                    as="table"
                    w="full"
                    border="1px"
                    borderColor="nyt.border"
                  >
                    {children}
                  </Box>
                </Box>
              ),
              thead: ({children}) => (
                <Box as="thead" bg="nyt.veryLightGray">
                  {children}
                </Box>
              ),
              th: ({children}) => (
                <Box
                  as="th"
                  p={3}
                  textAlign="left"
                  fontSize="14px"
                  fontWeight="700"
                  color="nyt.black"
                  borderBottom="1px"
                  borderColor="nyt.border"
                >
                  {children}
                </Box>
              ),
              td: ({children}) => (
                <Box
                  as="td"
                  p={3}
                  fontSize="15px"
                  color="nyt.mediumGray"
                  borderBottom="1px"
                  borderColor="nyt.border"
                >
                  {children}
                </Box>
              ),
              code: ({children}) => (
                <Box
                  as="code"
                  bg="nyt.veryLightGray"
                  px={1}
                  py={0.5}
                  borderRadius="sm"
                  fontSize="14px"
                  fontFamily="mono"
                >
                  {children}
                </Box>
              ),
              blockquote: ({children}) => (
                <Box
                  as="blockquote"
                  borderLeft="4px"
                  borderColor="nyt.black"
                  pl={4}
                  py={2}
                  my={4}
                  bg="nyt.veryLightGray"
                >
                  {children}
                </Box>
              ),
            }}
          >
            {article.content || ''}
          </ReactMarkdown>
        </Box>

        {/* Back to articles */}
        <Box textAlign="center" pt={8} borderTop="1px" borderColor="nyt.border">
          <Button
            as={RouterLink}
            to="/blog"
            variant="outline"
            size="lg"
          >
            ← Back to All Articles
          </Button>
        </Box>
      </VStack>
    </>
  );
};
