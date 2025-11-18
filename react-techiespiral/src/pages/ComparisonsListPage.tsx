import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Container,
  Spinner,
  Alert,
  Badge,
  HStack,
  Input,
  Flex
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { comparisonsApi } from '../services/comparisonsApi';
import { FeaturedComparison } from '../types/Tool';

export const ComparisonsListPage = () => {
  const [comparisons, setComparisons] = useState<FeaturedComparison[]>([]);
  const [filteredComparisons, setFilteredComparisons] = useState<FeaturedComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        setLoading(true);
        const data = await comparisonsApi.fetchAllComparisons();
        setComparisons(data);
        setFilteredComparisons(data);
      } catch (error) {
        console.error('Error fetching comparisons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredComparisons(comparisons);
      return;
    }

    const filtered = comparisons.filter(comp =>
      comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.tool1_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.tool2_slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComparisons(filtered);
  }, [searchTerm, comparisons]);

  if (loading) {
    return (
      <Container maxW="6xl" centerContent py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading comparisons...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="6xl">
      <VStack spacing={10} align="stretch">
        {/* Hero Section */}
        <Box
          bgGradient="linear(135deg, green.600 0%, blue.600 50%, purple.400 100%)"
          rounded="3xl"
          p={{ base: 10, md: 16 }}
          textAlign="center"
          color="white"
        >
          <Heading as="h1" size="2xl" mb={4} textShadow="0 2px 10px rgba(0,0,0,0.3)">
            Tool Comparisons for Indie Hackers
          </Heading>
          <Text fontSize="xl" maxW="700px" mx="auto" opacity={0.9}>
            In-depth, SEO-optimized comparisons to help you choose the right tools for your startup
          </Text>
        </Box>

        {/* Search */}
        <Flex justify="center">
          <Input
            placeholder="Search comparisons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="400px"
            size="lg"
            bg="white"
            border="2px"
            borderColor="gray.200"
            _focus={{
              borderColor: 'blue.500',
              boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
            }}
          />
        </Flex>

        {/* Comparisons Grid */}
        {filteredComparisons.length === 0 ? (
          <Alert status="info" rounded="md">
            {searchTerm ? 'No comparisons found matching your search.' : 'No comparisons available yet.'}
          </Alert>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {filteredComparisons.map(comparison => (
              <Box
                key={comparison.id}
                as={RouterLink}
                to={`/comparisons/${comparison.id}`}
                bg="white"
                rounded="2xl"
                p={6}
                shadow="md"
                border="2px"
                borderColor="transparent"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'xl',
                  borderColor: 'blue.400',
                  textDecoration: 'none'
                }}
              >
                <VStack align="stretch" spacing={4}>
                  {/* VS Badge */}
                  <HStack justify="space-between" align="center">
                    <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>
                      {comparison.tool1_slug}
                    </Badge>
                    <Text fontWeight="bold" color="gray.400" fontSize="sm">
                      VS
                    </Text>
                    <Badge colorScheme="purple" fontSize="xs" px={2} py={1}>
                      {comparison.tool2_slug}
                    </Badge>
                  </HStack>

                  {/* Title */}
                  <Heading size="md" color="gray.800" lineHeight="1.4">
                    {comparison.title}
                  </Heading>

                  {/* Meta Description */}
                  <Text fontSize="sm" color="gray.600" noOfLines={3}>
                    {comparison.meta_description}
                  </Text>

                  {/* Winner Badge */}
                  {comparison.winner && comparison.winner !== 'tie' && (
                    <Badge
                      colorScheme="green"
                      fontSize="xs"
                      px={3}
                      py={1}
                      alignSelf="flex-start"
                    >
                      Winner: {comparison.winner === 'tool1' ? comparison.tool1_slug : comparison.tool2_slug}
                    </Badge>
                  )}

                  {/* FAQ Count */}
                  {comparison.faqs && comparison.faqs.length > 0 && (
                    <HStack>
                      <Text fontSize="xs" color="gray.500">
                        📝 {comparison.faqs.length} FAQs included
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}

        {/* Info Box */}
        <Box bg="blue.50" rounded="xl" p={6} borderLeft="4px" borderColor="blue.500">
          <Heading size="sm" color="gray.800" mb={2}>
            Why Our Comparisons Are Different
          </Heading>
          <Text fontSize="sm" color="gray.600" lineHeight="1.7">
            Every comparison is crafted specifically for indie hackers and bootstrapped founders. We focus on
            what matters: pricing, ease of use, and how well tools fit into your lean startup workflow.
            All comparisons include Scout Scores, FAQs, and real use-case recommendations.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};
