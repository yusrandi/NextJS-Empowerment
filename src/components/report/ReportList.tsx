'use client'
import { database, reportsDatabaseRef } from '@/lib/firebase'
import { ReportType } from '@/types/report.types'
import { UserType } from '@/types/user.type'
import { faCheckCircle, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faCheck, faCheckDouble, faCheckToSlot, faClose, faEllipsisVertical, faListCheck, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { child, get, ref, set, update } from 'firebase/database'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Alert, Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Modal, Table } from 'react-bootstrap'
import Schedule from './schedule/Schedule'
type Props = {
    reports: ReportType[]
}
export default function ReportList(props: Props) {
    const { reports } = props

    const [show, setShow] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [report, setReport] = useState<ReportType>({} as ReportType);

    const handleClose = () => setShow(false);
    const handleCloseSchedule = () => setShowSchedule(false);
    const handleShow = () => setShow(true);

    const [submitting, setSubmitting] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const [dateSchedule, setDateShcedule] = useState("")




    async function updateStatus(status: string, report: ReportType) {
        console.log({ status });
        console.log({ report });
        setReport(report)


        update(ref(database, "reports/" + report.id), {
            status: status
        })
            .then(() => {
                console.log("Updated")
                getUser(report.user_id)
            })
            .catch((error) => console.log(error))


        if (status === "Diterima") {
            setShowSchedule(true)
        }
    }

    async function getUser(userId: string) {
        console.log({ userId });
        const dbRef = ref(database);
        get(child(dbRef, `users/${userId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const dataUser = snapshot.val() as UserType
                console.log({ dataUser })
                // sendMessage(dataUser.token)
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    }
    async function sendMessage(token: string) {

        console.log({ token });
        const apiUrl = 'https://fcm.googleapis.com/fcm/send';

        // Define your request data
        const requestData = {
            "to": token,
            "notification": {
                "body": `Selamat laporan anda telah Diterima, silahkan cek jadwal anda`,
                "OrganizationId": "2",
                "content_available": true,
                "priority": "high",
                "subtitle": "Status Laporan",
                "title": "Empowerment"
            },

        };

        // Define your request headers
        const headers = {
            'Content-Type': 'application/json',
            // Add any other headers as needed
            'Authorization': `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
        };

        const response = await axios.post(apiUrl, requestData, {
            headers: headers,
        });
    }

    function handleDelete(report: ReportType) {
        setReport(report)
        console.log({ report });
        setShow(true)
    }

    const handleSubmitSchedule = async () => {
        console.log(`hello date ${dateSchedule}`);

        setSubmitting(true)
        setShowSchedule(false)

        await set(ref(database, 'schedules/' + report.id), {
            reportId: report.id,
            userId: report.user_id,
            date: dateSchedule
        });

        setSubmitting(false)
        window.scrollTo(0, 0)



        // Change to your real submit here
        // setTimeout(() => {
        // }, 1500)

        setNotificationMessage('Record saved successfully.')


        // setNotificationMessage('Unexpected error occurred, please try again.')
    }


    return (
        <>
            <Alert variant="success" show={notificationMessage !== ''} onClose={() => setNotificationMessage('')} dismissible>
                {notificationMessage}
            </Alert>

            <Table responsive bordered hover>
                <thead className="bg-light">
                    <tr>
                        <th aria-label="ID" >No Laporan</th>
                        <th>Bukti</th>
                        <th>Jenis</th>
                        <th>Korban</th>
                        <th>Terlapor</th>
                        <th>Pelapor</th>
                        <th>Alasan</th>
                        <th>Catatan</th>
                        <th>Tanggal Pertemuan</th>
                        <th className="text-end">Status</th>
                        <th aria-label="Action">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        reports.map((report) => (
                            <tr key={report.id}>
                                <td>#{report.id}</td>
                                <td>
                                    <div className="position-relative mx-auto" style={{ width: '70px', height: '70px' }}>
                                        <Image
                                            fill
                                            style={{ objectFit: 'contain' }}
                                            alt={report.id.toString()}
                                            sizes="5vw"
                                            src={report.s3_bukti}
                                        />
                                    </div>
                                </td>
                                <td>{report.s3_jenis} </td>
                                <td>{report.s1_nama}</td>
                                <td>{report.s2_nama}</td>
                                <td>{report.s4_nama}</td>
                                <td>{report.s5_alasan}</td>
                                <td>{report.s5_catatan}</td>
                                <td>
                                    <Schedule reportId={report.id.toString()} />
                                </td>
                                <td className="text-end">
                                    <Badge bg={report.status === "Diajukan" ? "primary" : report.status === "Diproses" ? "info" : report.status === "Diterima" ? "success" : report.status === "Ditolak" ? "danger" : "default"}>{report.status}</Badge>
                                </td>
                                <td>
                                    <Dropdown align="end" >
                                        <DropdownToggle
                                            as="button"
                                            bsPrefix="btn"
                                            className="btn-link rounded-0 text-black-50 shadow-none p-0"
                                            id={`action-${report.id}`}
                                        >
                                            <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                                        </DropdownToggle>

                                        <DropdownMenu>
                                            <DropdownItem className="" eventKey="1" href='#/Diproses' onClick={() => updateStatus("Diproses", report)}>
                                                <>
                                                    <FontAwesomeIcon className="me-2" icon={faRefresh} fixedWidth />
                                                    Diproses
                                                </>
                                            </DropdownItem>


                                            <DropdownItem className="" href='#/Ditolak' onClick={() => updateStatus("Ditolak", report)}>
                                                <>
                                                    <FontAwesomeIcon className="me-2" icon={faClose} fixedWidth />
                                                    Ditolak
                                                </>
                                            </DropdownItem>
                                            <DropdownItem className="" href='#/Diterima' onClick={() => updateStatus("Diterima", report)}>
                                                <>
                                                    <FontAwesomeIcon className="me-2" icon={faCheck} fixedWidth />
                                                    Diterima
                                                </>
                                            </DropdownItem>
                                            {/* <Link href={`reports/${report.id}/edit`} passHref legacyBehavior>
                                                <DropdownItem className="">
                                                    <>
                                                        <FontAwesomeIcon className="me-2" icon={faCheck} fixedWidth />
                                                        Diterima
                                                    </>
                                                </DropdownItem>
                                            </Link> */}

                                            <DropdownItem className="text-danger" href='#/delete' onClick={() => handleDelete(report)}>
                                                <>
                                                    <FontAwesomeIcon className="me-2" icon={faTrashAlt} fixedWidth />
                                                    Delete
                                                </>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Dialog Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    are you sure to delete this report {report.id}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger">Delete</Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showSchedule}
                onHide={handleCloseSchedule}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Jadwal Pertemuan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    silahkan buat jadwal dan detail mengenai pertemuan dengan pelapor

                    <Form.Group className="my-3">
                        <Form.Control
                            className="w-auto"
                            type="date"
                            value={dateSchedule}
                            onChange={(e) => setDateShcedule(e.target.value)}

                        />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSchedule}>
                        Close
                    </Button>
                    <Button variant="success" disabled={submitting} onClick={handleSubmitSchedule}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
