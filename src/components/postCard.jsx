import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { grey} from '@mui/material/colors';
//import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Comment, DeleteForever, Edit,  ThumbDown, ThumbUp } from '@mui/icons-material';
import { Box, CardActionArea} from '@mui/material';
import { getAuth } from 'firebase/auth';
import app from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useDimensions } from '../hooks/useDimensions';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function SplitString({content='', max}) {

  const substring = content.substring(0, max)

  return (
    <span>
      {substring}
      {max < content.length && <span style={{ fontWeight:'bold', fontStyle:'italic'}}>...lire plus</span>}
    </span>
  )

}

const userActions = [
  { icon: <DeleteForever />, name: 'Supprimer' },
  { icon: <Edit />, name: 'Editer' },
];



export default function PostCard({userId, userAvatar, userPseudo, creationDate, principalImage, content, title, isOffline, pid, widthDetail=false, details=null}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
   setExpanded(!expanded);
  };
  React.useEffect(() => {
    if (widthDetail) {
      setExpanded(true)
    }
  },[widthDetail])
  
  

  const navigate = useNavigate()
  const {innerWidth} = useDimensions()
const auth = getAuth(app)
  const user = auth.currentUser
 
  const SMALL_DEVICE_WIDTH = 600
  const onSmallDevice = innerWidth <= SMALL_DEVICE_WIDTH
    
  const CARD_HEIGHT = '600px';
  const CARD_IMG_HEIGHT = onSmallDevice? '400px':'500px'
  const MIN_CARD_IMG_HEIGHT = '300px'
  
  
  return (
    <Card className='postCardItem' sx={{ maxWidth:innerWidth <= 600 ? innerWidth - 50 :'100%', minHeight:CARD_HEIGHT}}>
      {!widthDetail && <CardHeader
        avatar={
          <Avatar src={userAvatar} alt={userPseudo} sx={{ bgcolor: 'skyblue', opacity: isOffline? 0.5 : 1 }} />       
           
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`${title} `}
        subheader={` \u{270D} ${userPseudo} --- ${creationDate}`}
        
          />}
      <CardActionArea onClick={() => {
        return widthDetail? setExpanded(!expanded):navigate(`post/${pid}`)
      }}> 
          
      {isOffline === false && principalImage ?  <CardMedia
        component='img'
          // height="194"
          
        image={principalImage}
          alt={`${title} - image`}
          sx={{zIndex:-1,objectFit: 'fill', borderRadius:'4px',minHeight:MIN_CARD_IMG_HEIGHT, maxHeight:CARD_IMG_HEIGHT, maxWidth:'98%'}}
                  
      /> : principalImage !== '' && <CardContent>
        <Typography variant="body2" color="text.secondary">
        nous ne pouvons pas afficher les images, vous etes hors ligne
        </Typography>
        </CardContent>}
        
      { !expanded && <CardContent>
          <Typography variant="body2"
            sx={{
              color:  !isOffline &&  principalImage ? grey[900] : grey[200],
              backgroundColor: !isOffline &&  principalImage ? 'white' : 'rgba(0,0,0,0.8)',
              height:!isOffline &&  principalImage ? 'auto' : CARD_IMG_HEIGHT,
              width:!isOffline &&  principalImage ? 'auto' : '100%',
              display: !isOffline &&  principalImage ?'block': "flex",
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection:'column',
              fontFamily: 'Poppins',
              padding:!isOffline &&  principalImage ?0:3,
              fontSize: !isOffline &&  principalImage ? '' : '1.5rem',
              textAlign: !isOffline &&  principalImage ? 'left' : 'center',
              borderRadius: !isOffline &&  principalImage? 'none': '4px',

            }}>
            {!expanded && <SplitString content={content} max={200} />}
        </Typography>
              </CardContent>}
              </CardActionArea>
      {isOffline === false && <CardActions sx={{ position:'relative',height: 50, width:'100%', transform: 'translateZ(0px)', flexGrow: 1 }} disableSpacing>
        <IconButton aria-label="like">
          <ThumbUp />
        </IconButton>
        <IconButton aria-label="dislike">
          <ThumbDown />
        </IconButton>
        <IconButton aria-label="Comment">
          <Comment />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>

        {user?.uid === userId && widthDetail === false && <SpeedDial  
          icon={<SpeedDialIcon   />}
          direction='up'
          sx={{position:'absolute', right:0 , bottom:0, transform:'scale(0.8,0.8)'}}
          ariaLabel="SpeedDial playground example"
        >
          {userActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>}

              
        {widthDetail && <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>}
      </CardActions>}
      {widthDetail && <Collapse sx={{padding:2,maxWidth:innerWidth <= 600 ? innerWidth - 10 :'100%', minHeight:CARD_HEIGHT}} in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph sx={{fontSize:'20px', fontWeight:'bold', textAlign:'center', textDecoration:'underline'}}>{title}</Typography>
          <Typography paragraph sx={{fontSize:'1.3em', fontStyle:'italic', textWrap:'wrap'}}>
            {content}
          </Typography>
          
          {details?.album?.length > 0 && <Box   display={'flex'} flexDirection={'column'} sx={{ width: '100%', justifyContent:'center', gap:5}}>
            
            {
              details.album.map((item) => {
                return (
                  <Box display={'flex'} flexDirection={'column'} gap={2} >
                    <Typography>{` \u{1F449} ${item.legend}`}</Typography>
                    <Box component={'img'} src={item.imgURL} alt={item.legend} sx={{maxHeight: {xs:'350px', sm:'500px'}}}/>
                  </Box>
                )
              })
            }

            

          </Box>}
          {details?.tags?.length > 0 && <Typography  paragraph sx={{marginTop:'30px'}} >
            
            <Box sx={{display:'flex', gap:5}}>
{
              details.tags.map((tag) => {
                return <span style={{display:'flex', gap:5}}>{`#${tag}` }</span>
              })
            }
            </Box>
            
            
            
          </Typography>}
         
        </CardContent>
      </Collapse>}
    </Card>
  );
}