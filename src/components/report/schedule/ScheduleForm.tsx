'use client'
import FormError from '@/components/Form/FormError';
import { ReportType } from '@/types/report.types';
import React, { useState } from 'react'
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import classNames from 'classnames'


type Props = {
    report: ReportType;
}

type Inputs = {
    reportId: number;
    userId: string;
    nama: string;
}

export default function ScheduleForm(props: Props) {
    const { report } = props


    const [submitting, setSubmitting] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')




    const onSubmit = async () => {
        console.log("hello");

        setSubmitting(true)

        // Change to your real submit here
        setTimeout(() => {
            setSubmitting(false)
            window.scrollTo(0, 0)
        }, 1500)

        setNotificationMessage('Record saved successfully.')


        // setNotificationMessage('Unexpected error occurred, please try again.')
    }

    function handleSubmit() {
        console.log("hello");

    }
    return (

        <>
            <Alert variant="success" show={notificationMessage !== ''} onClose={() => setNotificationMessage('')} dismissible>
                {notificationMessage}
            </Alert>

            <Form.Group className="mb-3">
                <Form.Control
                    className="w-auto"
                    type="date"

                />
            </Form.Group>

            <Button className="me-3" type="submit" variant="success" disabled={submitting} onClick={onSubmit}>Submit</Button>
            <Button type="button" variant="secondary" onClick={() => handleSubmit}>Reset</Button>
        </>

    )
}
