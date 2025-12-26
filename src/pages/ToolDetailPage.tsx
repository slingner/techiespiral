import { useMemo, useEffect } from 'react';
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
  Spinner,
  Alert,
  Link as ChakraLink,
  SimpleGrid,
  Divider
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useToolsContext } from '../context/ToolsContext';
import { TechieScore } from '../components/TechieScore';
import { SEO } from '../components/SEO';
import { STAGE_LABELS, getStageColors } from '../utils/stageColors';

export const ToolDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { tools: allTools, loading, getToolById } = useToolsContext();

  // Force scroll to top when this component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const tool = useMemo(() => {
    if (!id) return null;
    return getToolById(parseInt(id));
  }, [id, getToolById]);

  const getRelatedTools = useMemo(() => {
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
  }, [tool, allTools]);

  const getAlternativeTools = useMemo(() => {
    if (!tool || !tool.alternatives) return [];

    const alternativeIds = tool.alternatives.split(',').map(id => parseInt(id.trim()));
    return alternativeIds
      .map(id => getToolById(id))
      .filter(t => t !== null)
      .slice(0, 3);
  }, [tool, getToolById]);

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

  // Show loading only on initial app load, not during navigation
  if (loading && allTools.length === 0) {
    return (
      <VStack spacing={4} py={20}>
        <Spinner size="xl" color="blue.500" />
        <Text color="gray.600">Loading tool details...</Text>
      </VStack>
    );
  }

  // Show not found immediately if tool doesn't exist (no loading spinner)
  if (!loading && (!tool || !id)) {
    return (
      <Alert status="error" rounded="md">
        Tool not found or failed to load
      </Alert>
    );
  }

  // If still loading but we don't have the specific tool, show a minimal loading state
  if (!tool) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="lg" color="blue.500" />
        <Text color="gray.600">Loading...</Text>
      </VStack>
    );
  }

  const features = parseFeatures(tool.features);
  const { pros, cons } = parseProsCons(tool.pros_cons);
  const relatedTools = getRelatedTools;
  const alternativeTools = getAlternativeTools;

  // Create schema.org SoftwareApplication markup
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.tool_name,
    "description": tool.long_description || tool.description,
    "applicationCategory": tool.category,
    "offers": {
      "@type": "Offer",
      "price": tool.price_range,
      "priceCurrency": "USD"
    },
    "aggregateRating": tool.techiespiral_score ? {
      "@type": "AggregateRating",
      "ratingValue": tool.techiespiral_score,
      "bestRating": "10",
      "worstRating": "0"
    } : undefined,
    "url": tool.website_url,
    "image": tool.logo_url
  };

  return (
    <>
      <SEO
        title={`${tool.tool_name} Review - ${tool.category}`}
        description={tool.long_description || tool.description || `Discover ${tool.tool_name}, a ${tool.category} tool for indie hackers. ${tool.best_for || ''}`}
        url={`https://techiespiral.com/tool/${tool.Id}`}
        image={tool.logo_url}
        keywords={`${tool.tool_name}, ${tool.category}, ${tool.best_for || ''}, developer tools, indie hackers`}
        schema={schema}
      />
      <VStack spacing={10} align="stretch">
        {/* Tool Hero Section - NYT Style */}
      <Box bg="white" border="1px" borderColor="nyt.border" p={10}>
        <VStack spacing={6} align="stretch">
          {/* Tool Header */}
          <Flex align="center" gap={6}>
            <Box
              w="80px"
              h="80px"
              border="1px"
              borderColor="nyt.border"
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
                />
              ) : (
                <Text fontSize="2xl" fontWeight="bold" color="nyt.mediumGray">
                  {tool.tool_name.charAt(0).toUpperCase()}
                </Text>
              )}
            </Box>

            <VStack align="flex-start" flex="1" spacing={3}>
              <Heading size="xl" color="nyt.black" fontWeight="700">
                {tool.tool_name}
              </Heading>
              <HStack spacing={2} flexWrap="wrap">
                <Badge bg="nyt.black" color="white" fontSize="11px" px={3} py={1}>
                  {tool.category}
                </Badge>
                <Badge bg="nyt.veryLightGray" color="nyt.mediumGray" fontSize="11px" px={3} py={1}>
                  {tool.price_range}
                </Badge>
                {tool.best_for && (
                  <Badge bg="nyt.veryLightGray" color="nyt.mediumGray" fontSize="11px" px={3} py={1}>
                    {tool.best_for}
                  </Badge>
                )}
              </HStack>

              {/* Startup Stage Badges */}
              {tool.startup_stages && tool.startup_stages.length > 0 && (
                <HStack spacing={2} flexWrap="wrap">
                  <Text fontSize="11px" color="nyt.mediumGray" fontWeight="600">
                    Recommended for:
                  </Text>
                  {tool.startup_stages.map(stage => {
                    const colors = getStageColors(stage);
                    return (
                      <Badge
                        key={stage}
                        bg={colors.bg}
                        color={colors.color}
                        fontSize="10px"
                        px={2}
                        py={1}
                        borderRadius="sm"
                      >
                        {STAGE_LABELS[stage]}
                      </Badge>
                    );
                  })}
                </HStack>
              )}
            </VStack>
          </Flex>

          {/* Description */}
          <Text fontSize="18px" color="nyt.mediumGray" lineHeight="1.7">
            {tool.long_description || tool.description || 'Detailed description coming soon.'}
          </Text>

          {/* CTA Buttons */}
          <Flex gap={4} direction={{ base: 'column', sm: 'row' }} pt={4} borderTop="1px" borderColor="nyt.border">
            <Button
              as={ChakraLink}
              href={tool.website_url}
              target="_blank"
              variant="solid"
              size="lg"
              flex="1"
            >
              Visit Official Website
            </Button>
            <Button
              as={ChakraLink}
              href={tool.affiliate_link || tool.website_url}
              target="_blank"
              variant="outline"
              size="lg"
              flex="1"
            >
              Get Started Now
            </Button>
          </Flex>
        </VStack>
      </Box>

      {/* Content Grid - NYT Style */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10}>
        {/* Features */}
        <GridItem>
          <Box bg="white" border="1px" borderColor="nyt.border" p={8}>
            <Heading size="lg" mb={4} color="nyt.black" fontWeight="700">
              Key Features
            </Heading>
            {features.length > 0 ? (
              <List spacing={2}>
                {features.map((feature, index) => (
                  <ListItem key={index} color="nyt.mediumGray" fontSize="16px" lineHeight="1.6">
                    <Text as="span" color="nyt.black" mr={2}>✓</Text>
                    {feature}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text color="nyt.lightGray">Feature information coming soon.</Text>
            )}
          </Box>
        </GridItem>

        {/* Use Cases */}
        <GridItem>
          <Box bg="white" border="1px" borderColor="nyt.border" p={8}>
            <Heading size="lg" mb={4} color="nyt.black" fontWeight="700">
              Best Use Cases
            </Heading>
            <Text color="nyt.mediumGray" lineHeight="1.7" fontSize="16px">
              {tool.use_cases || 'Use case information coming soon.'}
            </Text>
          </Box>
        </GridItem>
      </Grid>

      {/* TechieSpiral Score */}
      {(tool.techiespiral_score || tool.value_score || tool.ease_score || tool.features_score) && (
        <Box bg="white" rounded="xl" p={8} shadow="md">
          <TechieScore
            techieScore={tool.techiespiral_score}
            valueScore={tool.value_score}
            easeScore={tool.ease_score}
            featuresScore={tool.features_score}
            size="lg"
            showDetails={true}
          />
        </Box>
      )}

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

      {/* Alternative Tools */}
      {alternativeTools.length > 0 && (
        <Box bg="white" rounded="xl" p={8} shadow="md">
          <Heading size="lg" mb={6} color="gray.800">
            🔄 Alternatives to {tool.tool_name}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {alternativeTools.map(altTool => (
              <Box
                key={altTool?.Id}
                as={RouterLink}
                to={`/tool/${altTool?.Id}`}
                bg="purple.50"
                rounded="lg"
                p={4}
                border="2px"
                borderColor="purple.200"
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                  borderColor: 'purple.400',
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
                    {altTool?.logo_url ? (
                      <Image
                        src={altTool.logo_url}
                        alt={altTool.tool_name}
                        w="full"
                        h="full"
                        objectFit="cover"
                        rounded="sm"
                        loading="lazy"
                      />
                    ) : (
                      <Text fontSize="sm" fontWeight="bold" color="gray.500">
                        {altTool?.tool_name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </Box>
                  <Text fontWeight="semibold" color="gray.800">
                    {altTool?.tool_name}
                  </Text>
                </Flex>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {altTool?.description || 'Discover what this tool can do for you.'}
                </Text>
                <HStack spacing={2}>
                  <Badge colorScheme="purple" fontSize="xs">
                    {altTool?.category}
                  </Badge>
                  <Badge colorScheme="green" fontSize="xs">
                    {altTool?.price_range}
                  </Badge>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
          <Divider my={4} />
          <Flex justify="center">
            <Button
              as={RouterLink}
              to={`/compare?tool1=${tool.Id}&tool2=${alternativeTools[0]?.Id}`}
              colorScheme="purple"
              variant="outline"
              size="sm"
            >
              Compare with Alternative
            </Button>
          </Flex>
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
                        loading="lazy"
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
    </>
  );
};