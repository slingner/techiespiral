import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <Box mb={6}>
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} fontSize="sm">
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/" color="blue.600">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, index) => (
          <BreadcrumbItem key={index} isCurrentPage={!item.href}>
            {item.href ? (
              <BreadcrumbLink as={RouterLink} to={item.href} color="blue.600">
                {item.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbLink color="gray.600">{item.label}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Box>
  );
};
