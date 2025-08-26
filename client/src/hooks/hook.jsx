import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";



const useErrors = (errors=[])=>{

    useEffect(()=>{
        errors.forEach(({isError,error,fallback})=>{
            if(isError){
                if(fallback) fallback();
                else toast.error(error?.data?.message
                    || 'Something went wrong. Please try again.'
                );
            }
        })
    },[errors])
};


const useAsyncMutation = (mutationHook)=>{

    const [isLoading,setIsLoading] = useState(false);
    const [data,setData] = useState(null);
    const [mutate] = mutationHook();

    const executeMutation = async (toastMessage,...args)=>{
        setIsLoading(true);
        const toastId = toast.loading(toastMessage || 'Updating Data....')
       try {
         const res =await mutate(...args)
         if(res.data){
          toast.success(res.data.message || 'Data Updated Successfully',{id:toastId});
          setData(res.data)
         }else{
          toast.error(res?.error?.data?.message || 'Error sending friend request',{id: toastId})
         }
    } catch (error) {
      console.log(error)
      toast.error("Something Went Wrong",{id:toastId})
    }
  finally{
            setIsLoading(false);
        }
    };

    return [executeMutation,isLoading,data]
};

const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    if (!socket) return;

    const listeners = [];

    Object.entries(handlers).forEach(([event, handler]) => {
      const listener = (...args) => {
        handler(...args);
      };
      socket.on(event, listener);
      listeners.push({ event, listener });
    });

    return () => {
      listeners.forEach(({ event, listener }) => {
        socket.off(event, listener);
      });
    };
  }, [socket, handlers]);
};



export {
    useErrors,
    useAsyncMutation,
    useSocketEvents
}