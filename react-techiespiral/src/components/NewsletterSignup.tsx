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
      border="3px solid"
      borderColor="nyt.black"
      p={10}
      bg="white"
      mt={12}
    >
      <VStack spacing={6} align="stretch">
        <VStack spacing={3} textAlign="center">
          <Heading
            size="xl"
            color="nyt.black"
            fontWeight="700"
          >
            Get Weekly Tool Picks
          </Heading>
          <Text
            fontSize="16px"
            color="nyt.mediumGray"
            maxW="600px"
            lineHeight="1.6"
          >
            Join indie hackers getting curated tool recommendations, stack breakdowns, and exclusive deals every week.
          </Text>
        </VStack>

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!error}>
            <VStack spacing={3}>
              <HStack spacing={3} w="full" maxW="500px" mx="auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="white"
                  borderColor="nyt.border"
                  color="nyt.black"
                  size="lg"
                  fontSize="16px"
                  _placeholder={{ color: 'nyt.lightGray' }}
                  _focus={{
                    borderColor: 'nyt.black',
                    boxShadow: 'none'
                  }}
                />
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  px={8}
                  isLoading={isLoading}
                  flexShrink={0}
                >
                  Subscribe
                </Button>
              </HStack>
              {error && (
                <FormErrorMessage justifyContent="center">
                  {error}
                </FormErrorMessage>
              )}
            </VStack>
          </FormControl>
        </form>

        <Text
          fontSize="12px"
          color="nyt.lightGray"
          textAlign="center"
        >
          No spam. Unsubscribe anytime. We respect your inbox.
        </Text>
      </VStack>
    </Box>
  );
};
