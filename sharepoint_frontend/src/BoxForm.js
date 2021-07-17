import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'
import './Form.css'

const  BoxForm = () => {
    const [data, setData] = useState({});
    const [error, setError] = useState({})
    const history = useHistory()
    const location = useLocation()
    const dataValue  = (location && location.state) || ''

    const handleChange = (event) => {
        const { name, value } = event.target
        setData({
          ...data,
          [name]: value,
        })
      }

      const handleCancel = (event) => {
        event.preventDefault()
        setData({})
      }

      const validate = () => {
        let errors = {}
        if (!data.connection_email) {
          errors.connection_email = 'Connection Email cannot be empty'
        }
    
        if (!data.boxID) {
          errors.boxID = 'BoxID cannot be empty'
        }

        if (
            errors.connection_email ||
            errors.boxID
          ) {
            setError(errors)
            return false
          }
          setError({})
          return true
    }

    const handleSubmit = (event) => {
        event.preventDefault()
          const valid = validate()
          if (valid) {
              const payLoadToSend = {
                  connection_email: data.connection_email,
                  box_id: data.boxID,
              };
            axios
            .post('http://localhost:8082/api/configuration/box', payLoadToSend)
            .then((res) => {
                console.log(res);
                data.dataSource = dataValue
                history.push('/ondemandsync-page', data)
                setData({});
            })
            .catch((err) => {
              console.log('Error in creating configuration !', err)
            })
        }
      }


    return (
        <form onSubmit={handleSubmit} id="boxForm">
        <h2 style={{fontSize: '20px'}}>Connection Creation Page</h2>
        <div className="form-wrapper">
          <label htmlFor="connection_email" className="form-label">
            Connection Email ID
          </label>
          <div className="form-input">
            <input
              type="text"
              name="connection_email"
              value={data.connection_email || ''}
              onChange={(e) => handleChange(e)}
            />
            {error.connection_email && <div className="error">{error.connection_email}</div>}
          </div>
        </div>
        <div className="form-wrapper">
          <label htmlFor="boxID" className="form-label">
            Box ID
          </label>
          <div className="form-input">
            <input
              type="text"
              name="boxID"
              value={data.boxID || ''}
              onChange={(e) => handleChange(e)}
            />
            {error.boxID && <div className="error">{error.boxID}</div>}
          </div>
        </div>
        <div id="buttonContainer">
        <button type="submit" id="formConnect">
          Connect
        </button>
        <button id="formCancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
        </form>
    );
}

export default BoxForm;