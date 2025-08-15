import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  VStack,
  HStack,
  Flex,
  Grid,
  GridItem,
  List,
  ListItem,
  ListIcon,
  Spinner,
  Alert,
  AlertIcon,
  Link as ChakraLink,
  SimpleGrid
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { Tool } from '../types/Tool';
import { toolsApi } from '../services/api';
import { useTools } from '../hooks/useTools';

export const ToolDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { tools: allTools } = useTools();

  useEffect(() => {
    const fetchTool = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const toolData = await toolsApi.fetchToolById(parseInt(id));
        setTool(toolData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tool');
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  const getRelatedTools = () => {
    if (!tool) return [];
    
    const relatedTools = allTools
      .filter(t => t.category === tool.category && t.Id !== tool.Id)
      .slice(0, 3);
    
    if (relatedTools.length < 3) {
      const otherTools = allTools
        .filter(t => t.category !== tool.category && t.Id !== tool.Id)
        .slice(0, 3 - relatedTools.length);
      relatedTools.push(...otherTools);
    }
    
    return relatedTools;
  };

  const parseFeatures = (features?: string) => {
    if (!features) return [];
    return features.split(', ').filter(f => f.trim());
  };

  const parseProsCons = (prosConsText?: string) => {
    if (!prosConsText) return { pros: '', cons: '' };
    
    const parts = prosConsText.split('CONS:');
    const pros = parts[0].replace('PROS:', '').trim();
    const cons = parts[1] ? parts[1].trim() : '';
    
    return { pros, cons };
  };

  if (loading) {
    return (
      <VStack spacing={4} py={20}>
        <Spinner size="xl" color="blue.500" />
        <Text color="gray.600">Loading tool details...</Text>
      </VStack>
    );
  }

  if (error || !tool) {
    return (
      <Alert status="error" rounded="md">
        <AlertIcon />
        Tool not found or failed to load
      </Alert>
    );
  }

  const features = parseFeatures(tool.features);
  const { pros, cons } = parseProsCons(tool.pros_cons);
  const relatedTools = getRelatedTools();

  return (
    <VStack spacing={10} align="stretch">
      {/* Tool Hero Section */}
      <Box bg="white" rounded="2xl" p={10} shadow="lg">
        <VStack spacing={6} align="stretch">
          {/* Tool Header */}
          <Flex align="center" gap={6}>
            <Box
              w="80px"
              h="80px"
              rounded="2xl"
              bg="gray.50"
              border="2px"
              borderColor="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              {tool.logo_url ? (
                <Image
                  src={tool.logo_url}
                  alt={tool.tool_name}
                  w="full"
                  h="full"
                  objectFit="cover"
                  rounded="xl"
                />
              ) : (
                <Text fontSize="2xl" fontWeight="bold" color="gray.500">
                  {tool.tool_name.charAt(0).toUpperCase()}
                </Text>
              )}
            </Box>
            
            <VStack align="flex-start" flex="1">
              <Heading size="xl" color="gray.800">
                {tool.tool_name}
              </Heading>
              <HStack spacing={2} flexWrap="wrap">
                <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                  {tool.category}
                </Badge>
                <Badge colorScheme="yellow" fontSize="sm" px={3} py={1}>
                  {tool.price_range}
                </Badge>
                {tool.best_for && (
                  <Badge colorScheme="red" fontSize="sm" px={3} py={1}>
                    {tool.best_for}
                  </Badge>
                )}
              </HStack>
            </VStack>
          </Flex>

          {/* Description */}
          <Text fontSize="lg" color="gray.600" lineHeight="1.7">
            {tool.long_description || tool.description || 'Detailed description coming soon.'}
          </Text>

          {/* CTA Buttons */}
          <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
            <Button
              as={ChakraLink}
              href={tool.website_url}
              target="_blank"
              colorScheme="blue"
              size="lg"
              flex="1"
            >
              Visit Official Website
            </Button>
            <Button
              as={ChakraLink}
              href={tool.affiliate_link || tool.website_url}
              target="_blank"
              colorScheme="red"
              size="lg"
              flex="1"
            >
              Get Started Now
            </Button>
          </Flex>
        </VStack>
      </Box>

      {/* Content Grid */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10}>
        {/* Features */}
        <GridItem>
          <Box bg="white" rounded="xl" p={8} shadow="md">
            <Heading size="lg" mb={4} color="gray.800">
              Key Features
            </Heading>
            {features.length > 0 ? (
              <List spacing={2}>
                {features.map((feature, index) => (
                  <ListItem key={index} color="gray.600">
                    <ListIcon as={CheckIcon} color="green.500" />
                    {feature}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text color="gray.500">Feature information coming soon.</Text>
            )}
          </Box>
        </GridItem>

        {/* Use Cases */}
        <GridItem>
          <Box bg="white" rounded="xl" p={8} shadow="md">
            <Heading size="lg" mb={4} color="gray.800">
              Best Use Cases
            </Heading>
            <Text color="gray.600" lineHeight="1.7">
              {tool.use_cases || 'Use case information coming soon.'}
            </Text>
          </Box>
        </GridItem>
      </Grid>

      {/* Pros & Cons */}
      {(pros || cons) && (
        <Box bg="white" rounded="xl" p={8} shadow="md">
          <Heading size="lg" mb={6} color="gray.800">
            Pros & Cons
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            <Box bg="green.50" rounded="lg" p={4} borderLeft="4px" borderColor="green.400">
              <Heading size="md" color="green.600" mb={2}>
                Pros
              </Heading>
              <Text color="gray.700">{pros || 'Pros information coming soon.'}</Text>
            </Box>
            <Box bg="red.50" rounded="lg" p={4} borderLeft="4px" borderColor="red.400">
              <Heading size="md" color="red.600" mb={2}>
                Cons
              </Heading>
              <Text color="gray.700">{cons || 'Cons information coming soon.'}</Text>
            </Box>
          </Grid>
        </Box>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <Box bg="white" rounded="xl" p={8} shadow="md">
          <Heading size="lg" mb={6} color="gray.800">
            Related Tools
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {relatedTools.map(relatedTool => (
              <Box
                key={relatedTool.Id}
                as={RouterLink}
                to={`/tool/${relatedTool.Id}`}
                bg="gray.50"
                rounded="lg"
                p={4}
                border="1px"
                borderColor="gray.200"
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                  textDecoration: 'none'
                }}
              >
                <Flex align="center" gap={3} mb={2}>
                  <Box
                    w="32px"
                    h="32px"
                    rounded="md"
                    bg="white"
                    border="1px"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {relatedTool.logo_url ? (
                      <Image
                        src={relatedTool.logo_url}
                        alt={relatedTool.tool_name}
                        w="full"
                        h="full"
                        objectFit="cover"
                        rounded="sm"
                      />
                    ) : (
                      <Text fontSize="sm" fontWeight="bold" color="gray.500">
                        {relatedTool.tool_name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </Box>
                  <Text fontWeight="semibold" color="gray.800">
                    {relatedTool.tool_name}
                  </Text>
                </Flex>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {relatedTool.description || 'Discover what this tool can do for you.'}
                </Text>
                <Badge colorScheme="blue" fontSize="xs">
                  {relatedTool.category}
                </Badge>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};