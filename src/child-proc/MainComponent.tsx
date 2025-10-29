import { X } from 'lucide-react'
import React from 'react'
import { TTask } from '../shared/types'
import { friendlyTime } from '../shared/functions'

export default React.memo((props: any) => {
  const [task, setTask] = React.useState<TTask[]>([

    { "title": 'Workout', 
      "duration": 7200000 
    },
    { "title": 'Cook & Clean the room', 
      "duration": 3600000 
    },
    { "title": 'Eat', 
      "duration": 2745000
    },
    { "title": 'Code', 
      "duration": 2520000 
    },
    { "title": 'Break', 
      "duration": 1830000 
    },
    { "title": 'Code', 
      "duration": 1440000 
    },
  ])
  const [currentDuration, sectCurrentDuration] = React.useState<number>(0)
  const [currentTime, sectCurrentTime] = React.useState<typeof friendlyTime | null>(null)
  const [currentMin, sectCurrentMin] = React.useState<number>(0)
  const [currentHour, sectCurrentHour] = React.useState<number>(0)
  const [currentSec, sectCurrentSec] = React.useState<number>(0)
  const [currentTask, sectCurrentTask] = React.useState<TTask>()
  const watch_intv_ref = React.useRef<any>(null)

  const handle_set_current_task = React.useCallback(() => {
    const currentTaskIndex = currenTask == undefined ? 0 : task.findIndex(task => task.duration == currentTask.duration && task.title == currentTask.title)
    sectCurrentTask(Task[currentTaskIndex]);
    handle_watch_task()
  }, [currentTask, task])

  const handle_watch_task = React.useCallback(() => {
    sectCurrentDuration(currentTask.duration)
    sectCurrentTime(friendlyTime(currentTask.duration)as any)
    watch_intv_ref.current = setInterval(() => {

    }, 1000);
  }, [currentTask])

  React.useLayoutEffect(() => {
    window.addEventListener('data-task', (ev: Event & { detail: TTask[] }) => {
      console.log("data task event in main", evt, evt.detail);
      setTask(evt.detail)
    })
  }, [])

  return (
    <div className="h-[100vh] overflow-hidden grid grid-cols-[200px_1fr] grid-rows-[30px_1fr]">
      <div className="header flex justify-center relative col-span-full border-b-[.5px] border-stone-400 dark:border-stone-700">
        <div onClick={() => window.close()} className="absolute left-0 h-[100%] w-[30px] flex justify-center items-center">
          <X className="w-[20px] h-[20px]" />
        </div>
        <div className='text-stone-800 flex items-center justify-center dark:text-stone-200'>
          Taco Task
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
                  <span className='opacity-70'>{`${friendlyTime(task.duration).hour}hrs ${friendlyTime(task.duration).min}min ${friendlyTime(task.duration).sec}sec`}</span>
                </span>

              </li>
            )
          }
          {/* <li className="step step-primary">Choose plan</li>
          <li className="step">Purchase</li>
          <li className="step">Receive Product</li> */}
        </ul>
      </div>
      <div className='flex justify-center overflow-hidden items-center'>
        <div className="flex flex-col">
          <div className='text-center text-xl mb-2 text-violet-600 dark:text-violet-400 font-bold'>
            {
              "Workout"
            }
          </div>

          <div className="flex space-x-2 justify-center items-center">
            <span className='countdown font-mono text-4xl'>
              {/*@ts-ignore*/}
              <span style={{ "--value": currentHour }} aria-live='polite' aria-label={currentHour}>{currentHour}</span>
            </span>
            <span>:</span>
            <span className='countdown font-mono text-4xl'>
              {/*@ts-ignore*/}
              <span style={{ "--value": currentMin }} aria-live='polite' aria-label={currentMin}>{currentHour}</span>
            </span>
            <span>:</span>
            <span className='countdown font-mono text-4xl'>
              {/*@ts-ignore*/}
              <span style={{ "--value": currentSec }} aria-live='polite' aria-label={currentSec}>{currentHour}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})