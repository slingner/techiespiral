import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  SimpleGrid,
  Flex
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Tool, StartupStage } from '../../types/Tool';
import { QuizAnswers } from '../../types/Quiz';
import { ToolCard } from '../ToolCard';
import { BUDGET_RANGES } from '../../utils/budgetFilters';

const STARTUP_STAGES: { value: StartupStage; label: string; description: string }[] = [
  { value: 'validating', label: 'Validating Idea', description: 'Researching and validating your idea' },
  { value: 'mvp', label: 'Building MVP', description: 'Building your first version' },
  { value: 'launched', label: 'First Customers', description: 'Getting early traction' },
  { value: 'scaling', label: 'Scaling', description: 'Growing your business' }
];

interface QuizResultsProps {
  answers: QuizAnswers;
  filteredTools: Tool[];
  onRetakeQuiz: () => void;
}

export const QuizResults = ({ answers, filteredTools, onRetakeQuiz }: QuizResultsProps) => {
  const stageLabels = answers.stages.map(stage =>
    STARTUP_STAGES.find(s => s.value === stage)?.label
  ).filter(Boolean);

  const budgetLabels = answers.budgets.map(budget =>
    BUDGET_RANGES.find(b => b.value === budget)?.label
  ).filter(Boolean);

  const hasFilters = answers.stages.length > 0 || answers.budgets.length > 0 || answers.categories.length > 0;

  return (
    <VStack spacing={8} align="stretch">
      {/* Summary Card */}
      <Box
        bg="blue.50"
        border="2px solid"
        borderColor="blue.200"
        p={6}
        borderRadius="md"
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="blue.900">
            Your Personalized Recommendations
          </Heading>
          <Text color="blue.800" fontSize="16px" lineHeight="1.6">
            Based on your selections, we found {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'} that match your criteria.
          </Text>

          {/* Active Filters */}
          {hasFilters && (
            <HStack spacing={2} flexWrap="wrap">
              <Text fontSize="14px" fontWeight="600" color="blue.900">
                Your preferences:
              </Text>
              {stageLabels.map(label => (
                <Badge key={label} bg="blue.100" color="blue.800" fontSize="12px" px={3} py={1}>
                  {label}
                </Badge>
              ))}
              {budgetLabels.map(label => (
                <Badge key={label} bg="purple.100" color="purple.800" fontSize="12px" px={3} py={1}>
                  {label}
                </Badge>
              ))}
              {answers.categories.map(category => (
                <Badge key={category} bg="green.100" color="green.800" fontSize="12px" px={3} py={1}>
                  {category}
                </Badge>
              ))}
            </HStack>
          )}

          {/* Action Buttons */}
          <Flex gap={3} wrap="wrap">
            <Button
              onClick={onRetakeQuiz}
              size="sm"
              variant="outline"
              borderColor="blue.300"
              color="blue.700"
              _hover={{
                bg: 'blue.100'
              }}
            >
              Retake Quiz
            </Button>
            <Button
              as={RouterLink}
              to="/"
              size="sm"
              variant="outline"
              borderColor="blue.300"
              color="blue.700"
              _hover={{
                bg: 'blue.100'
              }}
            >
              View All Tools
            </Button>
          </Flex>
        </VStack>
      </Box>

      {/* Tools Grid or Empty State */}
      {filteredTools.length === 0 ? (
        <Box bg="white" border="1px" borderColor="nyt.border" p={8} borderRadius="md">
          <VStack spacing={4}>
            <Heading size="md" color="nyt.black">
              No tools found
            </Heading>
            <Text color="nyt.mediumGray" textAlign="center" maxW="600px">
              We couldn't find any tools matching all your criteria. Try adjusting your preferences by retaking the quiz with different answers.
            </Text>
            <VStack spacing={2} align="flex-start" bg="nyt.veryLightGray" p={4} borderRadius="md" w="full" maxW="600px">
              <Text fontSize="sm" fontWeight="600" color="nyt.black">
                Suggestions:
              </Text>
              <Text fontSize="sm" color="nyt.mediumGray">
                • Try selecting "Flexible Budget" to see more options
              </Text>
              <Text fontSize="sm" color="nyt.mediumGray">
                • Browse tools by different categories
              </Text>
              <Text fontSize="sm" color="nyt.mediumGray">
                • Check out all tools without filters
              </Text>
            </VStack>
            <Button
              onClick={onRetakeQuiz}
              colorScheme="blue"
              size="lg"
            >
              Retake Quiz
            </Button>
          </VStack>
        </Box>
      ) : (
        <>
          <Heading size="lg" color="nyt.black">
            Recommended Tools ({filteredTools.length})
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredTools.map(tool => (
              <ToolCard key={tool.Id} tool={tool} />
            ))}
          </SimpleGrid>
        </>
      )}
    </VStack>
  );
};
