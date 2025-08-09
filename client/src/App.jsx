

import { Toaster } from 'react-hot-toast';
import Loader from './components/loader.jsx';
import { useSelector } from 'react-redux';
import AppRoutes from './AppRoutes.jsx';

let App = () => {
//    const { value } = blahblaj 
   const loader = useSelector(state => state.loaderReducer); // state represent store variable in store.jsx and state.loaderReducer; represent pertinent initialValue (object) eventually this value injects to loader variable

    return (
        <>
        <Toaster position="top-center" reverseOrder={false}/>
         {loader.value && <Loader />}
         <AppRoutes />
        </>
    );
}

export default App;