

const ICONS_COLOR = '#1976d2';

const styles = {
    Stack: {
        alignItems: 'center',
        justifyContent: 'center',
       width: '100%',
       height: '100vh',
        //backgroundColor: '#f5f5f5',//'rgba(167, 230, 255,0.3)'
        color: 'black',
        backgroundColor: 'transparent',
        
       // background: 'linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(21,147,172,1) 67%, rgba(0,212,255,1) 100%)',
    },
    box: {
        minheight: 400,
       
        padding: 2,
        
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: '5px',
                backgroundColor:  'rgba(255,255,255,0.9)' ,
        margin: '3px',
        border: `3px solid ${ICONS_COLOR}`,



    },
    boxField: {
        display: 'flex',
        alignItems: 'flex-end',
        width: '100%',
       
        
    },
    text: {
        display: 'flex',
        alignItems: 'center',
        justifyContent:'center',
    },
    avatar: {
        width: 100,
        height: 100,
        border: `2px solid ${ICONS_COLOR}`
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent:'center',
    }
}

export default styles