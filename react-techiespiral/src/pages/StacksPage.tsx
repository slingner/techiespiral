import { useState } from "react";
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
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useStacksContext } from "../context/StacksContext";

export const StacksPage = () => {
  const { stacks, loading, error } = useStacksContext();
  const [displayCount, setDisplayCount] = useState(6);

  const displayedStacks = stacks.slice(0, displayCount);
  const hasMoreStacks = stacks.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  if (loading) {
    return (
      <Container maxW='6xl' centerContent py={20}>
        <VStack spacing={4}>
          <Spinner size='xl' color='blue.500' />
          <Text color='gray.600'>Loading tech stacks...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW='6xl' py={20}>
        <Alert status='error' rounded='md'>
          Failed to load tech stacks. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <VStack spacing={12} align='stretch'>
      {/* Hero Section - NYT Style */}
      <Box
        border='1px'
        borderColor='nyt.border'
        rounded='md'
        p={{ base: 10, md: 16 }}
        bg='blue.50'
      >
        <Heading size='2xl' mb={4} color='nyt.black'>
          Complete Tech Stacks for Indie Hackers
        </Heading>
        <Text fontSize='xl' maxW='700px' color='nyt.darkGray'>
          Proven tool combinations used by successful founders. Skip the
          research and start building.
        </Text>
      </Box>

      {/* Stacks Grid */}
      {stacks.length === 0 ? (
        <Alert status='info' rounded='md'>
          No tech stacks available yet. Check back soon!
        </Alert>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {displayedStacks.map((stack) => (
              <Box
                key={stack.id}
                as={RouterLink}
                to={`/stack/${stack.id}`}
                bg='white'
                border='1px'
                borderColor='nyt.border'
                p={6}
                transition='all 0.2s'
                _hover={{
                  borderColor: "nyt.black",
                  bg: "nyt.veryLightGray",
                  textDecoration: "none",
                }}
              >
                <VStack align='stretch' spacing={4}>
                  {/* Badge */}
                  {stack.badge && (
                    <Badge
                      bg='nyt.black'
                      color='white'
                      fontSize='10px'
                      px={3}
                      py={1}
                      alignSelf='flex-start'
                    >
                      {stack.badge}
                    </Badge>
                  )}

                  {/* Stack Name */}
                  <Heading size='md' color='nyt.black' fontWeight='700'>
                    {stack.stack_name}
                  </Heading>

                  {/* Tagline */}
                  <Text
                    fontSize='14px'
                    color='nyt.darkGray'
                    fontWeight='600'
                    fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
                    textTransform='uppercase'
                    letterSpacing='1px'
                  >
                    {stack.tagline}
                  </Text>

                  {/* Description */}
                  <Text
                    fontSize='16px'
                    color='nyt.mediumGray'
                    noOfLines={3}
                    lineHeight='1.6'
                  >
                    {stack.description}
                  </Text>

                  {/* Metadata */}
                  <Flex
                    gap={3}
                    pt={2}
                    borderTop='1px'
                    borderColor='nyt.border'
                    flexWrap='wrap'
                  >
                    <Badge
                      bg='nyt.veryLightGray'
                      color='nyt.mediumGray'
                      fontSize='11px'
                      px={2}
                      py={1}
                    >
                      {stack.category}
                    </Badge>
                    <Badge
                      bg='nyt.black'
                      color='white'
                      fontSize='11px'
                      px={2}
                      py={1}
                    >
                      {stack.total_monthly_cost}
                    </Badge>
                  </Flex>

                  {/* Target Audience */}
                  <Text
                    fontSize='13px'
                    color='nyt.mediumGray'
                    fontStyle='italic'
                  >
                    For: {stack.target_audience}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Load More - NYT Style */}
          {hasMoreStacks && (
            <Flex
              justify='center'
              align='center'
              direction='column'
              gap={4}
              mt={4}
            >
              <Text color='nyt.mediumGray' fontSize='14px' fontFamily='body'>
                Showing {displayedStacks.length} of {stacks.length} stacks
              </Text>
              <Button
                onClick={handleLoadMore}
                variant='outline'
                size='lg'
                px={10}
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
