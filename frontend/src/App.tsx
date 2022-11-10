import './App.css'
import { Button, TextField } from '@material-ui/core';
import { useEffect, useMemo, useState } from 'react';
import { Connection } from './Connection';
import { Logon } from './Logon';

function onSignUp(firstName: string, lastName: string, account: string, password: string): void {
    Connection.inst.rpc("signup", [firstName, lastName, account, password])
}

function onSignIn(account: string, password: string): void {
    Connection.inst.rpc("signin", [account, password])
}

export const App = () => {
    const conn = useMemo(() => {
        const conn = new Connection();
        conn.connect();
        return conn;
    }, []);

    return (
        <>
        <Logon onSignIn={onSignIn.bind(this)} onSignUp={onSignUp.bind(this)}></Logon>
        </>
    );
}
