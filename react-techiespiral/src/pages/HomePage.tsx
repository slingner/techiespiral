import { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Select,
  SimpleGrid,
  Flex,
  VStack,
  Button,
  Spinner,
  Alert,
  Container,
  HStack,
  Badge
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ToolCard } from '../components/ToolCard';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { useToolsContext } from '../context/ToolsContext';
import { useStacksContext } from '../context/StacksContext';

const CATEGORIES = [
  'Developer Tools',
  'Design Tools', 
  'Project Management',
  'Communication',
  'Analytics',
  'Marketing',
  'AI Tools',
  'No-Code Tools',
  'Hosting',
  'Database'
];

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [displayCount, setDisplayCount] = useState(24);

  const { tools: allTools, loading, error } = useToolsContext();
  const { stacks } = useStacksContext();

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = !searchTerm || 
        tool.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tool.best_for && tool.best_for.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !selectedCategory || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allTools, searchTerm, selectedCategory]);

  const displayedTools = filteredTools.slice(0, displayCount);
  const hasMoreTools = filteredTools.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 24);
  };

  if (loading) {
    return (
      <Container maxW="6xl" centerContent py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading amazing tools...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="6xl" py={20}>
        <Alert status="error" rounded="md">
          Failed to load tools. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <VStack spacing={12} align="stretch">
      {/* Hero Section - NYT Style */}
      <Box
        borderBottom="1px"
        borderColor="nyt.border"
        pb={8}
        textAlign="center"
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
          The Tech Stack Advisor
          <br />
          for Indie Hackers
        </Heading>
        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          color="nyt.darkGray"
          maxW="800px"
          mx="auto"
          lineHeight="1.6"
          fontFamily="body"
        >
          Curated tools and complete tech stacks to build, ship, and grow—without breaking the bank
        </Text>
        <HStack
          justify="center"
          spacing={3}
          mt={6}
        >
          <Badge
            bg="nyt.veryLightGray"
            color="nyt.mediumGray"
            px={3}
            py={1}
            borderRadius="md"
          >
            Scout-Rated Tools
          </Badge>
          <Badge
            bg="nyt.veryLightGray"
            color="nyt.mediumGray"
            px={3}
            py={1}
            borderRadius="md"
          >
            Complete Stacks
          </Badge>
          <Badge
            bg="nyt.veryLightGray"
            color="nyt.mediumGray"
            px={3}
            py={1}
            borderRadius="md"
          >
            Budget-Friendly
          </Badge>
        </HStack>
      </Box>

      {/* Search and Filter - NYT Style */}
      <Box
        borderTop="1px"
        borderBottom="1px"
        borderColor="nyt.border"
        py={6}
        bg="nyt.veryLightGray"
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          align="center"
          justify="center"
        >
          <Input
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="350px"
            bg="white"
            borderColor="nyt.border"
            fontSize="16px"
            _focus={{
              borderColor: 'nyt.black',
              boxShadow: 'none'
            }}
          />

          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            maxW="250px"
            bg="white"
            borderColor="nyt.border"
            fontSize="16px"
            _focus={{
              borderColor: 'nyt.black',
              boxShadow: 'none'
            }}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Flex>
      </Box>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <Alert status="info" rounded="md">
          No tools found matching your criteria.
        </Alert>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {displayedTools.map(tool => (
              <ToolCard key={tool.Id} tool={tool} />
            ))}
          </SimpleGrid>

          {/* Load More / Pagination - NYT Style */}
          <Flex justify="center" align="center" direction="column" gap={4} mt={4}>
            <Text color="nyt.mediumGray" fontSize="14px" fontFamily="body">
              Showing {displayedTools.length} of {filteredTools.length} tools
            </Text>

            {hasMoreTools && (
              <Button
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                px={10}
              >
                Load More Tools
              </Button>
            )}
          </Flex>
        </>
      )}

      {/* Featured Tech Stacks Section - NYT Style */}
      {stacks.length > 0 && (
        <Box
          borderTop="3px solid"
          borderColor="nyt.black"
          pt={8}
          mt={8}
        >
          <Flex justify="space-between" align="center" mb={8}>
            <VStack align="flex-start" spacing={2}>
              <Heading
                size="xl"
                color="nyt.black"
                fontWeight="700"
              >
                Featured Tech Stacks
              </Heading>
              <Text
                fontSize="16px"
                color="nyt.mediumGray"
                fontFamily="body"
              >
                Complete tool collections for indie hackers
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/stacks"
              variant="outline"
              display={{ base: 'none', md: 'flex' }}
            >
              View All Stacks
            </Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {stacks.slice(0, 3).map(stack => (
              <Box
                key={stack.id}
                as={RouterLink}
                to={`/stack/${stack.id}`}
                border="1px"
                borderColor="nyt.border"
                p={6}
                transition="all 0.2s"
                _hover={{
                  borderColor: 'nyt.black',
                  bg: 'nyt.veryLightGray',
                  textDecoration: 'none'
                }}
              >
                <VStack align="stretch" spacing={4}>
                  {stack.badge && (
                    <Badge
                      bg="nyt.black"
                      color="white"
                      fontSize="10px"
                      px={3}
                      py={1}
                      alignSelf="flex-start"
                    >
                      {stack.badge}
                    </Badge>
                  )}
                  <Heading
                    size="md"
                    color="nyt.black"
                    fontWeight="700"
                  >
                    {stack.stack_name}
                  </Heading>
                  <Text
                    fontSize="14px"
                    color="nyt.darkGray"
                    fontWeight="600"
                    fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
                    textTransform="uppercase"
                    letterSpacing="1px"
                  >
                    {stack.tagline}
                  </Text>
                  <Text
                    fontSize="16px"
                    color="nyt.mediumGray"
                    noOfLines={3}
                    lineHeight="1.6"
                  >
                    {stack.description}
                  </Text>
                  <HStack spacing={3} pt={2} borderTop="1px" borderColor="nyt.border">
                    <Badge bg="nyt.black" color="white" fontSize="11px" px={2} py={1}>
                      {stack.total_monthly_cost}
                    </Badge>
                    <Badge bg="nyt.veryLightGray" color="nyt.mediumGray" fontSize="11px" px={2} py={1}>
                      {stack.tool_ids.length} tools
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
          <Button
            as={RouterLink}
            to="/stacks"
            variant="outline"
            display={{ base: 'flex', md: 'none' }}
            mt={6}
            mx="auto"
          >
            View All Stacks
          </Button>
        </Box>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </VStack>
  );
};