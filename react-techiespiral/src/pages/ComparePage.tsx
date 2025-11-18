import { useState, useMemo } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Image,
  Alert,
  Flex,
  Link as ChakraLink
} from '@chakra-ui/react';
import { useToolsContext } from '../context/ToolsContext';
import { SearchableSelect } from '../components/SearchableSelect';

export const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tools } = useToolsContext();

  const tool1Id = searchParams.get('tool1');
  const tool2Id = searchParams.get('tool2');

  const [selectedTool1, setSelectedTool1] = useState(tool1Id || '');
  const [selectedTool2, setSelectedTool2] = useState(tool2Id || '');

  const tool1 = useMemo(() => {
    if (!selectedTool1) return null;
    return tools.find(t => t.Id === parseInt(selectedTool1)) || null;
  }, [selectedTool1, tools]);

  const tool2 = useMemo(() => {
    if (!selectedTool2) return null;
    return tools.find(t => t.Id === parseInt(selectedTool2)) || null;
  }, [selectedTool2, tools]);

  const handleCompare = () => {
    if (selectedTool1 && selectedTool2) {
      setSearchParams({ tool1: selectedTool1, tool2: selectedTool2 });
    }
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

  return (
    <VStack spacing={10} align="stretch">
      {/* Featured Comparisons Link */}
      <Box bg="blue.50" rounded="lg" p={4} borderLeft="4px" borderColor="blue.500">
        <Flex justify="space-between" align="center">
          <VStack align="flex-start" spacing={1}>
            <Text fontWeight="semibold" color="gray.800">
              📚 Looking for In-Depth Comparisons?
            </Text>
            <Text fontSize="sm" color="gray.600">
              Check out our SEO-optimized comparison guides with FAQs and detailed analysis
            </Text>
          </VStack>
          <Button
            as={RouterLink}
            to="/comparisons"
            colorScheme="blue"
            size="sm"
          >
            Browse Comparisons
          </Button>
        </Flex>
      </Box>

      {/* Hero */}
      <Box
        bgGradient="linear(135deg, green.600 0%, blue.600 50%, purple.400 100%)"
        rounded="3xl"
        p={{ base: 10, md: 16 }}
        textAlign="center"
        color="white"
      >
        <Heading size="2xl" mb={4} textShadow="0 2px 10px rgba(0,0,0,0.3)">
          Compare Tech Tools Side-by-Side
        </Heading>
        <Text fontSize="xl" maxW="700px" mx="auto" opacity={0.9}>
          Make informed decisions by comparing features, pricing, and pros & cons
        </Text>
      </Box>

      {/* Tool Selection */}
      <Box bg="white" rounded="2xl" p={8} shadow="md">
        <Heading size="lg" mb={6} color="gray.800">
          🔍 Search & Compare Tools
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={6}>
          Type to search through {tools.length} tools by name, category, or description. Click the search box and start typing!
        </Text>
        <Flex gap={4} direction={{ base: 'column', md: 'row' }} align="flex-start">
          <VStack flex="1" align="stretch" spacing={2}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
              Tool 1 (Type to search)
            </Text>
            <SearchableSelect
              tools={tools}
              value={selectedTool1}
              onChange={setSelectedTool1}
              placeholder="🔍 Type tool name, category, or keyword..."
              size="lg"
            />
          </VStack>

          <Flex align="center" pt={{ base: 0, md: 8 }} flexShrink={0}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.400">
              VS
            </Text>
          </Flex>

          <VStack flex="1" align="stretch" spacing={2}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
              Tool 2 (Type to search)
            </Text>
            <SearchableSelect
              tools={tools}
              value={selectedTool2}
              onChange={setSelectedTool2}
              placeholder="🔍 Type tool name, category, or keyword..."
              size="lg"
            />
          </VStack>

          <Flex pt={{ base: 0, md: 8 }} flexShrink={0}>
            <Button
              colorScheme="blue"
              size="lg"
              px={8}
              onClick={handleCompare}
              isDisabled={!selectedTool1 || !selectedTool2 || selectedTool1 === selectedTool2}
            >
              Compare
            </Button>
          </Flex>
        </Flex>
        <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">
          💡 Tip: Click inside the search box and start typing to filter tools instantly
        </Text>
      </Box>

      {/* Comparison Table */}
      {tool1 && tool2 ? (
        <Box bg="white" rounded="2xl" p={8} shadow="md" overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th w="200px">Feature</Th>
                <Th>
                  <VStack align="flex-start" spacing={2}>
                    <HStack>
                      {tool1.logo_url && (
                        <Image src={tool1.logo_url} alt={tool1.tool_name} boxSize="32px" rounded="md" />
                      )}
                      <Heading size="md">{tool1.tool_name}</Heading>
                    </HStack>
                    <Button
                      as={RouterLink}
                      to={`/tool/${tool1.Id}`}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </VStack>
                </Th>
                <Th>
                  <VStack align="flex-start" spacing={2}>
                    <HStack>
                      {tool2.logo_url && (
                        <Image src={tool2.logo_url} alt={tool2.tool_name} boxSize="32px" rounded="md" />
                      )}
                      <Heading size="md">{tool2.tool_name}</Heading>
                    </HStack>
                    <Button
                      as={RouterLink}
                      to={`/tool/${tool2.Id}`}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </VStack>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td fontWeight="semibold">Category</Td>
                <Td>
                  <Badge colorScheme="blue">{tool1.category}</Badge>
                </Td>
                <Td>
                  <Badge colorScheme="blue">{tool2.category}</Badge>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold">Price Range</Td>
                <Td>
                  <Badge colorScheme="green">{tool1.price_range}</Badge>
                </Td>
                <Td>
                  <Badge colorScheme="green">{tool2.price_range}</Badge>
                </Td>
              </Tr>
              {(tool1.scout_score || tool2.scout_score) && (
                <Tr>
                  <Td fontWeight="semibold">Scout Score</Td>
                  <Td>
                    {tool1.scout_score ? (
                      <Badge colorScheme="purple" fontSize="lg">
                        {tool1.scout_score}/100
                      </Badge>
                    ) : (
                      <Text color="gray.400">Not rated yet</Text>
                    )}
                  </Td>
                  <Td>
                    {tool2.scout_score ? (
                      <Badge colorScheme="purple" fontSize="lg">
                        {tool2.scout_score}/100
                      </Badge>
                    ) : (
                      <Text color="gray.400">Not rated yet</Text>
                    )}
                  </Td>
                </Tr>
              )}
              <Tr>
                <Td fontWeight="semibold">Description</Td>
                <Td>{tool1.description || 'No description available'}</Td>
                <Td>{tool2.description || 'No description available'}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold">Best For</Td>
                <Td>{tool1.best_for || 'N/A'}</Td>
                <Td>{tool2.best_for || 'N/A'}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" verticalAlign="top">Key Features</Td>
                <Td verticalAlign="top">
                  {parseFeatures(tool1.features).length > 0 ? (
                    <VStack align="flex-start" spacing={1}>
                      {parseFeatures(tool1.features).map((f, i) => (
                        <Text key={i} fontSize="sm">• {f}</Text>
                      ))}
                    </VStack>
                  ) : (
                    <Text color="gray.400">No features listed</Text>
                  )}
                </Td>
                <Td verticalAlign="top">
                  {parseFeatures(tool2.features).length > 0 ? (
                    <VStack align="flex-start" spacing={1}>
                      {parseFeatures(tool2.features).map((f, i) => (
                        <Text key={i} fontSize="sm">• {f}</Text>
                      ))}
                    </VStack>
                  ) : (
                    <Text color="gray.400">No features listed</Text>
                  )}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" verticalAlign="top">Pros</Td>
                <Td verticalAlign="top" bg="green.50">
                  <Text fontSize="sm" color="gray.700">
                    {parseProsCons(tool1.pros_cons).pros || 'No pros listed'}
                  </Text>
                </Td>
                <Td verticalAlign="top" bg="green.50">
                  <Text fontSize="sm" color="gray.700">
                    {parseProsCons(tool2.pros_cons).pros || 'No pros listed'}
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" verticalAlign="top">Cons</Td>
                <Td verticalAlign="top" bg="red.50">
                  <Text fontSize="sm" color="gray.700">
                    {parseProsCons(tool1.pros_cons).cons || 'No cons listed'}
                  </Text>
                </Td>
                <Td verticalAlign="top" bg="red.50">
                  <Text fontSize="sm" color="gray.700">
                    {parseProsCons(tool2.pros_cons).cons || 'No cons listed'}
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold">Official Website</Td>
                <Td>
                  <Button
                    as={ChakraLink}
                    href={tool1.website_url}
                    target="_blank"
                    size="sm"
                    colorScheme="blue"
                  >
                    Visit Website
                  </Button>
                </Td>
                <Td>
                  <Button
                    as={ChakraLink}
                    href={tool2.website_url}
                    target="_blank"
                    size="sm"
                    colorScheme="blue"
                  >
                    Visit Website
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Alert status="info" rounded="md">
          Select two different tools above to see a detailed comparison
        </Alert>
      )}
    </VStack>
  );
};
