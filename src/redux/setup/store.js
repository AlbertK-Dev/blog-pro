import { configureStore } from "@reduxjs/toolkit";
import  createSagaMiddleware  from "redux-saga";
import { sagas } from "./sagas";
import rootReducer from "./rootReducer"
const sagaMiddleware = createSagaMiddleware()

//ici je configure le store pour firebase


const store = configureStore(
    {
        reducer: rootReducer,
      middleware: (getDefaultMidelware) => getDefaultMidelware().concat(sagaMiddleware)
        
    }
)
sagaMiddleware.run(sagas)

export default store