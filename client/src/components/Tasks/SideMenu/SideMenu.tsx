import React, { useState, useEffect } from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SideMenuData } from './SideMenuData';
import styles from './styles.module.scss'

import getImages from '../../../store/api/imageApi';

import { BsXLg } from "react-icons/bs";
import IconButton from '../../Details/IconButton/IconButton';

import {
  useGetAllBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
} from '../../../store/reducers/boardsReducer'

type SideMenuProps = {
  boardId: string
  closeMenu: () => void
  setBackgroundUrl: (value: string) => void;
}

const colors = [
  '#ba68c8',
  '#9575cd',
  '#009688',
  '#cddc39',
  '#ba68c8',
]

const SideMenu: React.FC<SideMenuProps> = ({ closeMenu, setBackgroundUrl, boardId }) => {
  const [updateBoard] = useUpdateBoardMutation()
  const [optionColors, setOptionsColors] = useState(false)
  const [images, setImages] = useState<any>([])

  const getListOfImages = async () => {
    const listOfImages = await getImages()
    setImages(listOfImages)
    console.log(listOfImages)
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
        <div className={styles.box} style={{
          backgroundImage: `url("https://s1.1zoom.me/big0/590/Germany_Morning_Mountains_Lake_Bavaria_Alps_597796_1280x650.jpg")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}></div>
        <div className={styles.box}
          onClick={() => setOptionsColors(p => !p)}
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/226589/pexels-photo-226589.jpeg?cs=srgb&dl=closeup-photo-of-multi-color-stick-226589.jpg&fm=jpg")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        ></div>
      </div>

      <div className={styles.optionsContainer}>
        {
          optionColors ? (
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
                    background:photo.full
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