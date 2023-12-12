import toast from 'react-hot-toast';

class ToastHelper{

    constructor(){
        this.prevToastId = null
    }

    showToast(message){
    
        if(this.prevToastId){
          toast.dismiss(this.prevToastId)
        }
    
        const newToastId = toast.error(message,{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            width: '500px',
            fontSize: '0.85rem',
            textAlign: 'center'
          },
        })
    
        this.prevToastId = newToastId
    
    }
}

export default ToastHelper