import { useState } from 'react';
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
  AlertIcon,
  Container
} from '@chakra-ui/react';
import { ToolCard } from '../components/ToolCard';
import { useFilteredTools } from '../hooks/useTools';

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

  const { tools, loading, error } = useFilteredTools(searchTerm, selectedCategory);

  const displayedTools = tools.slice(0, displayCount);
  const hasMoreTools = tools.length > displayCount;

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
          <AlertIcon />
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
          Find Your Perfect Tech Tools
        </Heading>
        <Text fontSize="xl" maxW="600px" mx="auto" opacity={0.9}>
          Discover the best software tools to boost your productivity and build amazing projects
        </Text>
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
      {tools.length === 0 ? (
        <Alert status="info" rounded="md">
          <AlertIcon />
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
              Showing {displayedTools.length} of {tools.length} tools
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
    </VStack>
  );
};