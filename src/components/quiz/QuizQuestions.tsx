import { Box, Heading, Text, SimpleGrid, VStack, HStack, Icon } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { StartupStage } from '../../types/Tool';
import { BUDGET_RANGES } from '../../utils/budgetFilters';

const STARTUP_STAGES: { value: StartupStage; label: string; description: string }[] = [
  { value: 'validating', label: 'Validating Idea', description: 'Researching and validating your idea' },
  { value: 'mvp', label: 'Building MVP', description: 'Building your first version' },
  { value: 'launched', label: 'First Customers', description: 'Getting early traction' },
  { value: 'scaling', label: 'Scaling', description: 'Growing your business' }
];

const CATEGORIES = [
  'Developer Tools',
  'Design Tools',
  'Project Management',
  'Communication',
  'Analytics',
  'Marketing',
  'AI Tools',
  'No-Code Tools',
  'Hosting',
  'Database'
];

interface QuestionCardProps {
  label: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
}

const QuestionCard = ({ label, description, isSelected, onClick }: QuestionCardProps) => {
  return (
    <Box
      as="button"
      onClick={onClick}
      w="full"
      minH={{ base: '80px', md: '100px' }}
      p={6}
      border="2px solid"
      borderColor={isSelected ? 'nyt.black' : 'nyt.border'}
      bg={isSelected ? 'nyt.black' : 'white'}
      color={isSelected ? 'white' : 'nyt.black'}
      borderRadius="md"
      transition="all 0.2s"
      textAlign="left"
      position="relative"
      _hover={{
        borderColor: 'nyt.black',
        bg: isSelected ? 'nyt.darkGray' : 'nyt.veryLightGray'
      }}
      _focus={{
        outline: '2px solid',
        outlineColor: 'nyt.black',
        outlineOffset: '2px'
      }}
    >
      <HStack align="flex-start" spacing={3}>
        {/* Checkbox indicator */}
        <Box
          w="20px"
          h="20px"
          minW="20px"
          border="2px solid"
          borderColor={isSelected ? 'white' : 'nyt.border'}
          bg={isSelected ? 'white' : 'transparent'}
          borderRadius="sm"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mt={1}
        >
          {isSelected && (
            <CheckIcon boxSize={3} color="nyt.black" />
          )}
        </Box>

        {/* Content */}
        <VStack align="flex-start" spacing={1} flex={1}>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="600">
            {label}
          </Text>
          {description && (
            <Text
              fontSize="sm"
              color={isSelected ? 'whiteAlpha.800' : 'nyt.mediumGray'}
            >
              {description}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

interface StageQuestionProps {
  selectedStages: StartupStage[];
  onToggle: (stage: StartupStage) => void;
}

export const StageQuestion = ({ selectedStages, onToggle }: StageQuestionProps) => {
  return (
    <VStack spacing={8} align="stretch" maxW="800px" mx="auto">
      <VStack spacing={3} align="center">
        <Heading
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="700"
          color="nyt.black"
          textAlign="center"
        >
          Where are you in your journey?
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="nyt.mediumGray"
          textAlign="center"
        >
          Select one or more stages (we'll show tools that match any of your selections)
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {STARTUP_STAGES.map(stage => (
          <QuestionCard
            key={stage.value}
            label={stage.label}
            description={stage.description}
            isSelected={selectedStages.includes(stage.value)}
            onClick={() => onToggle(stage.value)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

interface BudgetQuestionProps {
  selectedBudgets: string[];
  onToggle: (budget: string) => void;
}

export const BudgetQuestion = ({ selectedBudgets, onToggle }: BudgetQuestionProps) => {
  return (
    <VStack spacing={8} align="stretch" maxW="800px" mx="auto">
      <VStack spacing={3} align="center">
        <Heading
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="700"
          color="nyt.black"
          textAlign="center"
        >
          What's your budget range?
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="nyt.mediumGray"
          textAlign="center"
        >
          Select one or more budget ranges (we'll show tools that fit any of your selections)
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {BUDGET_RANGES.map(range => (
          <QuestionCard
            key={range.value}
            label={range.label}
            description={range.description}
            isSelected={selectedBudgets.includes(range.value)}
            onClick={() => onToggle(range.value)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

interface CategoryQuestionProps {
  selectedCategories: string[];
  onToggle: (category: string) => void;
}

export const CategoryQuestion = ({ selectedCategories, onToggle }: CategoryQuestionProps) => {
  return (
    <VStack spacing={8} align="stretch" maxW="800px" mx="auto">
      <VStack spacing={3} align="center">
        <Heading
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="700"
          color="nyt.black"
          textAlign="center"
        >
          What category of tools do you need?
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color="nyt.mediumGray"
          textAlign="center"
        >
          Select one or more categories (we'll show tools from any of your selections)
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {CATEGORIES.map(category => (
          <QuestionCard
            key={category}
            label={category}
            isSelected={selectedCategories.includes(category)}
            onClick={() => onToggle(category)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};
