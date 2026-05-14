/* @refresh reload */
import { render } from 'solid-js/web';
import { App } from './App';
import TestPage from './TestPage';
import { createSignal } from 'solid-js';

const root = document.getElementById('root');

function Router() {
    const [route] = createSignal(window.location.pathname);
    switch (route().toLowerCase()) {
        case '/test':
            return <TestPage />;
        case '/':
        default:
            return <App />;

            if (route() === '/Test') return <TestPage />;
            return <App />;
    }

}

render(() => <Router />, root!)