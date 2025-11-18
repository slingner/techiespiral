import { useState } from 'react';
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
  Flex,
  Button
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useStacksContext } from '../context/StacksContext';

export const StacksPage = () => {
  const { stacks, loading, error } = useStacksContext();
  const [displayCount, setDisplayCount] = useState(6);

  const displayedStacks = stacks.slice(0, displayCount);
  const hasMoreStacks = stacks.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  if (loading) {
    return (
      <Container maxW="6xl" centerContent py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading tech stacks...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="6xl" py={20}>
        <Alert status="error" rounded="md">
          Failed to load tech stacks. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <VStack spacing={10} align="stretch">
      {/* Hero Section */}
      <Box
        bgGradient="linear(135deg, purple.600 0%, blue.600 50%, cyan.400 100%)"
        rounded="3xl"
        p={{ base: 10, md: 16 }}
        textAlign="center"
        color="white"
      >
        <Heading size="2xl" mb={4} textShadow="0 2px 10px rgba(0,0,0,0.3)">
          Complete Tech Stacks for Indie Hackers
        </Heading>
        <Text fontSize="xl" maxW="700px" mx="auto" opacity={0.9}>
          Proven tool combinations used by successful founders. Skip the research—start building.
        </Text>
      </Box>

      {/* Stacks Grid */}
      {stacks.length === 0 ? (
        <Alert status="info" rounded="md">
          No tech stacks available yet. Check back soon!
        </Alert>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {displayedStacks.map(stack => (
              <Box
                key={stack.id}
                as={RouterLink}
                to={`/stack/${stack.id}`}
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
                  {/* Badge */}
                  {stack.badge && (
                    <Badge
                      colorScheme={
                        stack.badge === 'Most Popular' ? 'purple' :
                        stack.badge === 'Popular' ? 'blue' :
                        stack.badge === 'Budget-Friendly' ? 'green' :
                        stack.badge === 'No-Code' ? 'orange' :
                        'red'
                      }
                      fontSize="xs"
                      px={2}
                      py={1}
                      alignSelf="flex-start"
                    >
                      {stack.badge}
                    </Badge>
                  )}

                  {/* Stack Name */}
                  <Heading size="md" color="gray.800">
                    {stack.stack_name}
                  </Heading>

                  {/* Tagline */}
                  <Text fontSize="sm" color="blue.600" fontWeight="semibold">
                    {stack.tagline}
                  </Text>

                  {/* Description */}
                  <Text fontSize="sm" color="gray.600" noOfLines={3}>
                    {stack.description}
                  </Text>

                  {/* Metadata */}
                  <Flex gap={2} flexWrap="wrap">
                    <Badge colorScheme="gray" fontSize="xs">
                      {stack.category}
                    </Badge>
                    <Badge colorScheme="green" fontSize="xs">
                      {stack.total_monthly_cost}
                    </Badge>
                  </Flex>

                  {/* Target Audience */}
                  <Text fontSize="xs" color="gray.500" fontStyle="italic">
                    For: {stack.target_audience}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Load More */}
          {hasMoreStacks && (
            <Flex justify="center" align="center" direction="column" gap={4}>
              <Text color="gray.600" fontSize="sm">
                Showing {displayedStacks.length} of {stacks.length} stacks
              </Text>
              <Button
                onClick={handleLoadMore}
                colorScheme="blue"
                size="lg"
                px={8}
              >
                Load More Stacks
              </Button>
            </Flex>
          )}
        </>
      )}
    </VStack>
  );
};
