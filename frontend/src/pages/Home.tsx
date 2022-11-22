import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export interface IHomePageProps {}

const HomePage: React.FC<IHomePageProps> = (props) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('signIn')
  })
  return <></>
}

export default HomePage
