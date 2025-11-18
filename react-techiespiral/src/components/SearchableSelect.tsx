import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  VStack,
  Text,
  Flex,
  Image,
  Badge,
  InputGroup,
  InputLeftElement,
  useOutsideClick
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Tool } from '../types/Tool';

interface SearchableSelectProps {
  tools: Tool[];
  value: string;
  onChange: (toolId: string) => void;
  placeholder?: string;
  size?: string;
}

export const SearchableSelect = ({
  tools,
  value,
  onChange,
  placeholder = 'Search for a tool...',
  size = 'lg'
}: SearchableSelectProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false),
  });

  const selectedTool = useMemo(() => {
    if (!value) return null;
    return tools.find(t => t.Id.toString() === value) || null;
  }, [value, tools]);

  const filteredTools = useMemo(() => {
    if (!searchTerm) return tools;

    const term = searchTerm.toLowerCase();
    return tools.filter(tool =>
      tool.tool_name.toLowerCase().includes(term) ||
      (tool.category && tool.category.toLowerCase().includes(term)) ||
      (tool.description && tool.description.toLowerCase().includes(term))
    );
  }, [tools, searchTerm]);

  const handleSelect = (tool: Tool) => {
    onChange(tool.Id.toString());
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const displayValue = selectedTool ? selectedTool.tool_name : '';

  return (
    <Box position="relative" w="full" ref={ref}>
      <InputGroup size={size}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder={placeholder}
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          bg="white"
          border="2px"
          borderColor="gray.200"
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
          }}
        />
      </InputGroup>

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={2}
          bg="white"
          border="2px"
          borderColor="gray.200"
          rounded="lg"
          shadow="xl"
          maxH="400px"
          overflowY="auto"
          zIndex={1000}
        >
          {filteredTools.length === 0 ? (
            <Box p={4} textAlign="center">
              <Text color="gray.500">No tools found</Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch">
              {filteredTools.map(tool => (
                <Flex
                  key={tool.Id}
                  p={3}
                  align="center"
                  gap={3}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ bg: 'blue.50' }}
                  onClick={() => handleSelect(tool)}
                  borderBottom="1px"
                  borderColor="gray.100"
                >
                  {tool.logo_url ? (
                    <Image
                      src={tool.logo_url}
                      alt={tool.tool_name}
                      boxSize="32px"
                      rounded="md"
                    />
                  ) : (
                    <Box
                      boxSize="32px"
                      bg="gray.100"
                      rounded="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="sm"
                      color="gray.600"
                    >
                      {tool.tool_name.charAt(0).toUpperCase()}
                    </Box>
                  )}
                  <VStack align="flex-start" spacing={0} flex="1">
                    <Text fontWeight="semibold" fontSize="sm">
                      {tool.tool_name}
                    </Text>
                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                      {tool.description || tool.category}
                    </Text>
                  </VStack>
                  <Badge colorScheme="blue" fontSize="xs">
                    {tool.category}
                  </Badge>
                </Flex>
              ))}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
};
