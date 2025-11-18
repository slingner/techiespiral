import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Container,
  Link as ChakraLink,
  HStack,
  Button
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

            {/* Navigation */}
            <HStack spacing={6}>
              <Button
                as={RouterLink}
                to="/"
                variant="ghost"
                colorScheme="blue"
                fontWeight={isActive('/') ? 'bold' : 'medium'}
                borderBottom={isActive('/') ? '2px solid' : 'none'}
                borderRadius={0}
                pb={1}
              >
                Tools
              </Button>
              <Button
                as={RouterLink}
                to="/stacks"
                variant="ghost"
                colorScheme="blue"
                fontWeight={isActive('/stacks') || location.pathname.startsWith('/stack/') ? 'bold' : 'medium'}
                borderBottom={isActive('/stacks') || location.pathname.startsWith('/stack/') ? '2px solid' : 'none'}
                borderRadius={0}
                pb={1}
              >
                Tech Stacks
              </Button>
              <Button
                as={RouterLink}
                to="/compare"
                variant="ghost"
                colorScheme="blue"
                fontWeight={isActive('/compare') ? 'bold' : 'medium'}
                borderBottom={isActive('/compare') ? '2px solid' : 'none'}
                borderRadius={0}
                pb={1}
              >
                Compare
              </Button>
            </HStack>
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
          <Text textAlign="center" color="gray.600" fontSize="sm">
            © 2025 TechieSpiral. The tech stack advisor for indie hackers.
          </Text>
          <Text textAlign="center" color="gray.500" fontSize="xs" mt={2}>
            Curated tools · Complete stacks · Budget-friendly picks
          </Text>
        </Container>
      </Box>
    </Box>
  );
};