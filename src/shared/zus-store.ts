import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IManState } from './types'
//import type {} from '@redux-devtools/extension' //required for devtools typing

export const useMainState = create<IManState>()(
    //devtools(
    persist(
        (set) => ({
            tasks: [],
            set_state: (title,value) => {
                switch (title) {
                    case 'tasks':
                            set(()=>({tasks:value}))
                        break;
                
                    default:
                        break;
                }
            },
        }),
        {
            name: 'main-state',
        },
    ),
    //),
)