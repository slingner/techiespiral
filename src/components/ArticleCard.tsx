import {
  Box,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Article } from '../hooks/useArticles';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box
      as={RouterLink}
      to={`/blog/${article.slug}`}
      bg="white"
      border="1px"
      borderColor="nyt.border"
      p={6}
      transition="all 0.2s"
      _hover={{
        borderColor: 'nyt.black',
        bg: 'nyt.veryLightGray',
        textDecoration: 'none'
      }}
    >
      <VStack align="stretch" spacing={4}>
        {/* Category & Date */}
        <HStack spacing={3} flexWrap="wrap">
          <Badge
            bg="nyt.black"
            color="white"
            fontSize="10px"
            px={2}
            py={1}
            textTransform="uppercase"
            letterSpacing="0.5px"
          >
            {article.category}
          </Badge>
          <Text
            fontSize="12px"
            color="nyt.mediumGray"
            fontFamily="body"
          >
            {formattedDate}
          </Text>
          <Text
            fontSize="12px"
            color="nyt.lightGray"
            fontFamily="body"
          >
            {article.wordCount} words
          </Text>
        </HStack>

        {/* Title */}
        <Heading
          size="md"
          color="nyt.black"
          fontWeight="700"
          lineHeight="1.3"
        >
          {article.title}
        </Heading>

        {/* Description */}
        <Text
          color="nyt.mediumGray"
          fontSize="16px"
          lineHeight="1.6"
          noOfLines={3}
        >
          {article.description}
        </Text>

        {/* Tool tags */}
        {article.toolNames && article.toolNames.length > 0 && article.toolNames[0] !== 'Various' && (
          <HStack spacing={2} flexWrap="wrap" pt={2} borderTop="1px" borderColor="nyt.border">
            <Text fontSize="11px" color="nyt.mediumGray" fontWeight="600">
              Comparing:
            </Text>
            {article.toolNames.slice(0, 3).map((tool, i) => (
              <Badge
                key={i}
                bg="nyt.veryLightGray"
                color="nyt.mediumGray"
                fontSize="10px"
                px={2}
                py={1}
              >
                {tool}
              </Badge>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
};
