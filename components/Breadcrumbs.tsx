import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const BreadcrumbNav = styled.nav`
  padding: 12px 0;
  margin-bottom: 20px;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;

  &:not(:last-child)::after {
    content: '/';
    margin-left: 8px;
    color: ${({ theme }) => theme.text_secondary}60;
  }
`;

const BreadcrumbLink = styled(Link)`
  color: ${({ theme }) => theme.text_secondary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const BreadcrumbCurrent = styled.span`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate JSON-LD schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://arsudsandesh97.github.io${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <BreadcrumbNav aria-label="Breadcrumb">
        <BreadcrumbList>
          {items.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbCurrent aria-current="page">{item.label}</BreadcrumbCurrent>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </BreadcrumbNav>
    </>
  );
}
