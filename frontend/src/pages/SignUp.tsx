import './SignUp.css'
import { Alert, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Connection } from '../Connection'
import { useNavigate } from 'react-router-dom'

export interface ISignUpPageProps {}

function signUp(
  account: string,
  password: string,
  firstName: string,
  lastName: string
): void {
  console.log('signUp: ', firstName, '/', lastName, account, '/', password, '/')
  Connection.inst.rpc('signUp', [firstName, lastName, account, password])
}

export const SignUpPage: React.FC<ISignUpPageProps> = (props) => {
  const navigate = useNavigate()

  useEffect(() => {
    Connection.inst.register('onSignUp', (code: number) => {
      console.log('onSignUp: ', code)
      code = Number(code)
      switch (code) {
        case 0:
          navigate('/signin')
          break
        case 1:
          setError('註冊失敗')
          break
      }
    })
    return () => Connection.inst.unregister('onSignUp')
  }, [])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  return (
    <div className="logon">
      <div className="signUp">
        <TextField
          id="firstName"
          value={firstName}
          label="First Name"
          variant="standard"
          onChange={(e) => {
            setFirstName(e.target.value)
            setError('')
          }}
          required
        />
        <TextField
          id="lastName"
          value={lastName}
          label="Last Name"
          variant="standard"
          onChange={(e) => {
            setLastName(e.target.value)
            setError('')
          }}
          required
        />
        <TextField
          id="account"
          value={account}
          label="Account"
          variant="standard"
          onChange={(e) => {
            setAccount(e.target.value)
            setError('')
          }}
          required
        />
        <TextField
          id="password"
          value={password}
          label="Password"
          variant="standard"
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          required
          type="password"
          autoComplete="current-password"
        />
        <Button
          variant="outlined"
          onClick={() => {
            signUp(account, password, firstName, lastName)
          }}
        >
          Sign Up
        </Button>
        {error ? <Alert severity="error">{error}</Alert> : <></>}
      </div>
    </div>
  )
}

export default SignUpPage
