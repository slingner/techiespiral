import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  VStack,
  HStack,
  Link as ChakraLink,
  Tooltip
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Tool } from '../types/Tool';
import { TechieScore } from './TechieScore';
import { STAGE_LABELS, getStageColors } from '../utils/stageColors';
import { trackToolClick } from '../utils/tracking';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const handleVisitSite = () => {
    trackToolClick({
      toolId: tool.Id,
      toolName: tool.tool_name,
      featured: tool.featured,
      sponsoredTier: tool.sponsored_tier,
      clickType: 'visit_site'
    });
  };

  const handleLearnMore = () => {
    trackToolClick({
      toolId: tool.Id,
      toolName: tool.tool_name,
      featured: tool.featured,
      sponsoredTier: tool.sponsored_tier,
      clickType: 'learn_more'
    });
  };

  return (
    <Box
      bg="white"
      border="1px"
      borderColor="nyt.border"
      p={6}
      transition="all 0.2s"
      _hover={{
        borderColor: 'nyt.black',
        bg: 'nyt.veryLightGray'
      }}
    >
      <VStack align="stretch" spacing={4}>
        {/* Tool Header */}
        <Flex align="flex-start" gap={4}>
          <Box
            w="60px"
            h="60px"
            border="1px"
            borderColor="nyt.border"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            flexShrink={0}
          >
            {tool.logo_url ? (
              <Image
                src={tool.logo_url}
                alt={tool.tool_name}
                w="full"
                h="full"
                objectFit="cover"
                loading="lazy"
              />
            ) : (
              <Text fontSize="2xl" fontWeight="bold" color="nyt.mediumGray">
                {tool.tool_name.charAt(0).toUpperCase()}
              </Text>
            )}
          </Box>

          <Box flex="1">
            <Heading
              size="md"
              color="nyt.black"
              mb={2}
              fontWeight="700"
              lineHeight="1.2"
            >
              {tool.tool_name}
            </Heading>
            {tool.techiespiral_score && (
              <TechieScore techieScore={tool.techiespiral_score} size="sm" />
            )}
          </Box>
        </Flex>

        {/* Tags */}
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} flexWrap="wrap">
            {tool.featured && (
              <Badge
                bg="gold"
                color="white"
                fontSize="10px"
                px={2}
                py={1}
                fontWeight="bold"
                boxShadow="sm"
              >
                ⭐ FEATURED
              </Badge>
            )}
            {tool.sponsored_tier && (
              <Badge
                bg={tool.sponsored_tier === 'gold' ? 'purple.500' : tool.sponsored_tier === 'silver' ? 'gray.400' : 'orange.400'}
                color="white"
                fontSize="10px"
                px={2}
                py={1}
                fontWeight="bold"
              >
                {tool.sponsored_tier.toUpperCase()} SPONSOR
              </Badge>
            )}
            <Badge bg="nyt.black" color="white" fontSize="10px" px={2} py={1}>
              {tool.category}
            </Badge>
            <Badge bg="nyt.veryLightGray" color="nyt.mediumGray" fontSize="10px" px={2} py={1}>
              {tool.price_range}
            </Badge>
            {tool.best_for && (
              <Badge bg="nyt.veryLightGray" color="nyt.mediumGray" fontSize="10px" px={2} py={1}>
                {tool.best_for}
              </Badge>
            )}
          </HStack>

          {/* Startup Stage Badges */}
          {tool.startup_stages && tool.startup_stages.length > 0 && (
            <HStack spacing={1} flexWrap="wrap">
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
                    fontSize="9px"
                    px={2}
                    py={0.5}
                    borderRadius="sm"
                  >
                    {STAGE_LABELS[stage]}
                  </Badge>
                );
              })}
            </HStack>
          )}
        </VStack>

        {/* Description */}
        <Text color="nyt.mediumGray" fontSize="16px" lineHeight="1.6">
          {tool.description || 'Discover what this tool can do for you.'}
        </Text>

        {/* Action Buttons */}
        <Flex gap={3} pt={2} borderTop="1px" borderColor="nyt.border">
          <Button
            as={RouterLink}
            to={`/tool/${tool.Id}`}
            variant="solid"
            size="sm"
            flex="1"
            onClick={handleLearnMore}
          >
            Learn More
          </Button>
          <Button
            as={ChakraLink}
            href={tool.affiliate_link || tool.website_url}
            target="_blank"
            variant="outline"
            size="sm"
            flex="1"
            onClick={handleVisitSite}
          >
            Visit Site
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};