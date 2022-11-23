import './Colly.css'
import {
  Button,
  CardMedia,
  ImageList,
  ImageListItem,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Connection } from '../Connection'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

export interface ICollyPageProps {}

function getImage(url: string): void {
  console.log('getImage: ', url)
  //   Connection.inst.rpc('getImage', ['https://www.apple.com/tw'])
  Connection.inst.rpc('getImage', [url])
}

function checkLogon(token: string): void {
  console.log('checkLogon: ', token)
  Connection.inst.rpc('checkLogon', [token])
}

function getToken(): string {
  const cookies = new Cookies()
  const token = cookies.get('token')
  return token
}

const CollyPage: React.FC<ICollyPageProps> = (props) => {
  const [cUrl, setCUrl] = useState('')
  const [url, setUrl] = useState('https://www.pinterest.com/lucila_ok19/extras-animedibujos/')
  const [token, setToken] = useState(getToken())
  const [logon, setLogon] = useState(-1)
  const [images, setImages] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (token == undefined || token == 'undefined') {
      navigate('/signIn')
    } else {
      checkLogon(token)
      Connection.inst.register('onToken', (status: number) => {
        console.log('onToken: ', status)
        setLogon(status)
      })
    }
    return () => Connection.inst.unregister('onToken')
  }, [token])

  useEffect(() => {
    if (logon != 0) return
    getImage(url)
    Connection.inst.register('onGetImage', (res: string) => {
      const images = res.split(' ')
      console.log('onGetImage: ', images.length, images)
      setImages(images)
    })
    return () => Connection.inst.unregister('onGetImage')
  }, [cUrl])

  return (
    <div>
      <div className="url">
        <TextField
          id="url"
          label="URL"
          value={url}
          variant="standard"
          required
          onChange={(e) => {
            setUrl(e.target.value)
          }}
        />
        <Button variant="outlined" onClick={() => setCUrl(url)}>
          確定
        </Button>
      </div>
      <ImageList cols={4} variant="masonry">
        {images.map((item) => (
          <ImageListItem key={item}>
            <img
              src={`${item}?fit=crop&auto=format`}
              srcSet={`${item}?fit=crop&auto=format&dpr=2 2x`}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
      {/* {images ? (
        <CardMedia>
          <img src={images} />
        </CardMedia>
      ) : (
        <></>
      )} */}
    </div>
  )
}

export default CollyPage
