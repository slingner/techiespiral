import { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Select,
  SimpleGrid,
  VStack,
  Spinner,
  Container,
  HStack,
  Badge,
  Button,
  Flex,
} from '@chakra-ui/react';
import { ArticleCard } from '../components/ArticleCard';
import { SEO } from '../components/SEO';
import { useArticles } from '../hooks/useArticles';

export const BlogPage = () => {
  const { articles, loading } = useArticles();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [displayCount, setDisplayCount] = useState(12);

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category));
    return Array.from(cats).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      return matchesCategory;
    });
  }, [articles, selectedCategory]);

  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMoreArticles = filteredArticles.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  if (loading) {
    return (
      <Container maxW="6xl" centerContent py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading articles...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="Tool Comparisons & Guides"
        description="In-depth comparisons of developer tools, SaaS platforms, and tech solutions for indie hackers. Find the best tool for your project with detailed reviews and analysis."
        url="https://techiespiral.com/blog"
        keywords="tool comparisons, developer tools, SaaS comparisons, indie hacker guides, tech reviews"
      />
      <VStack spacing={12} align="stretch">
        {/* Hero Section */}
        <Box
          border="1px"
          borderColor="nyt.border"
          rounded="md"
          p={{ base: 10, md: 16 }}
          bg="white"
        >
          <Heading
            as="h1"
            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            fontWeight="700"
            color="nyt.black"
            lineHeight="1.1"
            mb={6}
            letterSpacing="-0.03em"
          >
            Tool Comparisons
            <br />
            for Indie Hackers
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="nyt.darkGray"
            maxW="800px"
            lineHeight="1.6"
            fontFamily="body"
          >
            In-depth comparisons and honest reviews to help you choose the right tools for your project
          </Text>
          <HStack spacing={3} mt={6}>
            <Badge
              bg="nyt.veryLightGray"
              color="nyt.mediumGray"
              px={3}
              py={1}
              borderRadius="md"
            >
              {articles.length} Articles
            </Badge>
            <Badge
              bg="nyt.veryLightGray"
              color="nyt.mediumGray"
              px={3}
              py={1}
              borderRadius="md"
            >
              Updated Weekly
            </Badge>
          </HStack>
        </Box>

        {/* Filter */}
        {categories.length > 1 && (
          <Box
            borderTop="1px"
            borderBottom="1px"
            borderColor="nyt.border"
            py={6}
            bg="nyt.veryLightGray"
          >
            <VStack spacing={3}>
              <Heading
                size="sm"
                color="nyt.black"
                fontWeight="700"
                textAlign="center"
              >
                Filter by Category
              </Heading>
              <Flex justify="center" w="full">
                <Select
                  placeholder="All Categories"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  maxW="300px"
                  bg="white"
                  borderColor="nyt.border"
                  fontSize="16px"
                  _focus={{
                    borderColor: 'nyt.black',
                    boxShadow: 'none',
                  }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Flex>
            </VStack>
          </Box>
        )}

        {/* Active Filter Display */}
        {selectedCategory && (
          <Box
            bg="white"
            border="1px"
            borderColor="nyt.border"
            p={4}
            borderRadius="md"
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Text fontSize="14px" fontWeight="600" color="nyt.mediumGray">
                  Showing:
                </Text>
                <Badge
                  bg="purple.100"
                  color="purple.800"
                  fontSize="12px"
                  px={3}
                  py={1}
                >
                  {selectedCategory}
                </Badge>
              </HStack>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setSelectedCategory('')}
              >
                Clear filter
              </Button>
            </Flex>
          </Box>
        )}

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <Box
            bg="white"
            border="1px"
            borderColor="gray.200"
            p={8}
            borderRadius="md"
          >
            <VStack spacing={4}>
              <Heading size="md" color="gray.700">
                No articles found
              </Heading>
              <Text color="gray.600" textAlign="center">
                No articles in this category yet. Check back soon!
              </Text>
            </VStack>
          </Box>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {displayedArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </SimpleGrid>

            {/* Load More */}
            {hasMoreArticles && (
              <Flex
                justify="center"
                align="center"
                direction="column"
                gap={4}
                mt={4}
              >
                <Text color="nyt.mediumGray" fontSize="14px" fontFamily="body">
                  Showing {displayedArticles.length} of {filteredArticles.length} articles
                </Text>
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  px={10}
                >
                  Load More Articles
                </Button>
              </Flex>
            )}
          </>
        )}
      </VStack>
    </>
  );
};
