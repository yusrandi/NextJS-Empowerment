'use state'
import { database } from '@/lib/firebase';
import { ScheduleType } from '@/types/schedule.type';
import { child, get, ref } from 'firebase/database';
import React, { useState } from 'react'
interface Props {
    reportId: string
}
export default function Schedule({ reportId }: Props) {
    const [date, setDate] = useState("")
    getSchedule()
    async function getSchedule() {
        console.log({ reportId });
        const dbRef = ref(database);
        get(child(dbRef, `schedules/${reportId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val() as ScheduleType
                console.log({ data })
                // sendMessage(dataUser.token)
                setDate(data.date)
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    }
    return (
        <div>{date}</div>
    )
}
