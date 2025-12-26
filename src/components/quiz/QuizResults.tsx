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
import { Tool, StartupStage, TechStack } from '../../types/Tool';
import { QuizAnswers } from '../../types/Quiz';
import { ToolCard } from '../ToolCard';
import { BUDGET_RANGES } from '../../utils/budgetFilters';
import { useStacksContext } from '../../context/StacksContext';
import { getStageColors } from '../../utils/stageColors';

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
  const { stacks } = useStacksContext();

  const stageLabels = answers.stages.map(stage =>
    STARTUP_STAGES.find(s => s.value === stage)?.label
  ).filter(Boolean);

  const budgetLabels = answers.budgets.map(budget =>
    BUDGET_RANGES.find(b => b.value === budget)?.label
  ).filter(Boolean);

  const hasFilters = answers.stages.length > 0 || answers.budgets.length > 0 || answers.categories.length > 0;

  // Filter stacks based on quiz answers
  const filteredStacks = stacks.filter(stack => {
    // If user selected categories, match stack category to selected categories
    if (answers.categories.length > 0) {
      return answers.categories.includes(stack.category);
    }
    // If no categories selected, show all stacks
    return true;
  }).slice(0, 6); // Limit to top 6 featured stacks

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
              {answers.stages.map(stage => {
                const colors = getStageColors(stage);
                const label = STARTUP_STAGES.find(s => s.value === stage)?.label;
                return (
                  <Badge key={stage} bg={colors.bg} color={colors.color} fontSize="12px" px={3} py={1}>
                    {label}
                  </Badge>
                );
              })}
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

      {/* Featured Tech Stacks Section */}
      {filteredStacks.length > 0 && (
        <>
          <Box>
            <Heading size="lg" color="nyt.black" mb={2}>
              Featured Tech Stacks for You
            </Heading>
            <Text color="nyt.mediumGray" mb={4}>
              Complete toolkits curated for your needs
            </Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredStacks.map(stack => (
              <Box
                key={stack.id}
                as={RouterLink}
                to={`/stack/${stack.id}`}
                bg='white'
                border='1px'
                borderColor='nyt.border'
                p={6}
                transition='all 0.2s'
                _hover={{
                  borderColor: "nyt.black",
                  bg: "nyt.veryLightGray",
                  textDecoration: "none",
                }}
              >
                <VStack align='stretch' spacing={4}>
                  {/* Badge */}
                  {stack.badge && (
                    <Badge
                      bg='nyt.black'
                      color='white'
                      fontSize='10px'
                      px={3}
                      py={1}
                      alignSelf='flex-start'
                    >
                      {stack.badge}
                    </Badge>
                  )}

                  {/* Stack Name */}
                  <Heading size='md' color='nyt.black' fontWeight='700'>
                    {stack.stack_name}
                  </Heading>

                  {/* Tagline */}
                  <Text
                    fontSize='14px'
                    color='nyt.darkGray'
                    fontWeight='600'
                    fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
                    textTransform='uppercase'
                    letterSpacing='1px'
                  >
                    {stack.tagline}
                  </Text>

                  {/* Description */}
                  <Text
                    fontSize='16px'
                    color='nyt.mediumGray'
                    noOfLines={3}
                    lineHeight='1.6'
                  >
                    {stack.description}
                  </Text>

                  {/* Metadata */}
                  <Flex
                    gap={3}
                    pt={2}
                    borderTop='1px'
                    borderColor='nyt.border'
                    flexWrap='wrap'
                  >
                    <Badge
                      bg='nyt.veryLightGray'
                      color='nyt.mediumGray'
                      fontSize='11px'
                      px={2}
                      py={1}
                    >
                      {stack.category}
                    </Badge>
                    <Badge
                      bg='nyt.black'
                      color='white'
                      fontSize='11px'
                      px={2}
                      py={1}
                    >
                      {stack.total_monthly_cost}
                    </Badge>
                  </Flex>

                  {/* Target Audience */}
                  <Text
                    fontSize='13px'
                    color='nyt.mediumGray'
                    fontStyle='italic'
                  >
                    For: {stack.target_audience}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </>
      )}

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
