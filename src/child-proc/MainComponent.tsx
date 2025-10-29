import { Pause, Play, X, CheckCircle, Home, RotateCcw, Minus, Square } from 'lucide-react'
import React from 'react'
import { TTask } from '../shared/types'
import { friendlyTime } from '../shared/functions'
// @ts-ignore
import sound from "../assets/anime-ahh.mp3"
// @ts-ignore
import sound2 from "../assets/sound-2.mp3"

export default React.memo(() => {
    const [tasks, setTasks] = React.useState<TTask[]>([])
    const [currentTime, setCurrentTime] = React.useState<{
        hour: number;
        min: number;
        sec: number;
    } | null>(null)
    const [currentMin, setCurrentMin] = React.useState<number>(0)
    const [currentHour, setCurrentHour] = React.useState<number>(0)
    const [currentSec, setCurrentSec] = React.useState<number>(0)
    const [currentTask, setCurrentTask] = React.useState<TTask>()
    const watch_intv_ref = React.useRef<any>(null)
    const current_durtn_ref = React.useRef<number>(0)
    const move_down_ref = React.useRef<number>(0)
    const current_task_ref = React.useRef<TTask>(undefined)
    const tasks_ref = React.useRef<TTask[]>([]);
    const completion_audio_ref = React.useRef<HTMLAudioElement | null>(null);

    const [paused, setPaused] = React.useState<boolean>(false);
    const [allTasksCompleted, setAllTasksCompleted] = React.useState<boolean>(false);
    const [completionTime, setCompletionTime] = React.useState<string>('');

    const handlePauseTask = React.useCallback((state: any) => {
        setPaused(state)
        if (state) {
            clearTimeout(watch_intv_ref.current)
        } else {
            handle_watch_task(current_task_ref.current, true)
        }
    }, [])

    const handleBackToHome = React.useCallback(() => {
        // Detener cualquier audio antes de cerrar
        if (completion_audio_ref.current) {
            completion_audio_ref.current.pause()
            completion_audio_ref.current.currentTime = 0
        }
        window.close()
    }, [])

    const handleRestartTasks = React.useCallback(() => {
        // Detener cualquier audio que esté sonando
        if (completion_audio_ref.current) {
            completion_audio_ref.current.pause()
            completion_audio_ref.current.currentTime = 0
            completion_audio_ref.current = null
        }

        // Resetear el estado
        setAllTasksCompleted(false)
        setCurrentTask(undefined)
        current_task_ref.current = undefined
        clearInterval(watch_intv_ref.current)

        // Reiniciar las tareas
        setTimeout(() => {
            handle_set_cur_task()
        }, 100)
    }, [])

    const handle_set_cur_task = React.useCallback(() => {

        const currentTaskIndex = current_task_ref.current == undefined ? 0 : tasks_ref.current.findIndex(task => task.duration == current_task_ref.current.duration && task.title == current_task_ref.current.title) + 1
        if (currentTaskIndex >= tasks_ref.current.length) {
            completion_audio_ref.current = new Audio(sound2)
            completion_audio_ref.current.play()
            setAllTasksCompleted(true)
            setCompletionTime(new Date().toLocaleTimeString())
            return
        }
        const task = tasks_ref.current[currentTaskIndex]
        console.log("currentTaskIndex", currentTaskIndex, task, tasks_ref.current);
        setCurrentTask(task);
        current_task_ref.current = task
        handle_watch_task(task)
        setTimeout(() => {
            currentTaskIndex > 0 && animate_steps(task)
        }, 0);
    }, [])

    const handle_watch_task = React.useCallback((currentTask: TTask, skip_init = false) => {
        console.log("currentTask0000", currentTask);

        if (!skip_init) {
            setCurrentTime(friendlyTime(currentTask.duration) as any)
            current_durtn_ref.current = currentTask.duration;
        }
        watch_intv_ref.current = setInterval(() => {

            if (current_durtn_ref.current == 0) {
                clearInterval(watch_intv_ref.current)
                const audio = new Audio(sound)
                audio.play()
                handle_set_cur_task()
            }

            const time = friendlyTime(current_durtn_ref.current, true)
            console.log("I am running", time, current_durtn_ref.current);
            setCurrentHour(time.hour)
            setCurrentMin(time.min)
            setCurrentSec(time.sec)
            current_durtn_ref.current = current_durtn_ref.current - 1000;

        }, 1000);
    }, [current_durtn_ref.current])

    const animate_steps = React.useCallback((currentTask: TTask) => {
        const current_task_index = tasks_ref.current.findIndex((t) => currentTask.title == t.title && currentTask.duration == t.duration)
        const steps_vertical = document.querySelector(".steps-vertical") as HTMLElement
        const current_task_rect = document.querySelector(`#id-${current_task_index}`)?.getBoundingClientRect()

        if (!current_task_rect || !steps_vertical) return;

        const container_rect = steps_vertical.parentElement?.getBoundingClientRect()
        if (!container_rect) return;

        // Calcular si la tarea actual está fuera del área visible
        const task_top = current_task_rect.top
        const task_bottom = current_task_rect.bottom
        const container_top = container_rect.top
        const container_bottom = container_rect.bottom

        // Solo hacer scroll si la tarea está fuera del área visible
        if (task_bottom > container_bottom || task_top < container_top) {
            // Calcular cuánto mover para centrar la tarea actual
            const container_center = container_rect.height / 2
            const task_center = current_task_rect.height / 2
            const desired_position = container_center - task_center
            const current_task_position = task_top - container_top
            const move_amount = current_task_position - desired_position

            // Obtener la transformación actual
            const current_transform = steps_vertical.style.transform
            const current_translate = current_transform.match(/translateY\(([^)]+)\)/)
            const current_y = current_translate ? parseFloat(current_translate[1]) : move_down_ref.current

            const new_y = current_y - move_amount

            steps_vertical.animate([
                {
                    transform: `translateY(${new_y}px)`,
                    easing: 'ease-out'
                }
            ], {
                duration: 800,
            })

            setTimeout(() => {
                steps_vertical.style.transform = `translateY(${new_y}px)`
            }, 800);
        }
    }, [tasks_ref.current])

    React.useLayoutEffect(() => {
        const win_rect = document.documentElement.clientHeight
        console.log("win_rect", win_rect);

        const steps_vertical = document.querySelector(".steps-vertical") as HTMLElement;
        steps_vertical.style.transform = `translateY(${(win_rect / 2) - 15}px)`
        move_down_ref.current = (win_rect / 2) - 15;

        window.addEventListener('data-tasks', (evt: Event & { detail: TTask[] }) => {
            console.log("data task event in main", evt, evt.detail);
            setTasks(evt.detail)
            tasks_ref.current = evt.detail
            setTimeout(() => {
                handle_set_cur_task()
            }, 0);
        })
    }, [])

    return (
        <div className="h-[100vh] overflow-hidden grid grid-cols-[200px_1fr] grid-rows-[30px_1fr]">
            <div 
                className="header flex justify-center relative col-span-full border-b-[.5px] border-stone-400 dark:border-stone-700"
                style={{ WebkitAppRegion: 'drag' } as any}
            >
                <div className='text-stone-800 flex items-center justify-center dark:text-stone-200'>
                    Tareas
                </div>
                <div 
                    className="absolute right-0 h-[100%] flex"
                    style={{ WebkitAppRegion: 'no-drag' } as any}
                >
                    <div
                        onClick={() => (window as any).electron?.minimize_app()}
                        style={{
                            height: '100%',
                            width: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            border: 'none',
                            transition: 'background-color 0.15s ease',
                            WebkitAppRegion: 'no-drag'
                        } as any}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                    >
                        <Minus style={{ width: '16px', height: '16px' }} />
                    </div>
                    <div
                        onClick={() => (window as any).electron?.maximize_app()}
                        style={{
                            height: '100%',
                            width: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            border: 'none',
                            transition: 'background-color 0.15s ease',
                            WebkitAppRegion: 'no-drag'
                        } as any}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                    >
                        <Square style={{ width: '14px', height: '14px' }} />
                    </div>
                    <div
                        onClick={() => (window as any).electron?.close_app()}
                        style={{
                            height: '100%',
                            width: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            border: 'none',
                            transition: 'all 0.15s ease',
                            WebkitAppRegion: 'no-drag'
                        } as any}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e81123'
                            e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'inherit'
                        }}
                    >
                        <X style={{ width: '16px', height: '16px' }} />
                    </div>
                </div>
            </div>

            <div className='border-r-[.5px] overflow-hidden border-stone-400 dark:border-stone-700'>
                <ul className="steps steps-vertical text-xs">
                    {
                        currentTask != undefined &&
                        tasks.map((task, index) =>
                            <li key={index} id={'id-' + index.toString()} className={`step ${tasks.findIndex((t) => currentTask.title == t.title && currentTask.duration == t.duration) >= index && 'step-primary'}`}>
                                <span className='flex flex-col'>
                                    <span>{task.title}</span>
                                    <span className='opacity-70'>{`${friendlyTime(task.duration).hour}h ${friendlyTime(task.duration).min}m ${friendlyTime(task.duration).sec}s`}</span>
                                </span>

                            </li>
                        )
                    }
                </ul>
            </div>
            <div className='flex justify-center overflow-hidden items-center'>
                {allTasksCompleted ? (
                    <div className="flex flex-col items-center text-center px-4">
                        <div className="mb-4">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h2 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2 leading-tight">
                                ¡Todas las tareas completadas!
                            </h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Finalizaste a las {completionTime}
                            </p>
                        </div>

                        <div className="flex flex-col space-y-2 w-full max-w-sm">
                            <button
                                onClick={handleBackToHome}
                                className="btn btn-primary flex items-center justify-center space-x-2 py-2 text-sm"
                            >
                                <Home className="w-4 h-4" />
                                <span>Volver al inicio</span>
                            </button>

                            <button
                                onClick={handleRestartTasks}
                                className="btn btn-secondary flex items-center justify-center space-x-2 py-2 text-sm"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Repetir tareas</span>
                            </button>
                        </div>

                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            Total: {tasks.length} tareas
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {
                            currentTask != undefined &&
                            <div className='text-center capitalize text-xl mb-2 text-violet-600 dark:text-violet-400 font-bold'>
                                {
                                    currentTask.title
                                }
                            </div>
                        }

                        <div className='text-xs text-center text-purple-600 mb-4 dark:text-purple-400'>
                            {
                                currentTime == null ?
                                    <div></div> :
                                    currentTime?.hour.toString().padStart(2, '0') + ':' + currentTime?.min.toString().padStart(2, '0') + ':' + currentTime?.sec.toString().padStart(2, '0')
                            }
                        </div>

                        {
                            currentTime != undefined &&
                            <div className='flex space-x-2 justify-center items-center'>
                                <span className="countdown font-mono text-4xl">
                                    {/* @ts-ignore */}
                                    <span style={{ "--value": currentHour }} aria-live="polite" aria-label={currentHour}>{currentHour}</span>
                                </span>
                                <span>:</span>
                                <span className="countdown font-mono text-4xl">
                                    {/* @ts-ignore */}
                                    <span style={{ "--value": currentMin }} aria-live="polite" aria-label={currentMin}>{currentMin}</span>
                                </span>
                                <span>:</span>
                                <span className="countdown font-mono text-4xl">
                                    {/* @ts-ignore */}
                                    <span style={{ "--value": currentSec }} aria-live="polite" aria-label={currentSec}>{currentSec}</span>
                                </span>
                            </div>
                        }

                        <div className='mt-4 flex justify-center'>
                            {
                                paused ?
                                    <Play onClick={() => handlePauseTask(false)} className='w-[20px] h-[20px]' /> :
                                    <Pause onClick={() => handlePauseTask(true)} className='w-[20px] h-[20px]' />
                            }
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
})