import React from "react";
import ReactDOM from "react-dom/client"; 
import { Provider } from "react-redux"; 
import { store } from "./store/store.js"; 
import App from "./App.jsx";


console.log("Приложение запускается");

const root = ReactDOM.createRoot(document.getElementById("root")); 
root.render(
    <React.StrictMode> 
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode> 
);