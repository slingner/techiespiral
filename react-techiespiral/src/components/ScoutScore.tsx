import { Box, HStack, VStack, Text, Progress, Badge, Tooltip } from '@chakra-ui/react';

interface ScoutScoreProps {
  scoutScore?: number; // Overall score 0-100
  valueScore?: number; // 0-5
  easeScore?: number; // 0-5
  featuresScore?: number; // 0-5
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const ScoutScore = ({
  scoutScore,
  valueScore,
  easeScore,
  featuresScore,
  size = 'md',
  showDetails = false
}: ScoutScoreProps) => {
  if (!scoutScore && !valueScore && !easeScore && !featuresScore) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'yellow';
    return 'red';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Great';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Decent';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const score = scoutScore || 0;
  const colorScheme = getScoreColor(score);
  const label = getScoreLabel(score);

  const fontSize = size === 'lg' ? '3xl' : size === 'md' ? '2xl' : 'xl';
  const badgeSize = size === 'lg' ? 'lg' : size === 'md' ? 'md' : 'sm';

  if (!showDetails) {
    return (
      <Tooltip label={`Scout Score: ${score}/100 - ${label}`} hasArrow>
        <Badge
          colorScheme={colorScheme}
          fontSize={badgeSize}
          px={3}
          py={1}
          rounded="full"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Text>⭐</Text>
          <Text fontWeight="bold">{score}/100</Text>
        </Badge>
      </Tooltip>
    );
  }

  return (
    <VStack align="stretch" spacing={3}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          Scout Score
        </Text>
        <HStack>
          <Text fontSize={fontSize} fontWeight="bold" color={`${colorScheme}.600`}>
            {score}
          </Text>
          <Text fontSize="xl" color="gray.400">/100</Text>
          <Badge colorScheme={colorScheme} fontSize="sm">
            {label}
          </Badge>
        </HStack>
      </HStack>

      <Progress
        value={score}
        size="lg"
        colorScheme={colorScheme}
        rounded="full"
        bg="gray.100"
      />

      {(valueScore || easeScore || featuresScore) && (
        <VStack align="stretch" spacing={2} mt={2}>
          {valueScore !== undefined && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">💰 Value for Money</Text>
              <HStack spacing={1}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Box
                    key={i}
                    w="8px"
                    h="8px"
                    rounded="full"
                    bg={i <= valueScore ? 'blue.500' : 'gray.200'}
                  />
                ))}
                <Text fontSize="sm" fontWeight="semibold" ml={2}>
                  {valueScore}/5
                </Text>
              </HStack>
            </HStack>
          )}

          {easeScore !== undefined && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">⚡ Ease of Use</Text>
              <HStack spacing={1}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Box
                    key={i}
                    w="8px"
                    h="8px"
                    rounded="full"
                    bg={i <= easeScore ? 'green.500' : 'gray.200'}
                  />
                ))}
                <Text fontSize="sm" fontWeight="semibold" ml={2}>
                  {easeScore}/5
                </Text>
              </HStack>
            </HStack>
          )}

          {featuresScore !== undefined && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">✨ Features</Text>
              <HStack spacing={1}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Box
                    key={i}
                    w="8px"
                    h="8px"
                    rounded="full"
                    bg={i <= featuresScore ? 'purple.500' : 'gray.200'}
                  />
                ))}
                <Text fontSize="sm" fontWeight="semibold" ml={2}>
                  {featuresScore}/5
                </Text>
              </HStack>
            </HStack>
          )}
        </VStack>
      )}
    </VStack>
  );
};
