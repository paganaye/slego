import { render } from 'solid-js/web';
import { App } from './App';
import "./slego.css"
const root = document.getElementById('root') ?? document.body;

render(() => <App />, root);
