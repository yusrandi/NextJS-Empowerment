import { Breadcrumb as BSBreadcrumb, BreadcrumbItem } from 'react-bootstrap'

interface BreadcrumbProps {
  items: { label: string; href: string; active?: boolean }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <BSBreadcrumb listProps={{ className: 'mb-0 align-items-center' }}>
      {items.map((item, index) => (
        <BreadcrumbItem
          key={index}
          linkProps={{ className: 'text-decoration-none' }}
          href={item.href}
          active={item.active}
        >
          {item.label}
        </BreadcrumbItem>
      ))}
    </BSBreadcrumb>

    // <BSBreadcrumb listProps={{ className: 'mb-0 align-items-center' }}>
    //   <BreadcrumbItem
    //     linkProps={{ className: 'text-decoration-none' }}
    //     href="/"
    //   >
    //     Home
    //   </BreadcrumbItem>
    //   <BreadcrumbItem
    //     linkProps={{ className: 'text-decoration-none' }}
    //     href="/"
    //   >
    //     Library
    //   </BreadcrumbItem>
    //   <BreadcrumbItem active>Data</BreadcrumbItem>
    // </BSBreadcrumb>
  )
}
