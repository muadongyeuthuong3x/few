import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Contact() {
    const url = process.env.REACT_APP_API_URL
    const [contacts, setContacts] = useState([])
    const [name, setName] = useState()
    useEffect(() => {
        getAllContact();
    }, [])
    const getAllContact = async () => {
        const res = await axios.get(`${url}api/contact`);

        setContacts(res.data);
    }
    const createContact = async () => {
        axios.post(`${url}api/contact`, {
            name,
            age: 42,
            address: "eee3AAAAA",
            address1: "CCCCC"
        })
    }

    return <div>
        <div> Them contact </div>
        <input type='text' name='name' onChange={(e) => setName(e.target.value)} />
        <button onClick={createContact}> Them Contact </button>
        {
            contacts.map(contact => {
                return <div> {contact.id} - {contact.name}  </div>
            })
        }
    </div>;
}

export default Contact;