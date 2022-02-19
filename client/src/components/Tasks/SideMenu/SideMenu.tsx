import React, { useState, useEffect } from 'react'
// import * as FaIcons from 'react-icons/fa';
// import * as AiIcons from 'react-icons/ai';
// import { Link } from 'react-router-dom';
import styles from './styles.module.scss'

import getImages from '../../../store/api/imageApi';

import { BsXLg } from "react-icons/bs";
import IconButton from '../../Details/IconButton/IconButton';

import { colors, defaultBackground, defaultColor } from '../localData';

import {
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'

type SideMenuProps = {
  boardId: string
  closeMenu: () => void
  setBackgroundUrl: (value: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ closeMenu, setBackgroundUrl, boardId }) => {
  const [updateBoard] = useUpdateBoardMutation()
  const [optionColors, setOptionsColors] = useState<boolean>(false)
  const [optionImages, setOptionsImages] = useState<boolean>(false)
  const [images, setImages] = useState<any>([])

  const getListOfImages = async () => {
    const listOfImages = await getImages()
    setImages(listOfImages)
  }

  useEffect(() => {
    getListOfImages()
  }, [])

  return (
    <div className={styles.sideMenu}>
      <div className={styles.menuHeader}>
        <h3>Zmień tło</h3>
        <IconButton onClick={closeMenu}><BsXLg /></IconButton>
      </div>
      <div className={styles.options}>
        <div className={styles.box}
          onClick={() => {
            setOptionsImages(true)
            setOptionsColors(false)
          }}
          style={{
            backgroundImage: `url(${defaultBackground})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}><p>Zdjęcia</p></div>
        <div className={styles.box}
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
        {/* <div className={styles.description}>
          <p>Zdjęcia</p>
          <p>Kolory</p>
        </div> */}
      </div>

      <div className={styles.optionsContainer}>
        {
          optionImages ? (
            images.map((photo: { id: React.Key | null | undefined; thumb: any; full: string; }) => (
              <div
                key={photo.id}
                className={styles.box}
                style={{
                  backgroundImage: `url(${photo.thumb})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
                onClick={() => {
                  setBackgroundUrl(photo.full)
                  updateBoard({
                    id: boardId,
                    background: photo.full
                  })
                }}
              ></div>
            ))
          ) : null
        }
        {
          optionColors ? (
            colors.map((color, index) => (
              <div
                key={index}
                className={styles.box}
                style={{
                  backgroundColor: `${color}`,
                }}
                onClick={() => {
                  setBackgroundUrl(color)
                  updateBoard({
                    id: boardId,
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