import { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  Button,
  Flex,
  Spinner,
  Text,
  Container,
  Alert
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToolsContext } from '../context/ToolsContext';
import { QuizAnswers } from '../types/Quiz';
import { StartupStage } from '../types/Tool';
import { getToolBudgetCategory } from '../utils/budgetFilters';
import { QuizProgress } from '../components/quiz/QuizProgress';
import { StageQuestion, BudgetQuestion, CategoryQuestion } from '../components/quiz/QuizQuestions';
import { QuizResults } from '../components/quiz/QuizResults';

const TOTAL_STEPS = 3;

export const QuizPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    stages: [],
    budgets: [],
    categories: []
  });
  const [isComplete, setIsComplete] = useState(false);

  const { tools: allTools, loading, error } = useToolsContext();

  // Filter tools based on quiz answers (using OR logic for each category)
  const filteredTools = useMemo(() => {
    if (!isComplete) return [];

    return allTools.filter(tool => {
      // Stage filter: if stages selected, tool must match ANY stage OR have no stages defined
      const matchesStage = answers.stages.length === 0 ||
        !tool.startup_stages ||
        tool.startup_stages.length === 0 ||
        answers.stages.some(stage => tool.startup_stages?.includes(stage));

      // Budget filter: if budgets selected, tool must match ANY budget category
      const matchesBudget = answers.budgets.length === 0 ||
        answers.budgets.some(budget => getToolBudgetCategory(tool.price_range).includes(budget));

      // Category filter: if categories selected, tool must match ANY category
      const matchesCategory = answers.categories.length === 0 ||
        answers.categories.includes(tool.category);

      return matchesStage && matchesBudget && matchesCategory;
    });
  }, [allTools, answers, isComplete]);

  const handleStageToggle = (stage: StartupStage) => {
    setAnswers(prev => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter(s => s !== stage)
        : [...prev.stages, stage]
    }));
  };

  const handleBudgetToggle = (budget: string) => {
    setAnswers(prev => ({
      ...prev,
      budgets: prev.budgets.includes(budget)
        ? prev.budgets.filter(b => b !== budget)
        : [...prev.budgets, budget]
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setAnswers(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentStep(0);
    setAnswers({
      stages: [],
      budgets: [],
      categories: []
    });
    setIsComplete(false);
  };

  const isStepComplete = () => {
    if (currentStep === 0) return answers.stages.length > 0;
    if (currentStep === 1) return answers.budgets.length > 0;
    if (currentStep === 2) return answers.categories.length > 0;
    return false;
  };

  if (loading) {
    return (
      <Container maxW="6xl" centerContent py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.600">Loading tools...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="6xl" py={20}>
        <Alert status="error" rounded="md">
          Failed to load tools. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (isComplete) {
    return (
      <Container maxW="6xl" py={8}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <QuizResults
            answers={answers}
            filteredTools={filteredTools}
            onRetakeQuiz={handleRetakeQuiz}
          />
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Progress Indicator */}
        <QuizProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Question Container with Animations */}
        <Box minH="500px">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <StageQuestion
                  selectedStages={answers.stages}
                  onToggle={handleStageToggle}
                />
              )}
              {currentStep === 1 && (
                <BudgetQuestion
                  selectedBudgets={answers.budgets}
                  onToggle={handleBudgetToggle}
                />
              )}
              {currentStep === 2 && (
                <CategoryQuestion
                  selectedCategories={answers.categories}
                  onToggle={handleCategoryToggle}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Navigation Buttons */}
        <Flex
          justify="space-between"
          align="center"
          maxW="800px"
          mx="auto"
          w="full"
          pt={4}
          borderTop="1px"
          borderColor="nyt.border"
        >
          <Button
            onClick={handleBack}
            variant="ghost"
            isDisabled={currentStep === 0}
            size="lg"
            color="nyt.mediumGray"
            _hover={{
              bg: 'nyt.veryLightGray'
            }}
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            isDisabled={!isStepComplete()}
            bg="nyt.black"
            color="white"
            size="lg"
            px={12}
            _hover={{
              bg: 'nyt.darkGray'
            }}
            _disabled={{
              bg: 'nyt.lightGray',
              color: 'nyt.mediumGray',
              cursor: 'not-allowed'
            }}
          >
            {currentStep === TOTAL_STEPS - 1 ? 'See Results' : 'Next'}
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};
