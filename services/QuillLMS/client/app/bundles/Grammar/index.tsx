import * as React from "react";
import { createRoot } from 'react-dom/client'
import App from "./App";
import './styles/style.scss';

createRoot(document.getElementById('app')).render(<App />)
