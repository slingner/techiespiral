import { useState, useMemo } from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Image,
  Alert,
  Flex,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Select from "react-select";
import { useToolsContext } from "../context/ToolsContext";
import { SEO } from "../components/SEO";

type ToolOption = {
  value: string;
  label: string;
  category: string;
};

export const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tools } = useToolsContext();

  const tool1Id = searchParams.get("tool1");
  const tool2Id = searchParams.get("tool2");

  const [selectedTool1, setSelectedTool1] = useState(tool1Id || "");
  const [selectedTool2, setSelectedTool2] = useState(tool2Id || "");

  // Convert tools to react-select options
  const allToolOptions: ToolOption[] = useMemo(() => {
    return tools.map((tool) => ({
      value: tool.Id.toString(),
      label: tool.tool_name,
      category: tool.category,
    }));
  }, [tools]);

  // Filter options for second dropdown based on first selection
  const tool2Options = useMemo(() => {
    if (!selectedTool1) {
      // If no first tool selected, show all tools
      return allToolOptions;
    }

    const selectedTool1Data = tools.find(
      (t) => t.Id === parseInt(selectedTool1)
    );

    // Exclude the selected tool from first dropdown
    let filtered = allToolOptions.filter((opt) => opt.value !== selectedTool1);

    // Prioritize tools from the same category
    if (selectedTool1Data) {
      const sameCategory = filtered.filter(
        (opt) => opt.category === selectedTool1Data.category
      );
      const otherCategory = filtered.filter(
        (opt) => opt.category !== selectedTool1Data.category
      );

      // Show same category tools first, then others
      filtered = [...sameCategory, ...otherCategory];
    }

    return filtered;
  }, [selectedTool1, allToolOptions, tools]);

  const tool1 = useMemo(() => {
    if (!selectedTool1) return null;
    return tools.find((t) => t.Id === parseInt(selectedTool1)) || null;
  }, [selectedTool1, tools]);

  const tool2 = useMemo(() => {
    if (!selectedTool2) return null;
    return tools.find((t) => t.Id === parseInt(selectedTool2)) || null;
  }, [selectedTool2, tools]);

  const handleCompare = () => {
    if (selectedTool1 && selectedTool2) {
      setSearchParams({ tool1: selectedTool1, tool2: selectedTool2 });
    }
  };

  const parseFeatures = (features?: string) => {
    if (!features) return [];
    return features.split(", ").filter((f) => f.trim());
  };

  const parseProsCons = (prosConsText?: string) => {
    if (!prosConsText) return { pros: "", cons: "" };
    const parts = prosConsText.split("CONS:");
    const pros = parts[0].replace("PROS:", "").trim();
    const cons = parts[1] ? parts[1].trim() : "";
    return { pros, cons };
  };

  return (
    <>
      <SEO
        title="Compare Developer Tools - Side by Side Comparison"
        description="Compare developer tools, SaaS platforms, and tech solutions side by side. Find the best tool for your indie hacker project with detailed feature comparisons."
        url="https://techiespiral.com/compare"
        keywords="compare developer tools, tool comparison, SaaS comparison, tech tool comparison, side by side comparison"
      />
      <VStack spacing={10} align='stretch'>
        {/* Hero */}
      <Box
        border='1px'
        borderColor='nyt.border'
        rounded='md'
        p={{ base: 10, md: 16 }}
        bg='green.50'
      >
        <Heading size='2xl' mb={4} color='nyt.black'>
          Compare Tech Tools Side-by-Side
        </Heading>
        <Text fontSize='xl' maxW='700px' color='nyt.darkGray'>
          Make informed decisions by comparing features, pricing, and pros &
          cons
        </Text>
      </Box>

      {/* Tool Selection */}
      <Box bg='white' rounded='2xl' p={8} shadow='md'>
        <Heading size='lg' mb={6} color='gray.800'>
          Select Tools to Compare
        </Heading>
        <Flex gap={4} direction={{ base: "column", md: "row" }} align='center'>
          <Box flex={1} w='full'>
            <Select
              placeholder='Search and select first tool...'
              options={allToolOptions}
              value={
                allToolOptions.find((opt) => opt.value === selectedTool1) ||
                null
              }
              onChange={(option) => setSelectedTool1(option?.value || "")}
              isClearable
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "48px",
                  borderColor: "#E2E8F0",
                  "&:hover": { borderColor: "#CBD5E0" },
                }),
                menu: (base) => ({ ...base, zIndex: 10 }),
              }}
            />
          </Box>

          <Text
            fontSize='2xl'
            fontWeight='bold'
            color='gray.400'
            flexShrink={0}
          >
            VS
          </Text>

          <Box flex={1} w='full'>
            <Select
              placeholder={
                selectedTool1
                  ? "Search and select second tool..."
                  : "Select first tool first"
              }
              options={tool2Options}
              value={
                tool2Options.find((opt) => opt.value === selectedTool2) || null
              }
              onChange={(option) => setSelectedTool2(option?.value || "")}
              isClearable
              isSearchable
              isDisabled={!selectedTool1}
              formatOptionLabel={(option: ToolOption) => (
                <Box>
                  <Text fontWeight='medium'>{option.label}</Text>
                  <Text fontSize='xs' color='gray.500'>
                    {option.category}
                  </Text>
                </Box>
              )}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "48px",
                  borderColor: "#E2E8F0",
                  "&:hover": { borderColor: "#CBD5E0" },
                }),
                menu: (base) => ({ ...base, zIndex: 10 }),
              }}
            />
          </Box>

          <Button
            colorScheme='blue'
            size='lg'
            px={8}
            onClick={handleCompare}
            isDisabled={
              !selectedTool1 ||
              !selectedTool2 ||
              selectedTool1 === selectedTool2
            }
            flexShrink={0}
          >
            Compare
          </Button>
        </Flex>
      </Box>

      {/* Comparison Table */}
      {tool1 && tool2 ? (
        <Box bg='white' rounded='2xl' p={8} shadow='md' overflowX='auto'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th w='200px'>Feature</Th>
                <Th>
                  <VStack align='flex-start' spacing={2}>
                    <HStack>
                      {tool1.logo_url && (
                        <Image
                          src={tool1.logo_url}
                          alt={tool1.tool_name}
                          boxSize='32px'
                          rounded='md'
                        />
                      )}
                      <Heading size='md'>{tool1.tool_name}</Heading>
                    </HStack>
                    <Button
                      as={RouterLink}
                      to={`/tool/${tool1.Id}`}
                      size='sm'
                      colorScheme='blue'
                      variant='outline'
                    >
                      View Details
                    </Button>
                  </VStack>
                </Th>
                <Th>
                  <VStack align='flex-start' spacing={2}>
                    <HStack>
                      {tool2.logo_url && (
                        <Image
                          src={tool2.logo_url}
                          alt={tool2.tool_name}
                          boxSize='32px'
                          rounded='md'
                        />
                      )}
                      <Heading size='md'>{tool2.tool_name}</Heading>
                    </HStack>
                    <Button
                      as={RouterLink}
                      to={`/tool/${tool2.Id}`}
                      size='sm'
                      colorScheme='blue'
                      variant='outline'
                    >
                      View Details
                    </Button>
                  </VStack>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td fontWeight='semibold'>Category</Td>
                <Td>
                  <Badge colorScheme='blue'>{tool1.category}</Badge>
                </Td>
                <Td>
                  <Badge colorScheme='blue'>{tool2.category}</Badge>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight='semibold'>Price Range</Td>
                <Td>
                  <Badge colorScheme='green'>{tool1.price_range}</Badge>
                </Td>
                <Td>
                  <Badge colorScheme='green'>{tool2.price_range}</Badge>
                </Td>
              </Tr>
              {(tool1.techiespiral_score || tool2.techiespiral_score) && (
                <Tr>
                  <Td fontWeight='semibold'>TechieSpiral Score</Td>
                  <Td>
                    {tool1.techiespiral_score ? (
                      <Badge colorScheme='purple' fontSize='lg'>
                        {tool1.techiespiral_score}/100
                      </Badge>
                    ) : (
                      <Text color='gray.400'>Not rated yet</Text>
                    )}
                  </Td>
                  <Td>
                    {tool2.techiespiral_score ? (
                      <Badge colorScheme='purple' fontSize='lg'>
                        {tool2.techiespiral_score}/100
                      </Badge>
                    ) : (
                      <Text color='gray.400'>Not rated yet</Text>
                    )}
                  </Td>
                </Tr>
              )}
              <Tr>
                <Td fontWeight='semibold'>Description</Td>
                <Td>{tool1.description || "No description available"}</Td>
                <Td>{tool2.description || "No description available"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight='semibold'>Best For</Td>
                <Td>{tool1.best_for || "N/A"}</Td>
                <Td>{tool2.best_for || "N/A"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight='semibold' verticalAlign='top'>
                  Key Features
                </Td>
                <Td verticalAlign='top'>
                  {parseFeatures(tool1.features).length > 0 ? (
                    <VStack align='flex-start' spacing={1}>
                      {parseFeatures(tool1.features).map((f, i) => (
                        <Text key={i} fontSize='sm'>
                          • {f}
                        </Text>
                      ))}
                    </VStack>
                  ) : (
                    <Text color='gray.400'>No features listed</Text>
                  )}
                </Td>
                <Td verticalAlign='top'>
                  {parseFeatures(tool2.features).length > 0 ? (
                    <VStack align='flex-start' spacing={1}>
                      {parseFeatures(tool2.features).map((f, i) => (
                        <Text key={i} fontSize='sm'>
                          • {f}
                        </Text>
                      ))}
                    </VStack>
                  ) : (
                    <Text color='gray.400'>No features listed</Text>
                  )}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight='semibold' verticalAlign='top'>
                  Pros
                </Td>
                <Td verticalAlign='top'>
                  <Text fontSize='sm' color='gray.700'>
                    {parseProsCons(tool1.pros_cons).pros || "No pros listed"}
                  </Text>
                </Td>
                <Td verticalAlign='top'>
                  <Text fontSize='sm' color='gray.700'>
                    {parseProsCons(tool2.pros_cons).pros || "No pros listed"}
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight='semibold' verticalAlign='top'>
                  Cons
                </Td>
                <Td verticalAlign='top'>
                  <Text fontSize='sm' color='gray.700'>
                    {parseProsCons(tool1.pros_cons).cons || "No cons listed"}
                  </Text>
                </Td>
                <Td verticalAlign='top'>
                  <Text fontSize='sm' color='gray.700'>
                    {parseProsCons(tool2.pros_cons).cons || "No cons listed"}
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight='semibold'>Official Website</Td>
                <Td>
                  <Button
                    as={ChakraLink}
                    href={tool1.website_url}
                    target='_blank'
                    size='sm'
                    colorScheme='blue'
                  >
                    Visit Website
                  </Button>
                </Td>
                <Td>
                  <Button
                    as={ChakraLink}
                    href={tool2.website_url}
                    target='_blank'
                    size='sm'
                    colorScheme='blue'
                  >
                    Visit Website
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Alert status='info' rounded='md'>
          Select two different tools above to see a detailed comparison
        </Alert>
      )}
      </VStack>
    </>
  );
};
