import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  useToast,
  FormControl,
  FormErrorMessage
} from '@chakra-ui/react';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Integrate with email service (ConvertKit, Mailchimp, etc.)
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Success!',
        description: "You've been added to our newsletter. Check your inbox!",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setEmail('');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      bg="gradient"
      bgGradient="linear(135deg, blue.600, purple.600)"
      rounded="2xl"
      p={8}
      color="white"
      shadow="lg"
    >
      <VStack spacing={4} align="stretch">
        <Heading size="lg">
          📬 Get Weekly Tool Picks
        </Heading>
        <Text fontSize="md" opacity={0.9}>
          Join indie hackers getting curated tool recommendations, stack breakdowns, and exclusive deals every week.
        </Text>

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!error}>
            <HStack spacing={3}>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="white"
                color="gray.800"
                border="none"
                size="lg"
                _placeholder={{ color: 'gray.400' }}
              />
              <Button
                type="submit"
                colorScheme="yellow"
                size="lg"
                px={8}
                isLoading={isLoading}
                flexShrink={0}
              >
                Subscribe
              </Button>
            </HStack>
            {error && <FormErrorMessage color="yellow.200">{error}</FormErrorMessage>}
          </FormControl>
        </form>

        <Text fontSize="xs" opacity={0.7}>
          No spam. Unsubscribe anytime. We respect your inbox.
        </Text>
      </VStack>
    </Box>
  );
};
