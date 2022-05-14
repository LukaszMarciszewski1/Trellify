import React, { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { presetColors, defaultBackground, defaultColor } from '../localData'
import getImages from '../../../api/unsplashApi'
import { useUpdateBoardMutation } from '../../../store/api/boards'
import { BsXLg } from "react-icons/bs"
import IconButton from '../../Details/IconButton/IconButton'

type SideMenuProps = {
  boardId: string
  setCloseMenu: () => void
  setBackgroundUrl: (value: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ setCloseMenu, setBackgroundUrl, boardId }) => {
  const [updateBoard] = useUpdateBoardMutation()
  const [optionColors, setOptionsColors] = useState<boolean>(false)
  const [optionImages, setOptionsImages] = useState<boolean>(false)
  const [images, setImages] = useState<any>([])

  const getListOfImages = async () => {
    const listImages = await getImages()
    setImages(listImages)
  }

  useEffect(() => {
    getListOfImages()
  }, [])

  return (
    <div className={styles.sideMenu}>
      <div className={styles.menuHeader}>
        <h3>Zmień tło</h3>
        <IconButton onClick={setCloseMenu}><BsXLg /></IconButton>
      </div>
      <div className={styles.menuOptions}>
        <div className={styles.itemBox}
          onClick={() => {
            setOptionsImages(true)
            setOptionsColors(false)
          }}
          style={{
            backgroundImage: `url(${defaultBackground})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}><p>Zdjęcia</p></div>
        <div className={styles.itemBox}
          onClick={() => {
            setOptionsImages(false)
            setOptionsColors(true)
          }}
          style={{
            backgroundImage: `url(${defaultColor})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        ><p>Kolory</p></div>
      </div>

      <div className={styles.optionsContainer}>
        {
          optionImages ? (
            images.map((photo: { id: string | undefined; thumb: string; full: string; }) => (
              <div
                key={photo.id}
                className={styles.itemBox}
                style={{
                  backgroundImage: `url(${photo.thumb})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
                onClick={() => {
                  setBackgroundUrl(photo.full)
                  updateBoard({
                    _id: boardId,
                    background: photo.full
                  })
                }}
              ></div>
            ))
          ) : null
        }
        {
          optionColors ? (
            presetColors.map((color, index) => (
              <div
                key={index}
                className={styles.itemBox}
                style={{
                  backgroundColor: `${color}`,
                }}
                onClick={() => {
                  setBackgroundUrl(color)
                  updateBoard({
                    _id: boardId,
                    background: color
                  })
                }}
              ></div>
            ))
          ) : null
        }
      </div>
    </div>
  )
}

export default SideMenu