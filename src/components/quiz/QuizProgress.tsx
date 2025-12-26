import { Box, Progress, Text, HStack } from '@chakra-ui/react';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const QuizProgress = ({ currentStep, totalSteps }: QuizProgressProps) => {
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Box w="full" maxW="800px" mx="auto" mb={8}>
      <HStack justify="space-between" mb={2}>
        <Text fontSize="sm" fontWeight="600" color="nyt.mediumGray">
          Question {currentStep + 1} of {totalSteps}
        </Text>
        <Text fontSize="sm" fontWeight="600" color="nyt.mediumGray">
          {Math.round(progressPercent)}%
        </Text>
      </HStack>
      <Progress
        value={progressPercent}
        size="sm"
        colorScheme="blackAlpha"
        bg="nyt.veryLightGray"
        borderRadius="full"
        sx={{
          '& > div': {
            bg: 'nyt.black'
          }
        }}
      />
    </Box>
  );
};
