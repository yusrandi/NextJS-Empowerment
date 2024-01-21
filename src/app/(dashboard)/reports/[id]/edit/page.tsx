import React from 'react'
import SidebarOverlay from '@/app/ui/dashboard/Sidebar/SidebarOverlay'
import SidebarProvider from '@/app/ui/dashboard/sidebar-provider'
import SidebarNav from '@/app/ui/dashboard/Sidebar/SidebarNav'
import Sidebar from '@/app/ui/dashboard/Sidebar/Sidebar'
import Header from '@/app/ui/dashboard/Header/Header'
import { Container } from 'react-bootstrap'
import Index from '.'
import Footer from '@/app/ui/dashboard/Footer/Footer'
import { ReportType } from '@/types/report.types'
import { notFound } from 'next/navigation'
import { getDatabase, onValue, ref, update } from 'firebase/database'
import { database, reportsDatabaseRef } from '@/lib/firebase'
import axios from 'axios'
import { UserType } from '@/types/user.type'


type Props = {
    report: ReportType;
    user: UserType;
}

const fetchReport = async (params: { id: string }): Promise<Props> => {
    const idQuery = params.id

    if (!idQuery) {
        return notFound()
    }

    let report = {} as ReportType
    let user = {} as UserType
    try {

        const starCountRef = ref(database, 'reports/' + idQuery);
        onValue(starCountRef, (snapshot) => {
            report = snapshot.val() as ReportType
        })


        console.log('users/' + report.user_id);

        const userRef = ref(database, 'users/' + report.user_id);
        onValue(userRef, (snapshot) => {
            user = snapshot.val() as UserType
            console.log(snapshot.val());
        });

        update(ref(database, "reports/" + idQuery), {
            status: "Diterima"
        })
            .then(async () => {


            })
            .catch((error) => console.log(error))



        return {
            report, user
        }
    } catch (error) {
        return notFound()
    }
}

// Example usage of Breadcrumb component
const breadcrumbData: { label: string; href: string; active?: boolean }[] = [
    { label: 'Dashboard', href: '/' },
    { label: 'Reports', href: '/reports' },
    { label: 'Jadwal', href: '/', active: true },
];

export default async function Page({ params }: { params: { id: string } }) {
    const idQuery = params.id

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
                        <Index id={idQuery} />
                    </Container>
                </div>
                <Footer />
            </div>

            <SidebarOverlay />
        </SidebarProvider>
    )
}
