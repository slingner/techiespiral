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
  Divider
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
        <Container maxW="1200px" py={6}>
          {/* Logo/Masthead */}
          <VStack spacing={4}>
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Flex align="center" gap={3}>
                <Image
                  src="/images/logo.png"
                  alt="TechieSpiral Logo"
                  w="40px"
                  h="40px"
                />
                <Heading
                  size="2xl"
                  color="nyt.black"
                  fontFamily="heading"
                  letterSpacing="-0.03em"
                  fontWeight="700"
                >
                  TechieSpiral
                </Heading>
              </Flex>
            </ChakraLink>

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
        </Container>

        {/* Navigation */}
        <Box borderTop="1px" borderBottom="1px" borderColor="nyt.border" py={2}>
          <Container maxW="1200px">
            <HStack spacing={8} justify="center">
              <ChakraLink
                as={RouterLink}
                to="/"
                fontSize="13px"
                fontFamily='"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif'
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.5px"
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
                fontFamily='"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif'
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.5px"
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
                to="/compare"
                fontSize="13px"
                fontFamily='"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif'
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.5px"
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
          </Container>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxW="1200px" py={12} px={{ base: 4, md: 6 }}>
        {children}
      </Container>

      {/* Footer */}
      <Box
        as="footer"
        bg="white"
        borderTop="3px double"
        borderColor="nyt.black"
        py={12}
        mt={20}
      >
        <Container maxW="1200px">
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
            <HStack spacing={4} fontSize="12px" color="nyt.mediumGray">
              <Text>Curated Tools</Text>
              <Text>·</Text>
              <Text>Complete Stacks</Text>
              <Text>·</Text>
              <Text>Budget-Friendly</Text>
            </HStack>
            <Divider borderColor="nyt.border" />
            <Text fontSize="11px" color="nyt.lightGray">
              © 2025 TechieSpiral. All rights reserved.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};