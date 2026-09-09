import { useReducer, createContext } from "react"
import initialState from "../reducers/initialState"
import stateReducer from "../reducers/stateReducer"

export const StateContext = createContext()

export const StateContextProvider = (props) => {
  const [state, dispatch] = useReducer(stateReducer, initialState)

  return (
    <StateContext.Provider
      value={[state, dispatch]}
      displayName="State Context"
    >
      {props.children}
    </StateContext.Provider>
  )
}
