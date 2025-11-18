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
import { Tool, StartupStage } from '../types/Tool';
import { ScoutScore } from './ScoutScore';

interface ToolCardProps {
  tool: Tool;
}

const STAGE_LABELS: Record<StartupStage, string> = {
  validating: 'Validating',
  mvp: 'MVP',
  launched: 'Launched',
  scaling: 'Scaling'
};

export const ToolCard = ({ tool }: ToolCardProps) => {
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
            {tool.scout_score && (
              <ScoutScore scoutScore={tool.scout_score} size="sm" />
            )}
          </Box>
        </Flex>

        {/* Tags */}
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} flexWrap="wrap">
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
              {tool.startup_stages.map(stage => (
                <Badge
                  key={stage}
                  bg="blue.50"
                  color="blue.700"
                  fontSize="9px"
                  px={2}
                  py={0.5}
                  borderRadius="sm"
                >
                  {STAGE_LABELS[stage]}
                </Badge>
              ))}
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
          >
            Visit Site
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};