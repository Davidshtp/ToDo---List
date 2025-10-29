import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IManState, TTask } from './types'

export const useMainState = create<IManState>()(
    devtools(
        persist(
            (set) => ({
                tasks: [] as TTask[],
                set_state: (title, value) => {
                    switch (title) {
                        case 'tasks':
                            set(() => ({ tasks: value }))
                            break;
                        default:
                            break;
                    }
                },
                addTask: (task: TTask) => {
                    set((state) => ({
                        tasks: [...state.tasks, task]
                    }))
                },
            }),
            {
                name: 'main-state',
            }
        )
    )
)