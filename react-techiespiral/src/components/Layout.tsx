import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Container,
  Link as ChakraLink
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow="md" py={5} mb={10}>
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Flex align="center" gap={3}>
                <Image 
                  src="/images/logo.png" 
                  alt="TechieSpiral Logo"
                  w="40px"
                  h="40px"
                />
                <Heading size="lg" color="blue.600">
                  TechieSpiral
                </Heading>
              </Flex>
            </ChakraLink>
            
            {!isHomePage && (
              <ChakraLink as={RouterLink} to="/" color="blue.600" fontWeight="medium">
                ← Back to Tools
              </ChakraLink>
            )}
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="6xl" pb={20}>
        {children}
      </Container>

      {/* Footer */}
      <Box as="footer" bg="white" borderTop="1px" borderColor="gray.200" py={10} mt={20}>
        <Container maxW="6xl">
          <Text textAlign="center" color="gray.600">
            © 2025 TechieSpiral. Find tools that actually work.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};