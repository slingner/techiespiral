import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Container,
  Link as ChakraLink,
  HStack,
  VStack,
  Divider,
  Badge
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box minH="100vh" bg="white">
      {/* Header */}
      <Box borderBottom="1px" borderColor="nyt.black" bg="white">
        <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={6}>
          {/* Logo/Masthead */}
          <Flex justify="space-between" align="center">
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Flex align="center" gap={3}>
                <Image
                  src="/images/logo.png"
                  alt="TechieSpiral Logo"
                  w="40px"
                  h="40px"
                />
                <VStack spacing={0} align="flex-start">
                  <Heading
                    size="2xl"
                    color="nyt.black"
                    fontFamily="heading"
                    letterSpacing="-0.03em"
                    fontWeight="700"
                  >
                    TechieSpiral
                  </Heading>
                  <Text
                    fontSize="11px"
                    color="nyt.mediumGray"
                    textTransform="uppercase"
                    letterSpacing="1px"
                    fontFamily="body"
                  >
                    The Tech Stack Advisor for Indie Hackers
                  </Text>
                </VStack>
              </Flex>
            </ChakraLink>
          </Flex>
        </Box>

        {/* Navigation */}
        <Box borderTop="1px" borderBottom="1px" borderColor="nyt.border" py={2}>
          <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>
            <HStack spacing={8}>
              <ChakraLink
                as={RouterLink}
                to="/"
                fontSize="13px"
                fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="2px"
                color={isActive('/') ? 'nyt.black' : 'nyt.mediumGray'}
                borderBottom={isActive('/') ? '2px solid' : 'none'}
                borderColor="nyt.black"
                pb={1}
                _hover={{
                  color: 'nyt.black',
                  textDecoration: 'none'
                }}
              >
                Tools
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/stacks"
                fontSize="13px"
                fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="2px"
                color={isActive('/stacks') || location.pathname.startsWith('/stack/') ? 'nyt.black' : 'nyt.mediumGray'}
                borderBottom={isActive('/stacks') || location.pathname.startsWith('/stack/') ? '2px solid' : 'none'}
                borderColor="nyt.black"
                pb={1}
                _hover={{
                  color: 'nyt.black',
                  textDecoration: 'none'
                }}
              >
                Tech Stacks
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/quiz"
                fontSize="13px"
                fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="2px"
                color={isActive('/quiz') ? 'nyt.black' : 'nyt.mediumGray'}
                borderBottom={isActive('/quiz') ? '2px solid' : 'none'}
                borderColor="nyt.black"
                pb={1}
                _hover={{
                  color: 'nyt.black',
                  textDecoration: 'none'
                }}
              >
                Quiz
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/compare"
                fontSize="13px"
                fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="2px"
                color={isActive('/compare') ? 'nyt.black' : 'nyt.mediumGray'}
                borderBottom={isActive('/compare') ? '2px solid' : 'none'}
                borderColor="nyt.black"
                pb={1}
                _hover={{
                  color: 'nyt.black',
                  textDecoration: 'none'
                }}
              >
                Compare
              </ChakraLink>
            </HStack>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box maxW="1400px" mx="auto" py={12} px={{ base: 4, md: 8 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        bg="white"
        borderTop="3px double"
        borderColor="nyt.black"
        py={12}
        mt={20}
      >
        <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>
          <VStack spacing={6}>
            <Divider borderColor="nyt.border" />
            <Heading
              size="md"
              color="nyt.black"
              fontWeight="700"
              textAlign="center"
            >
              TechieSpiral
            </Heading>
            <Text
              textAlign="center"
              color="nyt.mediumGray"
              fontSize="14px"
              maxW="600px"
            >
              Your trusted source for curated tools and complete tech stacks.
              Helping indie hackers build, ship, and grow without breaking the bank.
            </Text>
            <HStack spacing={3}>
              <Badge
                bg="nyt.veryLightGray"
                color="nyt.mediumGray"
                px={3}
                py={1}
                borderRadius="md"
              >
                Curated Tools
              </Badge>
              <Badge
                bg="nyt.veryLightGray"
                color="nyt.mediumGray"
                px={3}
                py={1}
                borderRadius="md"
              >
                Complete Stacks
              </Badge>
              <Badge
                bg="nyt.veryLightGray"
                color="nyt.mediumGray"
                px={3}
                py={1}
                borderRadius="md"
              >
                Budget-Friendly
              </Badge>
            </HStack>
            <Divider borderColor="nyt.border" />
            <Text fontSize="11px" color="nyt.lightGray">
              © 2025 TechieSpiral. All rights reserved.
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};