import './styles/App.css';
import './styles/base.css';
import React, {useEffect, useRef, useState} from "react";

const noop = () => {};

const electron = window.electronApi || { on: noop, send: noop };
const ERR_TIMEOUT = 5000;



const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const errorTimeout = useRef();

    useEffect(() => {
        if(errorTimeout.current) clearTimeout(errorTimeout.current);
        errorTimeout.current = setTimeout(
            () => {
                setError(null);
            },
            ERR_TIMEOUT
        );
        return () => clearTimeout(errorTimeout.current);
    }, [error])

    useEffect(() => {
      electron.on('loading', () => setIsLoading(true));
      electron.on('loaded', () => setIsLoading(false));
      electron.on('error', (_, message) => {})
    }, [])

    return (
        <React.Fragment>
            <center>
            {
                isLoading
                    ? 'LOADING...'
                    : 'Electron/React boilerplate'

            }
            </center>
        </React.Fragment>
    )
};

export default App;
