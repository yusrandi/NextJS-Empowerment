'use client'

import { Button, Card } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { newResource, Resource } from '@/models/resource'
import { Pokemon } from '@/models/pokemon'
import useSWRAxios, { transformResponseWrapper } from '@/hooks/useSWRAxios'
import Pagination from '@/components/Pagination/Pagination'
import PokemonList from '@/components/Pokemon/PokemonList'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ReportType } from '@/types/report.types'
import { onValue } from 'firebase/database'
import { reportsDatabaseRef } from '@/lib/firebase'
import ReportList from '@/components/report/ReportList'

export default function Index() {

  const router = useRouter()
  const [reports, setReports] = useState<ReportType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onValue(reportsDatabaseRef, (snapshot) => {
      console.log({ snapshot });
      setReports([])

      snapshot.forEach((value) => {
        let report: ReportType = value.val() as ReportType
        setReports((prevData) => [...prevData, report])
      })

      setLoading(false)
    })
  }, [])


  return (
    <Card>
      <Card.Header>Laporan</Card.Header>
      <Card.Body>
        {/* <div className="mb-3 text-end">
          <Button variant="success" onClick={() => router.push('/pokemons/create')}>
            <FontAwesomeIcon icon={faPlus} fixedWidth />
            Add new
          </Button>
        </div> */}

        <ReportList reports={reports} />

      </Card.Body>
    </Card>
  )
}
