import { Image as ImageIcon ,AudioFile as AudioFileIcon, VideoFile as VideoFileIcon, UploadFile as UploadFileIcon} from '@mui/icons-material';
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setIsFileMenu, setUploadLoader } from '../../redux/reducers/misc';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useSendAttachmentsMutation } from '../../redux/api/api';
import { getSocket } from '../../socket';

const FileMenu = ({anchorE1,chatId }) => {

  const { isFileMenu } = useSelector((state)=> state.misc);
  const dispatch = useDispatch();

  const [ sendAttachments ] = useSendAttachmentsMutation();

  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  }

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);


  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async(e,key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;

    if(files.length > 5) return toast.error(`You can only upload a maximum of 5 ${key}`);

    dispatch(setUploadLoader(true));
    const toastId = toast.loading(`Uploading ${key}...`);
    closeFileMenu();
try {
  //fetching here
  const myForm = new FormData();
  myForm.append('chatId', chatId);

  files.forEach((file) => {
    myForm.append('files',file)
  })
  
  const res = await sendAttachments(myForm);
  console.log("📤 File upload response:", res);

   if (res.data?.message) {
    //  setMessages((prev) => [...prev, res.data.message]);
        toast.success(`${key} uploaded successfully`, { id: toastId });

      } else {
        toast.error(`Failed to upload ${key}`, { id: toastId });
      }

} catch (error) {
  toast.error(error?.message || "Something went wrong", { id: toastId });
}finally {
  dispatch(setUploadLoader(false));
}

  }

  return (
    <Menu open={isFileMenu}  anchorEl={anchorE1} onClose={closeFileMenu}
    sx={{
      width:'10rem',
    }}
    >
     <div style={{
      width:'10rem',
     }}>


       <MenuList>
        {/* For Images */}
        <MenuItem onClick={selectImage}>
        <Tooltip title='Image'>
          <ImageIcon/>
        </Tooltip>
        <ListItemText 
        style={{
          marginLeft:'0.5rem',
        }}>
          Image
        </ListItemText>
        <input type='file' multiple accept='image/png, image/jpeg, image/gif'
        style={{display:'none'}}
        onChange={(e)=> fileChangeHandler(e,'Images')
        }
        ref={imageRef}
        />
        </MenuItem>
      

      {/* For Audio Files */}
        <MenuItem onClick={selectAudio}>
        <Tooltip title='Audio'>
          <AudioFileIcon/>
        </Tooltip>
        <ListItemText 
        style={{
          marginLeft:'0.5rem',
        }}>
          Audio
        </ListItemText>
        <input type='file' multiple accept='audio/mpeg, audio/wav'
        style={{display:'none'}}
        onChange={(e)=> fileChangeHandler(e,'Audios')}
        ref={audioRef}
        />
        </MenuItem>
      

         {/* for Video Files */}
        <MenuItem onClick={selectVideo}>

        <Tooltip title='Video'>
          <VideoFileIcon/>
        </Tooltip>
        <ListItemText 
        style={{
          marginLeft:'0.5rem',
        }}>
          Video
        </ListItemText>
        <input type='file' multiple accept='video/mp4, video/webm, video/ogg'
        style={{display:'none'}}
        onChange={(e)=> fileChangeHandler(e,'Videos')}
        ref={videoRef}
        />
        </MenuItem>
      

        {/* For Files */}
        <MenuItem onClick={selectFile}>
        <Tooltip title='File'>
          <UploadFileIcon/>
        </Tooltip>
        <ListItemText 
        style={{
          marginLeft:'0.5rem',
        }}>
          File
        </ListItemText>
        <input type='file' multiple accept='*'
        style={{display:'none'}}
        onChange={(e)=> fileChangeHandler(e,'Files')}
        ref={fileRef}
        />
        </MenuItem>

      </MenuList>

     </div>
    </Menu>
  )
}

export default FileMenu;
