import { useMemo, useEffect, useState } from 'react';
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
  Image,
  Link as ChakraLink,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Container
} from '@chakra-ui/react';
import { useToolsContext } from '../context/ToolsContext';
import { comparisonsApi } from '../services/comparisonsApi';
import { FeaturedComparison, generateSlug } from '../types/Tool';
import { ScoutScore } from '../components/ScoutScore';
import { ComparisonSEO } from '../components/ComparisonSEO';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const ComparisonDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { tools, loading: toolsLoading } = useToolsContext();
  const [comparison, setComparison] = useState<FeaturedComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Fetch comparison data
  useEffect(() => {
    const fetchComparison = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await comparisonsApi.fetchComparisonBySlug(slug);
        setComparison(data);
      } catch (error) {
        console.error('Error fetching comparison:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [slug]);

  const tool1 = useMemo(() => {
    if (!comparison) return null;
    return tools.find(t => {
      const toolSlug = t.slug || generateSlug(t.tool_name);
      return toolSlug === comparison.tool1_slug || t.Id === comparison.tool1_id;
    }) || null;
  }, [comparison, tools]);

  const tool2 = useMemo(() => {
    if (!comparison) return null;
    return tools.find(t => {
      const toolSlug = t.slug || generateSlug(t.tool_name);
      return toolSlug === comparison.tool2_slug || t.Id === comparison.tool2_id;
    }) || null;
  }, [comparison, tools]);

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

  if (loading || toolsLoading) {
    return (
      <Container maxW="6xl" centerContent py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading comparison...</Text>
        </VStack>
      </Container>
    );
  }

  if (!comparison || !tool1 || !tool2) {
    return (
      <Container maxW="6xl" py={20}>
        <Alert status="error" rounded="md">
          Comparison not found
        </Alert>
      </Container>
    );
  }

  const tool1ProsCons = parseProsCons(tool1.pros_cons);
  const tool2ProsCons = parseProsCons(tool2.pros_cons);

  return (
    <>
      {/* SEO Component */}
      <ComparisonSEO comparison={comparison} tool1={tool1} tool2={tool2} />

      <Container maxW="6xl">
        <VStack spacing={10} align="stretch">
          {/* Breadcrumbs */}
          <Breadcrumbs items={[
            { label: 'Compare', href: '/compare' },
            { label: `${tool1.tool_name} vs ${tool2.tool_name}` }
          ]} />

          {/* Hero Section */}
          <Box bg="white" rounded="2xl" p={10} shadow="lg">
            <VStack spacing={6} align="stretch">
              {/* Title with H1 for SEO */}
              <Heading as="h1" size="2xl" color="gray.800" textAlign="center">
                {comparison.title}
              </Heading>

              {/* Tool Logos */}
              <Flex justify="center" align="center" gap={8}>
                <VStack>
                  {tool1.logo_url && (
                    <Image
                      src={tool1.logo_url}
                      alt={`${tool1.tool_name} logo`}
                      boxSize="80px"
                      rounded="lg"
                    />
                  )}
                  <Heading size="md">{tool1.tool_name}</Heading>
                  {tool1.scout_score && (
                    <ScoutScore scoutScore={tool1.scout_score} size="sm" />
                  )}
                </VStack>

                <Text fontSize="4xl" fontWeight="bold" color="gray.400">
                  VS
                </Text>

                <VStack>
                  {tool2.logo_url && (
                    <Image
                      src={tool2.logo_url}
                      alt={`${tool2.tool_name} logo`}
                      boxSize="80px"
                      rounded="lg"
                    />
                  )}
                  <Heading size="md">{tool2.tool_name}</Heading>
                  {tool2.scout_score && (
                    <ScoutScore scoutScore={tool2.scout_score} size="sm" />
                  )}
                </VStack>
              </Flex>

              {/* Summary */}
              <Text fontSize="lg" color="gray.700" lineHeight="1.8" textAlign="center" maxW="800px" mx="auto">
                {comparison.summary}
              </Text>

              {/* Quick CTAs */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Button
                  as={ChakraLink}
                  href={tool1.website_url}
                  target="_blank"
                  colorScheme="blue"
                  size="lg"
                  leftIcon={tool1.logo_url ? <Image src={tool1.logo_url} boxSize="20px" /> : undefined}
                >
                  Try {tool1.tool_name}
                </Button>
                <Button
                  as={ChakraLink}
                  href={tool2.website_url}
                  target="_blank"
                  colorScheme="purple"
                  size="lg"
                  leftIcon={tool2.logo_url ? <Image src={tool2.logo_url} boxSize="20px" /> : undefined}
                >
                  Try {tool2.tool_name}
                </Button>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Quick Comparison Table */}
          <Box bg="white" rounded="2xl" p={8} shadow="md">
            <Heading size="lg" mb={6} color="gray.800">
              📊 Quick Comparison
            </Heading>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>Feature</Th>
                  <Th>{tool1.tool_name}</Th>
                  <Th>{tool2.tool_name}</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td fontWeight="semibold">Category</Td>
                  <Td><Badge colorScheme="blue">{tool1.category}</Badge></Td>
                  <Td><Badge colorScheme="purple">{tool2.category}</Badge></Td>
                </Tr>
                <Tr>
                  <Td fontWeight="semibold">Price Range</Td>
                  <Td><Badge colorScheme="green">{tool1.price_range}</Badge></Td>
                  <Td><Badge colorScheme="green">{tool2.price_range}</Badge></Td>
                </Tr>
                {(tool1.scout_score || tool2.scout_score) && (
                  <Tr>
                    <Td fontWeight="semibold">Scout Score</Td>
                    <Td>
                      {tool1.scout_score ? (
                        <Badge colorScheme="purple" fontSize="md">{tool1.scout_score}/100</Badge>
                      ) : (
                        <Text color="gray.400">Not rated</Text>
                      )}
                    </Td>
                    <Td>
                      {tool2.scout_score ? (
                        <Badge colorScheme="purple" fontSize="md">{tool2.scout_score}/100</Badge>
                      ) : (
                        <Text color="gray.400">Not rated</Text>
                      )}
                    </Td>
                  </Tr>
                )}
                <Tr>
                  <Td fontWeight="semibold">Best For</Td>
                  <Td>{tool1.best_for || 'General use'}</Td>
                  <Td>{tool2.best_for || 'General use'}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>

          {/* Detailed Feature Comparison */}
          <Box bg="white" rounded="2xl" p={8} shadow="md">
            <Heading size="lg" mb={6} color="gray.800">
              ⚡ Features Comparison
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Heading size="md" mb={4} color="blue.600">
                  {tool1.tool_name} Features
                </Heading>
                {parseFeatures(tool1.features).length > 0 ? (
                  <VStack align="flex-start" spacing={2}>
                    {parseFeatures(tool1.features).map((feature, i) => (
                      <HStack key={i}>
                        <Text color="green.500">✓</Text>
                        <Text fontSize="sm">{feature}</Text>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500" fontSize="sm">No features listed</Text>
                )}
              </Box>

              <Box>
                <Heading size="md" mb={4} color="purple.600">
                  {tool2.tool_name} Features
                </Heading>
                {parseFeatures(tool2.features).length > 0 ? (
                  <VStack align="flex-start" spacing={2}>
                    {parseFeatures(tool2.features).map((feature, i) => (
                      <HStack key={i}>
                        <Text color="green.500">✓</Text>
                        <Text fontSize="sm">{feature}</Text>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500" fontSize="sm">No features listed</Text>
                )}
              </Box>
            </SimpleGrid>
          </Box>

          {/* Pros and Cons */}
          <Box bg="white" rounded="2xl" p={8} shadow="md">
            <Heading size="lg" mb={6} color="gray.800">
              ⚖️ Pros & Cons
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Tool 1 Pros/Cons */}
              <VStack align="stretch" spacing={4}>
                <Heading size="md" color="blue.600">{tool1.tool_name}</Heading>
                <Box bg="green.50" p={4} rounded="lg" borderLeft="4px" borderColor="green.400">
                  <Text fontWeight="semibold" color="green.700" mb={2}>Pros</Text>
                  <Text fontSize="sm" color="gray.700">
                    {tool1ProsCons.pros || 'No pros listed'}
                  </Text>
                </Box>
                <Box bg="red.50" p={4} rounded="lg" borderLeft="4px" borderColor="red.400">
                  <Text fontWeight="semibold" color="red.700" mb={2}>Cons</Text>
                  <Text fontSize="sm" color="gray.700">
                    {tool1ProsCons.cons || 'No cons listed'}
                  </Text>
                </Box>
              </VStack>

              {/* Tool 2 Pros/Cons */}
              <VStack align="stretch" spacing={4}>
                <Heading size="md" color="purple.600">{tool2.tool_name}</Heading>
                <Box bg="green.50" p={4} rounded="lg" borderLeft="4px" borderColor="green.400">
                  <Text fontWeight="semibold" color="green.700" mb={2}>Pros</Text>
                  <Text fontSize="sm" color="gray.700">
                    {tool2ProsCons.pros || 'No pros listed'}
                  </Text>
                </Box>
                <Box bg="red.50" p={4} rounded="lg" borderLeft="4px" borderColor="red.400">
                  <Text fontWeight="semibold" color="red.700" mb={2}>Cons</Text>
                  <Text fontSize="sm" color="gray.700">
                    {tool2ProsCons.cons || 'No cons listed'}
                  </Text>
                </Box>
              </VStack>
            </SimpleGrid>
          </Box>

          {/* Use Case Recommendations */}
          {comparison.use_case_recommendations && (
            <Box bg="blue.50" rounded="2xl" p={8} shadow="md" borderLeft="6px" borderColor="blue.500">
              <Heading size="lg" mb={4} color="gray.800">
                🎯 Which Should You Choose?
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8" whiteSpace="pre-line">
                {comparison.use_case_recommendations}
              </Text>
            </Box>
          )}

          {/* FAQs */}
          {comparison.faqs && comparison.faqs.length > 0 && (
            <Box bg="white" rounded="2xl" p={8} shadow="md">
              <Heading size="lg" mb={6} color="gray.800">
                ❓ Frequently Asked Questions
              </Heading>
              <Accordion allowMultiple>
                {comparison.faqs.map((faq, index) => (
                  <AccordionItem key={index} border="none" mb={4}>
                    <h2>
                      <AccordionButton
                        bg="gray.50"
                        _hover={{ bg: 'gray.100' }}
                        rounded="lg"
                        p={4}
                      >
                        <Box flex="1" textAlign="left" fontWeight="semibold" fontSize="md">
                          {faq.question}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} pt={4} px={4}>
                      <Text color="gray.700" lineHeight="1.7">
                        {faq.answer}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          )}

          {/* Bottom CTA */}
          <Box
            bgGradient="linear(135deg, blue.500, purple.500)"
            rounded="2xl"
            p={8}
            textAlign="center"
          >
            <Heading size="lg" color="white" mb={4}>
              Ready to Make Your Choice?
            </Heading>
            <Text color="whiteAlpha.900" fontSize="lg" mb={6}>
              Try both tools and see which one works best for your needs.
            </Text>
            <HStack justify="center" spacing={4}>
              <Button
                as={RouterLink}
                to={`/tool/${tool1.Id}`}
                colorScheme="whiteAlpha"
                size="lg"
                variant="solid"
              >
                Learn More About {tool1.tool_name}
              </Button>
              <Button
                as={RouterLink}
                to={`/tool/${tool2.Id}`}
                colorScheme="whiteAlpha"
                size="lg"
                variant="outline"
              >
                Learn More About {tool2.tool_name}
              </Button>
            </HStack>
          </Box>

          {/* Browse More Comparisons */}
          <Box textAlign="center">
            <Divider mb={6} />
            <Button
              as={RouterLink}
              to="/comparisons"
              colorScheme="blue"
              variant="outline"
              size="lg"
            >
              Browse All Comparisons
            </Button>
          </Box>
        </VStack>
      </Container>
    </>
  );
};
