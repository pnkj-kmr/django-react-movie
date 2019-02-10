import React from 'react';
import ReactDOM from 'react-dom';
import '../css/Main.css';
import Layout from './App';

let myComponent = document.getElementById('movie-ui')
if (myComponent !== null || myComponent !== undefined) {
    
    ReactDOM.render(<Layout />, myComponent);

}


