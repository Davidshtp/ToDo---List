import { ArrowBigDown, ArrowUp, Pen, Plus, X } from "lucide-react";
import React from "react";
import { useMainState } from "./shared/zus-store";
import { TaskList } from "./shared/SharedComponents";

export default React.memo((props: any) => {
    const [hour, setHour] = React.useState<number>(0)
    const [min, setMin] = React.useState<number>(0)
    const [sec, setSec] = React.useState<number>(0)
    const [title, setTitle] = React.useState<string>('')
    const [error, setError] = React.useState<string>('')
    const tasks = useMainState(state => state.tasks)
    const taskMemo = React.useMemo(() => tasks, [tasks])

    const set_state = useMainState(state => state.set_state)

    const handleAddTask = React.useCallback(() => {
        const h = hour * (60 * 60 * 100);
        const m = min * (60 * 100);
        const s = min * 1000;
        const duration = h + m + s
        const task = {
            title,
            duration,
        }

        console.log("task", task);

        set_state('tasks', [...tasks, task])
    }, [title, hour, min, sec, tasks])

    const handleRmTask = React.useCallback((index: number) => {
        tasks.splice(index, 1)
    }, [tasks])


    const handleInputChange = React.useCallback((title: 'hour' | 'min' | 'sec', value: string) => {
        setError('')
        const regexp = /\d+/
        if (!regexp.test(value) && value !== '') {
            return setError('Only numbers can be provided')    
        }


        if (title == 'hour') setHour(parseInt(value))
        if (title == 'min' && (parseInt(value) < 60 || value == '')) setMin(value=== '' ? 0 : parseInt(value))
        if (title == 'sec' && (parseInt(value) < 60 || value == '')) setSec(value=== '' ? 0 : parseInt(value))
    }, [])
    return (
        <div className="h-[100vh] overflow-hidden grid grid-cols-[250px_1fr] grid-rows-[30px_1fr]">
            <div className="header relative col-span-full border-b-[.5px] border-stone-400 dark:border-stone-800">
                <div className="absolute left-0 h-full w-[30px] flex justify-center items-center">
                    <X className="w-5 h-5" />
                </div>
                <div></div>
            </div> 
            <div className="border-r-[.5px] scroller overflow-auto border-stone-400 dark:border-stone-700">
                <div className="flex relative min-h-[80vh] overflow-x-hidden flex-col space-y-4 text-xs p-2 divide-y-[.5px] divide-stone-800">
                    {
                        taskMemo.length == 0 ?
                        <div className="w-[100%] absolute top-[calc(50%-10px)] flex justify-center items-center"> 
                            <span className="font-italic text-stone-400 dark:text-stone-700">No task added yet</span>
                        </div>:
                        taskMemo.map((task, index) => 
                            <TaskList data={task} index={index} rmCb={handleRmTask} />
                        )
                    }
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="flex flex-col">
                    <div className="text xl font-bold mb-2 text-center">Add Task</div>
                    <div className="flex flex-col">
                        {/*<div className="text-sm opacity-70">Title</div>*/}
                        <div>
                            <input type="text" onChange={(e) => setTitle((e.currentTarget as HTMLInputElement).value)} placeholder="Task Title" className="input text-center h-[30px] border-0 focus:border-0 bg-transparent border-b rounded-0 focus:outline-0" />
                        </div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <div className="text-sm opacity-70 mb-2">Duration</div>
                        <div className="flex space-x-4">
                            <input type="text" value={hour == 0 ? '' : hour} onChange={(e) => handleInputChange ('hour', (e.currentTarget as HTMLInputElement).value)} placeholder="HH" className="input text-center w-[50px] rounded-0 focus:outline-0 bg-transparent" />
                            <input type="text" value={min == 0 ? '' : min} onChange={(e) => handleInputChange ('min', (e.currentTarget as HTMLInputElement).value)} placeholder="MM" className="input text-center w-[50px] rounded-0 focus:outline-0 bg-transparent" />
                            <input type="text" value={sec == 0 ? '' : sec} onChange={(e) => handleInputChange ('sec', (e.currentTarget as HTMLInputElement).value)} placeholder="SS" className="input text-center w-[50px] rounded-0 focus:outline-0 bg-transparent" />
                        </div>
                        <div className="text-xs mt-2 text-red-300 dark:text-red-600 opacity-70 mb-2">{error}</div>
                    </div>
                    <div>
                        <button onClick={handleAddTask} disabled={error !== '' || (hour == 0 && min == 0 && sec == 0) || title== ''} className="btn btn-soft btn-primary w-[100%]">
                            <Plus className="w-[20px] h-[20px]"/>Add Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
})