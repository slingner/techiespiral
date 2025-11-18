import { useMemo, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  SimpleGrid,
  Flex,
  Divider,
  Image
} from '@chakra-ui/react';
import { useStacksContext } from '../context/StacksContext';
import { useToolsContext } from '../context/ToolsContext';

export const StackDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getStackById, loading: stacksLoading } = useStacksContext();
  const { tools, getToolById, loading: toolsLoading } = useToolsContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const stack = useMemo(() => {
    if (!id) return null;
    return getStackById(parseInt(id));
  }, [id, getStackById]);

  const stackTools = useMemo(() => {
    if (!stack) return [];
    return stack.tool_ids
      .map(toolId => getToolById(toolId))
      .filter(tool => tool !== null);
  }, [stack, getToolById, tools]);

  const loading = stacksLoading || toolsLoading;

  if (loading) {
    return (
      <VStack spacing={4} py={20}>
        <Spinner size="xl" color="blue.500" />
        <Text color="gray.600">Loading stack details...</Text>
      </VStack>
    );
  }

  if (!stack || !id) {
    return (
      <Alert status="error" rounded="md">
        Stack not found or failed to load
      </Alert>
    );
  }

  const totalTools = stack.tool_ids.length;

  return (
    <VStack spacing={10} align="stretch">
      {/* Stack Hero */}
      <Box bg="white" rounded="2xl" p={10} shadow="lg">
        <VStack spacing={6} align="stretch">
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
              fontSize="md"
              px={4}
              py={2}
              alignSelf="flex-start"
              rounded="full"
            >
              {stack.badge}
            </Badge>
          )}

          {/* Stack Name */}
          <Heading size="2xl" color="gray.800">
            {stack.stack_name}
          </Heading>

          {/* Tagline */}
          <Text fontSize="2xl" color="blue.600" fontWeight="semibold">
            {stack.tagline}
          </Text>

          {/* Metadata */}
          <HStack spacing={3} flexWrap="wrap">
            <Badge colorScheme="gray" fontSize="sm" px={3} py={1}>
              {stack.category}
            </Badge>
            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
              {stack.total_monthly_cost}
            </Badge>
            <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
              {totalTools} Tools
            </Badge>
          </HStack>

          {/* Description */}
          <Text fontSize="lg" color="gray.600" lineHeight="1.8">
            {stack.description}
          </Text>

          {/* Target Audience */}
          <Box bg="blue.50" p={4} rounded="lg" borderLeft="4px" borderColor="blue.400">
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">
              Best For:
            </Text>
            <Text fontSize="md" color="gray.800" mt={1}>
              {stack.target_audience}
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Cost Breakdown */}
      <Box bg="white" rounded="2xl" p={8} shadow="md">
        <Heading size="lg" mb={4} color="gray.800">
          💰 Cost Breakdown
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box bg="green.50" p={4} rounded="lg">
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">
              Monthly Cost
            </Text>
            <Text fontSize="2xl" color="green.600" fontWeight="bold" mt={1}>
              {stack.total_monthly_cost}
            </Text>
          </Box>
          {stack.total_annual_cost && (
            <Box bg="blue.50" p={4} rounded="lg">
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                Annual Cost
              </Text>
              <Text fontSize="2xl" color="blue.600" fontWeight="bold" mt={1}>
                {stack.total_annual_cost}
              </Text>
            </Box>
          )}
        </SimpleGrid>
      </Box>

      {/* Tools in This Stack */}
      <Box bg="white" rounded="2xl" p={8} shadow="md">
        <Heading size="lg" mb={6} color="gray.800">
          🛠️ Tools in This Stack
        </Heading>

        {stackTools.length === 0 ? (
          <Alert status="info" rounded="md">
            Tools for this stack are being added. Check back soon!
          </Alert>
        ) : (
          <VStack spacing={4} align="stretch">
            {stackTools.map((tool, index) => (
              <Box key={tool?.Id || index}>
                <Flex
                  as={RouterLink}
                  to={`/tool/${tool?.Id}`}
                  p={4}
                  bg="gray.50"
                  rounded="lg"
                  border="2px"
                  borderColor="gray.200"
                  transition="all 0.2s"
                  align="center"
                  gap={4}
                  _hover={{
                    borderColor: 'blue.400',
                    bg: 'blue.50',
                    transform: 'translateX(4px)',
                    textDecoration: 'none'
                  }}
                >
                  {/* Tool Logo */}
                  <Box
                    w="48px"
                    h="48px"
                    rounded="lg"
                    bg="white"
                    border="1px"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {tool?.logo_url ? (
                      <Image
                        src={tool.logo_url}
                        alt={tool.tool_name}
                        w="full"
                        h="full"
                        objectFit="cover"
                        rounded="md"
                      />
                    ) : (
                      <Text fontSize="xl" fontWeight="bold" color="gray.500">
                        {tool?.tool_name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </Box>

                  {/* Tool Info */}
                  <VStack align="flex-start" flex="1" spacing={1}>
                    <Heading size="sm" color="gray.800">
                      {tool?.tool_name}
                    </Heading>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {tool?.description || 'Discover what this tool can do for you.'}
                    </Text>
                  </VStack>

                  {/* Tool Metadata */}
                  <VStack align="flex-end" spacing={1} flexShrink={0}>
                    <Badge colorScheme="blue" fontSize="xs">
                      {tool?.category}
                    </Badge>
                    <Badge colorScheme="green" fontSize="xs">
                      {tool?.price_range}
                    </Badge>
                  </VStack>
                </Flex>

                {index < stackTools.length - 1 && <Divider />}
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* CTA */}
      <Box bg="gradient" bgGradient="linear(135deg, blue.500, purple.500)" rounded="2xl" p={8} textAlign="center">
        <Heading size="lg" color="white" mb={4}>
          Ready to Build with This Stack?
        </Heading>
        <Text color="whiteAlpha.900" fontSize="lg" mb={6}>
          Explore each tool to get started, or browse more stacks to find your perfect match.
        </Text>
        <HStack justify="center" spacing={4}>
          <Button
            as={RouterLink}
            to="/stacks"
            colorScheme="whiteAlpha"
            size="lg"
            variant="solid"
          >
            Browse More Stacks
          </Button>
          <Button
            as={RouterLink}
            to="/"
            colorScheme="whiteAlpha"
            size="lg"
            variant="outline"
          >
            Explore All Tools
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
};
