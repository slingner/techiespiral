import { useState, useMemo, useEffect } from 'react';
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
import { comparisonsApi } from '../services/comparisonsApi';
import { FeaturedComparison } from '../types/Tool';

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
  const [comparisons, setComparisons] = useState<FeaturedComparison[]>([]);

  const { tools: allTools, loading, error } = useToolsContext();
  const { stacks } = useStacksContext();

  // Fetch featured comparisons
  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        const data = await comparisonsApi.fetchAllComparisons();
        setComparisons(data);
      } catch (error) {
        console.error('Error fetching comparisons:', error);
      }
    };
    fetchComparisons();
  }, []);

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
    <VStack spacing={10} align="stretch">
      {/* Hero Section */}
      <Box
        bgGradient="linear(135deg, blue.600 0%, red.600 50%, yellow.400 100%)"
        rounded="3xl"
        p={{ base: 10, md: 20 }}
        textAlign="center"
        color="white"
      >
        <Heading size="2xl" mb={5} textShadow="0 2px 10px rgba(0,0,0,0.3)">
          The Tech Stack Advisor for Indie Hackers
        </Heading>
        <Text fontSize="xl" maxW="700px" mx="auto" opacity={0.9}>
          Curated tools and complete tech stacks to build, ship, and grow—without breaking the bank
        </Text>
        <HStack justify="center" spacing={4} mt={6} fontSize="sm" opacity={0.9}>
          <Text>🚀 Scout-Rated Tools</Text>
          <Text>•</Text>
          <Text>📦 Complete Stacks</Text>
          <Text>•</Text>
          <Text>💰 Budget-Friendly</Text>
        </HStack>
      </Box>

      {/* Search and Filter */}
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
          maxW="300px"
          bg="white"
          border="2px"
          borderColor="gray.200"
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
          }}
        />
        
        <Select
          placeholder="All Categories"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          maxW="200px"
          bg="white"
          border="2px"
          borderColor="gray.200"
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
          }}
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Flex>

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

          {/* Load More / Pagination */}
          <Flex justify="center" align="center" direction="column" gap={4}>
            <Text color="gray.600" fontSize="sm">
              Showing {displayedTools.length} of {filteredTools.length} tools
            </Text>
            
            {hasMoreTools && (
              <Button
                onClick={handleLoadMore}
                colorScheme="blue"
                size="lg"
                px={8}
              >
                Load More Tools
              </Button>
            )}
          </Flex>
        </>
      )}

      {/* Featured Tech Stacks Section */}
      {stacks.length > 0 && (
        <Box bg="white" rounded="2xl" p={8} shadow="md">
          <Flex justify="space-between" align="center" mb={6}>
            <VStack align="flex-start" spacing={1}>
              <Heading size="lg" color="gray.800">
                📦 Featured Tech Stacks
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Complete tool collections for indie hackers
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/stacks"
              colorScheme="blue"
              variant="outline"
            >
              View All Stacks
            </Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {stacks.slice(0, 3).map(stack => (
              <Box
                key={stack.id}
                as={RouterLink}
                to={`/stack/${stack.id}`}
                bg="gray.50"
                rounded="xl"
                p={5}
                border="2px"
                borderColor="gray.200"
                transition="all 0.3s"
                _hover={{
                  borderColor: 'blue.400',
                  bg: 'blue.50',
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                  textDecoration: 'none'
                }}
              >
                <VStack align="stretch" spacing={3}>
                  {stack.badge && (
                    <Badge
                      colorScheme={
                        stack.badge === 'Most Popular' ? 'purple' :
                        stack.badge === 'Popular' ? 'blue' :
                        stack.badge === 'Budget-Friendly' ? 'green' :
                        'orange'
                      }
                      fontSize="xs"
                      px={2}
                      py={1}
                      alignSelf="flex-start"
                    >
                      {stack.badge}
                    </Badge>
                  )}
                  <Heading size="sm" color="gray.800">
                    {stack.stack_name}
                  </Heading>
                  <Text fontSize="xs" color="blue.600" fontWeight="semibold">
                    {stack.tagline}
                  </Text>
                  <Text fontSize="xs" color="gray.600" noOfLines={2}>
                    {stack.description}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme="green" fontSize="xs">
                      {stack.total_monthly_cost}
                    </Badge>
                    <Badge colorScheme="gray" fontSize="xs">
                      {stack.tool_ids.length} tools
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Featured Comparisons Section */}
      {comparisons.length > 0 && (
        <Box bg="white" rounded="2xl" p={8} shadow="md">
          <Flex justify="space-between" align="center" mb={6}>
            <VStack align="flex-start" spacing={1}>
              <Heading size="lg" color="gray.800">
                ⚖️ Featured Comparisons
              </Heading>
              <Text fontSize="sm" color="gray.600">
                In-depth tool comparisons with FAQs and recommendations
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/comparisons"
              colorScheme="blue"
              variant="outline"
            >
              View All
            </Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {comparisons.slice(0, 4).map(comp => (
              <Box
                key={comp.id}
                as={RouterLink}
                to={`/comparisons/${comp.id}`}
                bg="gray.50"
                rounded="xl"
                p={4}
                border="2px"
                borderColor="gray.200"
                transition="all 0.3s"
                _hover={{
                  borderColor: 'blue.400',
                  bg: 'blue.50',
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                  textDecoration: 'none'
                }}
              >
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Badge colorScheme="blue" fontSize="xs">
                      {comp.tool1_slug}
                    </Badge>
                    <Text fontSize="xs" fontWeight="bold" color="gray.400">
                      VS
                    </Text>
                    <Badge colorScheme="purple" fontSize="xs">
                      {comp.tool2_slug}
                    </Badge>
                  </HStack>
                  <Heading size="sm" color="gray.800" noOfLines={2}>
                    {comp.title}
                  </Heading>
                  <Text fontSize="xs" color="gray.600" noOfLines={2}>
                    {comp.meta_description}
                  </Text>
                  {comp.faqs && comp.faqs.length > 0 && (
                    <Text fontSize="xs" color="gray.500">
                      📝 {comp.faqs.length} FAQs
                    </Text>
                  )}
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </VStack>
  );
};