import { CardMedia } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { Connection } from '../Connection'

export interface ICollyPageProps {}

function getImage(): void {
  console.log('getImage')
  Connection.inst.rpc('getImage', ['https://www.apple.com/tw'])
}

const CollyPage: React.FC<ICollyPageProps> = (props) => {
  const [image, setImage] = useState('')

  useEffect(() => {
    getImage()
  }, [])
  useEffect(() => {
    Connection.inst.register('onGetImage', (res: string) => {
      console.log('onGetImage: ', res)
      setImage(res)
    })
    return () => Connection.inst.unregister('onGetImage')
  }, [])

  return <div>{image ? <CardMedia><img src={image} /></CardMedia> : <></>}</div>
}

export default CollyPage
