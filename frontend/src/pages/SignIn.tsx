import './SignIn.css'
import { Alert, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Connection } from '../Connection'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie'

export interface ISignInPageProps {}

function signIn(account: string, password: string): void {
  console.log('signIn: ', account, '/', password)
  Connection.inst.rpc('signIn', [account, password])
}

function setToken(token: string): void {
  const cookies = new Cookies()
  cookies.set('token', token)
}

export const SignInPage: React.FC<ISignInPageProps> = (props) => {
  const navigate = useNavigate()

  useEffect(() => {
    Connection.inst.register('onSignIn', (code: number, token: string) => {
      console.log('onSignIn: ', code, token)
      code = Number(code)
      switch (code) {
        case 0:
          setToken(token)
          navigate('/colly')
          break
        case 1:
          setError('登入失敗，密碼錯誤')
          break
        case 2:
          setError('登入失敗，沒有此帳號')
          break
      }
    })
    return () => Connection.inst.unregister('onSignIn')
  }, [])

  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  return (
    <div className="logon">
      <div className="signIn">
        <TextField
          id="account"
          label="Account"
          value={account}
          variant="standard"
          required
          onChange={(e) => {
            setAccount(e.target.value)
            setError('')
          }}
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          value={password}
          variant="standard"
          autoComplete="current-password"
          required
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
        />
        <Button variant="outlined" onClick={() => signIn(account, password)}>
          Sign In
        </Button>
        {error ? <Alert severity="error">{error}</Alert> : <></>}
      </div>
    </div>
  )
}

export default SignInPage
