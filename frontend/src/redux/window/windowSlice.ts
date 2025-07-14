import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

type WinDim = {
    height: number,
    width: number,    
}
const initialState = {
    windDim: {
        height: 0,
        width: 0
    },
    isMenuLoading: true,
    routeChanging: false,
    enableSignIn: false
}

const windowSlice = createSlice({
    name: 'window',
    initialState,
    reducers:{
        updateWindowDim: (state, action: PayloadAction<WinDim>)=>{
            state.windDim.width = action.payload.width
            state.windDim.height = action.payload.height
        },
        updateMenuLoading: (state, action: PayloadAction<boolean>)=>{
            state.isMenuLoading = action.payload
        },
        updateRouteChanging: (state, action: PayloadAction<boolean>)=>{
            state.routeChanging = action.payload
        },
        handleSignInSheet: (state, action: PayloadAction<boolean>)=>{
            state.enableSignIn = action.payload
        }
    }
})

export const selectWindowDim = (state: RootState) => state.window.windDim;

export const {updateWindowDim, updateMenuLoading, updateRouteChanging, handleSignInSheet} = windowSlice.actions

export default windowSlice.reducer