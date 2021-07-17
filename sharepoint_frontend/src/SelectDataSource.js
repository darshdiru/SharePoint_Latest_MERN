import React from 'react';
import { useHistory } from 'react-router-dom';

const SelectDataSource = () => {
    const history = useHistory();

    const handleClick = (data) => {
        history.push(`/${data}`, data);
    };

    return <div id="dataSource">
        <h2>Welcome to SharePoint Integration App</h2>
        <button type='button' name='sharepoint' onClick={(e) => handleClick(e.target.id)} id='sharepoint'>Share Point</button>
        <button type='button' name='box' onClick={(e) => handleClick(e.target.id)} id='box'>BOX</button>
        <button type='button' name='onedrive' onClick={(e) => handleClick(e.target.id)} id='onedrive'>One Drive</button>
    </div>

};

export default SelectDataSource;