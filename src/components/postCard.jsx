import * as React from 'react';
//import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
//import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { grey} from '@mui/material/colors';
//import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
//import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Comment, ThumbDown, ThumbUp } from '@mui/icons-material';
import { CardActionArea } from '@mui/material';

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

export default function PostCard({ userAvatar, userPseudo, creationDate, principalImage, content, title, isOffline}) {
 // const [expanded, setExpanded] = React.useState(false);

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
    //   };
    
  
  
  
  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardHeader
        avatar={
                  <Avatar src={userAvatar} alt={userPseudo} sx={{ bgcolor: 'skyblue' }} />       
           
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`${title} `}
        subheader={` \u{270D} ${userPseudo} --- ${creationDate}`}
        
          />
          <CardActionArea onClick={()=> {alert("Ouverture des détailles...prochainement")}}> 
          
      {isOffline === false && principalImage ?  <CardMedia
        component='img'
          // height="194"
          
        image={principalImage}
          alt={`${title} - image`}
          sx={{objectFit: 'fill', maxHeight:'400px'}}
                  
      /> : principalImage !== '' && <CardContent>
        <Typography variant="body2" color="text.secondary">
        nous ne pouvons pas afficher les images, vous etes hors ligne
        </Typography>
        </CardContent>}
        
      {true && <CardContent>
          <Typography variant="body2"
            sx={{
              color:  !isOffline &&  principalImage ? grey[900] : grey[200],
              backgroundColor: !isOffline &&  principalImage ? 'white' : 'rgba(0,0,0,0.8)',
              height:!isOffline &&  principalImage ? 'auto' : '300px',
              width:!isOffline &&  principalImage ? 'auto' : '100%',
              display: !isOffline &&  principalImage ?'block': "flex",
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: 'Poppins',
              fontSize: !isOffline &&  principalImage ? '' : '1.5rem',
              textAlign: !isOffline &&  principalImage ? 'left' : 'center',
              borderRadius: !isOffline &&  principalImage? 'none': '4px',

            }}>
          {content}
        </Typography>
              </CardContent>}
              </CardActionArea>
      {isOffline === false && <CardActions disableSpacing>
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
              
        {/* <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore> */}
      </CardActions>}
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse> */}
    </Card>
  );
}