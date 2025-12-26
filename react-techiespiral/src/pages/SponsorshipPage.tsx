import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Button,
  Badge,
  HStack,
  Divider,
  Link as ChakraLink
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { SEO } from '../components/SEO';

export const SponsorshipPage = () => {
  const tiers = [
    {
      name: 'Bronze',
      price: '$100',
      color: 'orange.400',
      features: [
        'Featured badge on your tool listing',
        'Priority placement in category',
        'Highlighted in search results',
        'Mentioned in our monthly newsletter',
        '1 month minimum commitment'
      ],
      popular: false
    },
    {
      name: 'Silver',
      price: '$250',
      color: 'gray.400',
      features: [
        'Everything in Bronze',
        'Top 3 placement in your category',
        'Featured in homepage "Featured Tools" section',
        'Included in relevant comparison articles',
        'Social media mention (1x/month)',
        'Analytics dashboard access',
        '3 month minimum commitment'
      ],
      popular: true
    },
    {
      name: 'Gold',
      price: '$500',
      color: 'purple.500',
      features: [
        'Everything in Silver',
        'Guaranteed #1 spot in your category',
        'Featured on homepage hero rotation',
        'Dedicated comparison article',
        'Social media mentions (4x/month)',
        'Newsletter sponsor spot (1x/month)',
        'Custom landing page on TechieSpiral',
        'Priority customer support',
        '6 month minimum commitment'
      ],
      popular: false
    }
  ];

  return (
    <>
      <SEO
        title="Sponsor TechieSpiral - Reach Indie Hackers"
        description="Sponsor TechieSpiral to reach thousands of indie hackers and bootstrapped founders actively looking for tools. Featured placements, comparison articles, and more."
        url="https://techiespiral.com/sponsorship"
        keywords="sponsor developer tools, advertise to indie hackers, saas marketing, developer marketing"
      />

      <Container maxW="7xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="700"
              color="nyt.black"
            >
              Sponsor TechieSpiral
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="nyt.darkGray"
              maxW="800px"
            >
              Reach thousands of indie hackers and bootstrapped founders actively searching for tools to build their products.
            </Text>
          </VStack>

          {/* Stats Section */}
          <Box
            bg="nyt.veryLightGray"
            p={8}
            rounded="md"
            border="1px"
            borderColor="nyt.border"
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <VStack>
                <Heading size="2xl" color="purple.600">
                  10K+
                </Heading>
                <Text color="nyt.mediumGray" fontWeight="600">
                  Monthly Visitors
                </Text>
              </VStack>
              <VStack>
                <Heading size="2xl" color="purple.600">
                  200+
                </Heading>
                <Text color="nyt.mediumGray" fontWeight="600">
                  Curated Tools
                </Text>
              </VStack>
              <VStack>
                <Heading size="2xl" color="purple.600">
                  92%
                </Heading>
                <Text color="nyt.mediumGray" fontWeight="600">
                  Developer Audience
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>

          {/* Pricing Tiers */}
          <Box>
            <Heading size="lg" mb={6} color="nyt.black">
              Sponsorship Tiers
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {tiers.map(tier => (
                <Box
                  key={tier.name}
                  bg="white"
                  border="2px"
                  borderColor={tier.popular ? tier.color : 'nyt.border'}
                  rounded="md"
                  p={6}
                  position="relative"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'lg'
                  }}
                >
                  {tier.popular && (
                    <Badge
                      position="absolute"
                      top="-12px"
                      right="20px"
                      colorScheme="purple"
                      fontSize="sm"
                      px={3}
                      py={1}
                    >
                      Most Popular
                    </Badge>
                  )}
                  <VStack align="stretch" spacing={4}>
                    <HStack>
                      <Badge
                        bg={tier.color}
                        color="white"
                        fontSize="md"
                        px={3}
                        py={1}
                      >
                        {tier.name}
                      </Badge>
                    </HStack>
                    <Heading size="2xl" color="nyt.black">
                      {tier.price}
                      <Text as="span" fontSize="lg" color="nyt.mediumGray" fontWeight="normal">
                        /month
                      </Text>
                    </Heading>
                    <Divider />
                    <List spacing={3}>
                      {tier.features.map((feature, idx) => (
                        <ListItem key={idx} fontSize="sm">
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          {feature}
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      as={ChakraLink}
                      href="mailto:sponsor@techiespiral.com?subject=Sponsorship Inquiry"
                      colorScheme={tier.popular ? 'purple' : 'gray'}
                      size="lg"
                      mt={4}
                    >
                      Get Started
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Why Sponsor Section */}
          <Box
            bg="white"
            border="1px"
            borderColor="nyt.border"
            p={8}
            rounded="md"
          >
            <Heading size="md" mb={4} color="nyt.black">
              Why Sponsor TechieSpiral?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <VStack align="start" spacing={2}>
                <Heading size="sm" color="purple.600">
                  🎯 Targeted Audience
                </Heading>
                <Text color="nyt.darkGray">
                  Reach indie hackers, solo developers, and bootstrapped founders actively looking for tools to build their products.
                </Text>
              </VStack>
              <VStack align="start" spacing={2}>
                <Heading size="sm" color="purple.600">
                  💰 High Intent Traffic
                </Heading>
                <Text color="nyt.darkGray">
                  Visitors are in active research mode, comparing tools and ready to make purchasing decisions.
                </Text>
              </VStack>
              <VStack align="start" spacing={2}>
                <Heading size="sm" color="purple.600">
                  📈 Growing Platform
                </Heading>
                <Text color="nyt.darkGray">
                  We're adding new comparison articles weekly and growing our organic traffic month over month.
                </Text>
              </VStack>
              <VStack align="start" spacing={2}>
                <Heading size="sm" color="purple.600">
                  🤝 Partnership Approach
                </Heading>
                <Text color="nyt.darkGray">
                  We're selective about sponsors and only feature tools that genuinely help indie hackers succeed.
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>

          {/* CTA */}
          <Box textAlign="center" py={8}>
            <VStack spacing={4}>
              <Heading size="lg" color="nyt.black">
                Ready to reach your ideal customers?
              </Heading>
              <Text color="nyt.darkGray" maxW="600px">
                Get in touch to discuss a sponsorship package that works for your goals and budget.
              </Text>
              <HStack spacing={4}>
                <Button
                  as={ChakraLink}
                  href="mailto:sponsor@techiespiral.com?subject=Sponsorship Inquiry"
                  colorScheme="purple"
                  size="lg"
                >
                  Contact Us
                </Button>
                <Button
                  as={ChakraLink}
                  href="/media-kit"
                  variant="outline"
                  size="lg"
                >
                  View Media Kit
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </>
  );
};
