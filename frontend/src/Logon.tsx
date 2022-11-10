import './Logon.css'
import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';

export type Props = {
    onSignIn: (account: string, password: string) => void,
    onSignUp: (firstName: string, lastName: string, account: string, password: string) => void
}

export const Logon: React.FC<Props> = (props) => {
    const [signUpFirstName, setSignUpFirstName] = useState('');
    const [signUpLastName, setSignUpLastName] = useState('');
    const [signUpAccount, setSignUpAccount] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signInAccount, setSignInAccount] = useState('');
    const [signInPassword, setSignInPassowrd] = useState('');
    return (
        <div id="logon">
        <div id='signIn'>
            <TextField id="account" value={signInAccount} label="Account" variant="standard" onChange={(e)=>{ setSignInAccount(e.target.value) }} required />
            <TextField id="password" value={signInPassword} label="Password" variant="standard" onChange={(e)=>{ setSignInPassowrd(e.target.value) }} required type="password" autoComplete="current-password"/>
            <Button variant="outlined" onClick={() => props.onSignIn(signInAccount, signInPassword)}>Sign In</Button>
        </div>
        <div id='signUp'>
            <TextField id="firstName" value={signUpFirstName} label="First Name" variant="standard" onChange={(e)=>{ setSignUpFirstName(e.target.value) }} required />
            <TextField id="lastName" value={signUpLastName} label="Last Name" variant="standard" onChange={(e)=>{ setSignUpLastName(e.target.value) }} required />
            <TextField id="account" value={signUpAccount} label="Account" variant="standard" onChange={(e)=>{ setSignUpAccount(e.target.value) }} required />
            <TextField id="password" value={signUpPassword} label="Password" variant="standard" onChange={(e)=>{ setSignUpPassword(e.target.value) }} required type="password" autoComplete="current-password"/>
            <Button variant="outlined" onClick={() => props.onSignUp(signUpFirstName, signUpLastName, signUpAccount, signUpPassword)}>Sign Up</Button>
        </div>
        </div>
    )
}