'use client'
import ScheduleForm from '@/components/report/schedule/ScheduleForm';
import { database } from '@/lib/firebase';
import { ReportType } from '@/types/report.types';
import { UserType } from '@/types/user.type';
import axios from 'axios';
import { child, get, onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap';

type Props = {
    id: String;
}

const emptyReport: ReportType = {
    id: 0,
    user_id: "",
    s1_nama: "",
    s1_jk: "",
    s1_ttl: "",
    s1_agama: "",
    s1_hubungan: "",
    s1_telp: "",
    s1_kec: "",
    s1_kota: "",
    s1_alamat: "",
    s2_nama: "",
    s2_jk: "",
    s2_ttl: "",
    s2_agama: "",
    s2_hubungan: "",
    s2_telp: "",
    s2_kec: "",
    s2_kota: "",
    s2_alamat: "",
    s3_tanggal: "",
    s3_tempat: "",
    s3_jenis: "",
    s3_bukti: "",
    s4_nik: "",
    s4_tanggal: "",
    s4_nama: "",
    s4_jk: "",
    s4_usia: "",
    s4_ortu: "",
    s4_telp: "",
    s4_kota: "",
    s4_alamat: "",
    s5_alasan: "",
    s5_catatan: "",
    status: "",
    token: "",
}
const emptyUser: UserType = {
    id: '',
    nama: '',
    role: '',
    email: '',
    token: ''
}

export default function Index({ id }: Props) {
    // sendMessage()
    const [report, setReport] = useState<ReportType>(emptyReport)
    const [user, setUser] = useState<UserType>(emptyUser)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {

        update(ref(database, "reports/" + id), {
            status: "Diterima"
        })
            .then(async () => console.log("Updated"))
            .catch((error) => console.log(error))

        console.log({ id });
        const dbRef = ref(database);
        get(child(dbRef, `reports/${id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const dataReport = snapshot.val() as ReportType
                setReport(snapshot.val() as ReportType)
                console.log({ dataReport })
                getUser(dataReport.user_id)

            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    async function getUser(userId: string) {
        console.log({ userId });
        const dbRef = ref(database);
        get(child(dbRef, `users/${userId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const dataUser = snapshot.val() as UserType
                setUser(dataUser)
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
    return (
        <Card>
            <CardHeader>Schedule Form ID {report.id}</CardHeader>
            <CardBody>
                {/* <PokemonForm pokemon={pokemon} /> */}
                <ScheduleForm report={report} />
            </CardBody>
        </Card>
    )
}
