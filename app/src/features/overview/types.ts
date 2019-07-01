import { NativeSyntheticEvent, NativeTouchEvent } from 'react-native'

export type NativeTouchEventHandler = (ev: NativeSyntheticEvent<NativeTouchEvent>) => void
export type ResultType = 'pages' | 'notes'