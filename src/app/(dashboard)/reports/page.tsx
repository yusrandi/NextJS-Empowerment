import React from 'react'
import { newResource, Resource } from '@/models/resource'
import { Pokemon } from '@/models/pokemon'
import { SearchParams } from '@/types/next'
import Index from '.'
import Header from '@/app/ui/dashboard/Header/Header'
import Footer from '@/app/ui/dashboard/Footer/Footer'
import { Container } from 'react-bootstrap'
import SidebarProvider from '@/app/ui/dashboard/sidebar-provider'
import SidebarOverlay from '@/app/ui/dashboard/Sidebar/SidebarOverlay'
import Sidebar from '@/app/ui/dashboard/Sidebar/Sidebar'
import SidebarNav from '@/app/ui/dashboard/Sidebar/SidebarNav'
import { onValue } from 'firebase/database'
import { reportsDatabaseRef } from '@/lib/firebase'
import { ReportType } from '@/types/report.types'




// Example usage of Breadcrumb component
const breadcrumbData: { label: string; href: string; active?: boolean }[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Reports', href: '/', active: true },
];


export default async function Page() {

  return (
    <SidebarProvider>
      <SidebarOverlay />
      <Sidebar>
        <SidebarNav />
      </Sidebar>

      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <Header items={breadcrumbData} />
        <div className="body flex-grow-1 px-sm-2 mb-4">
          <Container fluid="lg">
            <Index />
          </Container>
        </div>

        <Footer />
      </div>

      <SidebarOverlay />
    </SidebarProvider>
  )
}
