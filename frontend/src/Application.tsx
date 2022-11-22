import React, { useEffect, useLayoutEffect, useMemo } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Connection } from './Connection'
import CollyPage from './pages/Colly'
import HomePage from './pages/Home'
import SignInPage from './pages/SignIn'
import SignUpPage from './pages/SignUp'

export interface IApplicationProps {}

export const Application: React.FunctionComponent<IApplicationProps> = (
  props
) => {
  const conn = useMemo(() => {
    const conn = new Connection()
    conn.connect()
    return conn
  }, [])

//   useEffect(() => {
//     conn.onRpc = (m, p) => {
//       if (m === "onSignin") {
//         console.error("onSignIn: ", p);
//         if (p === 1) {
//             // navigateToColly();
//         } else {
            
//         }
//         // onSignInResponse(p);
//       }
//     };
//     // return () => {
//     //   conn.socket?.close();
//     // };
//   }, [conn.socket]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="colly" element={<CollyPage />}></Route>
        <Route path="signIn" element={<SignInPage />}></Route>
        <Route path="signUp" element={<SignUpPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
