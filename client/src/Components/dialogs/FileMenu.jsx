import { Menu } from '@mui/material'
import React from 'react'

const FileMenu = ({anchorE1}) => {
  return (
    <Menu open={false}  anchorEl={anchorE1}>
      <div style={{ width:'10rem'}}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem deserunt consectetur maiores repellendus officiis enim assumenda harum expedita animi doloremque beatae, distinctio dolore ut error doloribus iusto totam voluptate alias?
      </div>
    </Menu>
  )
}

export default FileMenu
