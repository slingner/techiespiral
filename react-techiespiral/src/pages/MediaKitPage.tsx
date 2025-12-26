import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Divider,
  Button,
  Link as ChakraLink,
  HStack
} from '@chakra-ui/react';
import { SEO } from '../components/SEO';

export const MediaKitPage = () => {
  return (
    <>
      <SEO
        title="Media Kit - TechieSpiral"
        description="Media kit for TechieSpiral including audience demographics, traffic statistics, and partnership opportunities."
        url="https://techiespiral.com/media-kit"
      />

      <Container maxW="7xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Header */}
          <VStack spacing={4}>
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="700"
              color="nyt.black"
            >
              Media Kit
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="nyt.darkGray"
              maxW="800px"
              textAlign="center"
            >
              Everything you need to know about partnering with TechieSpiral
            </Text>
          </VStack>

          {/* About Section */}
          <Box
            bg="white"
            border="1px"
            borderColor="nyt.border"
            p={8}
            rounded="md"
          >
            <Heading size="md" mb={4} color="nyt.black">
              About TechieSpiral
            </Heading>
            <Text color="nyt.darkGray" lineHeight="1.8">
              TechieSpiral is the go-to resource for indie hackers and bootstrapped founders looking for the right tools to build, ship, and grow their products. We provide curated tool reviews, in-depth comparisons, and complete tech stack recommendations tailored for developers building on a budget.
            </Text>
          </Box>

          {/* Traffic Stats */}
          <Box>
            <Heading size="md" mb={6} color="nyt.black">
              Traffic & Reach
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Stat
                bg="white"
                border="1px"
                borderColor="nyt.border"
                p={6}
                rounded="md"
              >
                <StatLabel color="nyt.mediumGray">Monthly Visitors</StatLabel>
                <StatNumber color="purple.600" fontSize="3xl">
                  10,000+
                </StatNumber>
                <StatHelpText>Growing 25% MoM</StatHelpText>
              </Stat>

              <Stat
                bg="white"
                border="1px"
                borderColor="nyt.border"
                p={6}
                rounded="md"
              >
                <StatLabel color="nyt.mediumGray">Page Views</StatLabel>
                <StatNumber color="purple.600" fontSize="3xl">
                  35,000+
                </StatNumber>
                <StatHelpText>Per month</StatHelpText>
              </Stat>

              <Stat
                bg="white"
                border="1px"
                borderColor="nyt.border"
                p={6}
                rounded="md"
              >
                <StatLabel color="nyt.mediumGray">Avg. Session</StatLabel>
                <StatNumber color="purple.600" fontSize="3xl">
                  4:30
                </StatNumber>
                <StatHelpText>High engagement</StatHelpText>
              </Stat>

              <Stat
                bg="white"
                border="1px"
                borderColor="nyt.border"
                p={6}
                rounded="md"
              >
                <StatLabel color="nyt.mediumGray">Tools Indexed</StatLabel>
                <StatNumber color="purple.600" fontSize="3xl">
                  200+
                </StatNumber>
                <StatHelpText>And growing</StatHelpText>
              </Stat>
            </SimpleGrid>
          </Box>

          {/* Audience Demographics */}
          <Box>
            <Heading size="md" mb={6} color="nyt.black">
              Audience Demographics
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box
                bg="white"
                border="1px"
                borderColor="nyt.border"
                p={6}
                rounded="md"
              >
                <Heading size="sm" mb={4} color="nyt.black">
                  Who Visits TechieSpiral?
                </Heading>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Text color="nyt.darkGray">Indie Hackers</Text>
                    <Badge colorScheme="purple">42%</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="nyt.darkGray">Solo Developers</Text>
                    <Badge colorScheme="purple">28%</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="nyt.darkGray">Startup Founders</Text>
                    <Badge colorScheme="purple">18%</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="nyt.darkGray">Small Dev Teams</Text>
                    <Badge colorScheme="purple">12%</Badge>
                  </HStack>
                </VStack>
              </Box>

              <Box
                bg="white"
                border="1px"
                borderColor="nyt.border"
                p={6}
                rounded="md"
              >
                <Heading size="sm" mb={4} color="nyt.black">
                  Top Interests
                </Heading>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Text color="nyt.darkGray">Developer Tools</Text>
                    <Badge colorScheme="blue">68%</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="nyt.darkGray">Hosting & Infrastructure</Text>
                    <Badge colorScheme="blue">54%</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="nyt.darkGray">Payments & Billing</Text>
                    <Badge colorScheme="blue">47%</Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="nyt.darkGray">Marketing Tools</Text>
                    <Badge colorScheme="blue">32%</Badge>
                  </HStack>
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Content Reach */}
          <Box
            bg="white"
            border="1px"
            borderColor="nyt.border"
            p={8}
            rounded="md"
          >
            <Heading size="md" mb={6} color="nyt.black">
              Content Distribution
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <VStack align="start">
                <Heading size="sm" color="purple.600">
                  📝 Weekly Comparison Articles
                </Heading>
                <Text color="nyt.darkGray" fontSize="sm">
                  In-depth 2000+ word comparisons published every Monday, targeting high-intent keywords.
                </Text>
              </VStack>
              <VStack align="start">
                <Heading size="sm" color="purple.600">
                  📧 Monthly Newsletter
                </Heading>
                <Text color="nyt.darkGray" fontSize="sm">
                  Curated tool recommendations and tech stack updates sent to 2,500+ subscribers.
                </Text>
              </VStack>
              <VStack align="start">
                <Heading size="sm" color="purple.600">
                  🔍 SEO-Optimized Listings
                </Heading>
                <Text color="nyt.darkGray" fontSize="sm">
                  200+ tool pages with structured data, optimized for search discovery.
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Partnership Opportunities */}
          <Box>
            <Heading size="md" mb={6} color="nyt.black">
              Partnership Opportunities
            </Heading>
            <VStack align="stretch" spacing={4}>
              <Box
                bg="nyt.veryLightGray"
                p={6}
                rounded="md"
                border="1px"
                borderColor="nyt.border"
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" flex="1">
                    <Heading size="sm" color="nyt.black">
                      Featured Tool Listings
                    </Heading>
                    <Text color="nyt.darkGray" fontSize="sm">
                      Premium placement with featured badge, priority in search results, and homepage visibility.
                    </Text>
                  </VStack>
                  <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
                    From $100/mo
                  </Badge>
                </HStack>
              </Box>

              <Box
                bg="nyt.veryLightGray"
                p={6}
                rounded="md"
                border="1px"
                borderColor="nyt.border"
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" flex="1">
                    <Heading size="sm" color="nyt.black">
                      Sponsored Comparison Articles
                    </Heading>
                    <Text color="nyt.darkGray" fontSize="sm">
                      Dedicated comparison article featuring your tool vs. competitors, with fair and honest analysis.
                    </Text>
                  </VStack>
                  <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                    From $500
                  </Badge>
                </HStack>
              </Box>

              <Box
                bg="nyt.veryLightGray"
                p={6}
                rounded="md"
                border="1px"
                borderColor="nyt.border"
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" flex="1">
                    <Heading size="sm" color="nyt.black">
                      Newsletter Sponsorships
                    </Heading>
                    <Text color="nyt.darkGray" fontSize="sm">
                      Dedicated spot in our monthly newsletter reaching 2,500+ engaged indie hackers.
                    </Text>
                  </VStack>
                  <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                    $300/issue
                  </Badge>
                </HStack>
              </Box>
            </VStack>
          </Box>

          {/* CTA */}
          <Box
            bg="purple.50"
            border="2px"
            borderColor="purple.200"
            p={8}
            rounded="md"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Heading size="lg" color="nyt.black">
                Let's Partner Together
              </Heading>
              <Text color="nyt.darkGray" maxW="600px">
                Reach thousands of developers actively searching for tools to build their next project.
              </Text>
              <Button
                as={ChakraLink}
                href="mailto:sponsor@techiespiral.com?subject=Partnership Inquiry"
                colorScheme="purple"
                size="lg"
              >
                Get in Touch
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </>
  );
};
