import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import './OnDemandSync.css'
import Constants from './Constants'
import Dialog from '@material-ui/core/Dialog'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'

const source = {
  sharepoint: "Share Point",
  box: "Box",
  onedrive: "One Drive"
}

const OnDemandSync = () => {
  const location = useLocation()
  const [showDialog, setShowDialog] = useState(false)
  const [responses, setResponses] = useState([])
  const { clientID, clientSecret, tenant, dataSource } = (location && location.state) || {}

  const generateAPIURL = () => {
    const data = Constants.data
    const fields = data?.filter((d) => d.name === dataSource);
     if(fields && fields.length > 0){
     return fields[0]
   }
   return fields.push({url: '', token: ''})
  }

  const URL =  generateAPIURL().url || ''
  const token =  generateAPIURL().token || ''

  const fetchResponse = async () => {
    const response = await axios
      .get('http://localhost:8082/api/configuration/fetch')
    if (response.status === 200) {
      setResponses(response.data);
    }
    else {
      console.log('Error from showResponse')
    }
  }

  useEffect(() => {
    fetchResponse()
    generateAPIURL()
  }, [])

  const payLoadToSend = {
    clientID,
    clientSecret,
    tenant,
  }

  const handleToClose = () => {
    setShowDialog(false)
  }

  const getDateFromString = (date) => {
    const datearr = date.split(',')
    const dateItems = datearr[0].split('/').join('-')
    const stringDate = dateItems.split('-')
    const newformatDate = []
    newformatDate.push(stringDate[1], stringDate[0], stringDate[2])
    const formatDateString = newformatDate.join('-')
    const formatDate = formatDateString.concat(datearr[1])
    return formatDate
  }

  const currentDate = new Date().toLocaleString()
  const getDate = getDateFromString(currentDate)

  const updateMongoDB = async (status) => {
    const dataToMongoDB = {
      execute_response: status,
      time: getDate,
      api_name: source[dataSource]
    }
    try {
      const response = await axios
        .post('http://localhost:8082/api/configuration/response', dataToMongoDB)
      if (response.status === 200) {
        console.log(response.data)
      }
    } catch (err) {
      console.log('error in updating mongodb', err);
    } finally {
      fetchResponse();
    }
  }

  const handleAPI = async () => {
    try {
      const response = await axios.post(URL, payLoadToSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
        },
      })
      if (response.status === 200) {
        updateMongoDB('completed');
      }
      setShowDialog(true)
    } catch (error) {
      alert('unable to send data now. Please try again later', error)
      updateMongoDB('failed');
    }
  }

  return (
    <>
      <header id="onSyncContainer">
        <h2>On Demand Sync</h2>
        <button id="syncButton" onClick={handleAPI}>
          Execute
        </button>
        <Dialog open={showDialog} onClose={handleToClose}>
          <DialogContent>
            <DialogContentText>Data submitted successfully</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleToClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </header>
      <section id="content">
        <table id="response">
          <thead>
            <tr>
              <th>ID</th>
              <th>API Source</th>
              <th>Execution_Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((res) => (
              <tr key={res._id}>
                <td>{res._id}</td>
                <td>{res.api_name}</td>
                <td>{res.time}</td>
                <td>{res.execute_response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default OnDemandSync
