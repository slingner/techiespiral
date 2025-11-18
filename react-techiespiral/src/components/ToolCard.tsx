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
  Link as ChakraLink
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Tool } from '../types/Tool';
import { ScoutScore } from './ScoutScore';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Box
      bg="white"
      rounded="xl"
      p={6}
      shadow="md"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'xl'
      }}
    >
      <VStack align="stretch" spacing={4}>
        {/* Tool Header */}
        <Flex align="center" gap={3}>
          <Box
            w="56px"
            h="56px"
            rounded="xl"
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
                rounded="lg"
              />
            ) : (
              <Text fontSize="xl" fontWeight="bold" color="gray.500">
                {tool.tool_name.charAt(0).toUpperCase()}
              </Text>
            )}
          </Box>
          
          <Box flex="1">
            <Heading size="md" color="gray.800" mb={1}>
              {tool.tool_name}
            </Heading>
          </Box>
        </Flex>

        {/* Tags */}
        <HStack spacing={2} flexWrap="wrap">
          <Badge colorScheme="blue" fontSize="xs">
            {tool.category}
          </Badge>
          <Badge colorScheme="yellow" fontSize="xs">
            {tool.price_range}
          </Badge>
          {tool.best_for && (
            <Badge colorScheme="red" fontSize="xs">
              {tool.best_for}
            </Badge>
          )}
          {tool.scout_score && (
            <ScoutScore scoutScore={tool.scout_score} size="sm" />
          )}
        </HStack>

        {/* Description */}
        <Text color="gray.600" fontSize="sm" lineHeight="1.5">
          {tool.description || 'Discover what this tool can do for you.'}
        </Text>

        {/* Action Buttons */}
        <Flex gap={2}>
          <Button
            as={RouterLink}
            to={`/tool/${tool.Id}`}
            colorScheme="purple"
            size="sm"
            flex="1"
          >
            Learn More
          </Button>
          <Button
            as={ChakraLink}
            href={tool.affiliate_link || tool.website_url}
            target="_blank"
            colorScheme="blue"
            size="sm"
            flex="1"
          >
            Try It Now
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};