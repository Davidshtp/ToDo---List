import { X } from "lucide-react";
import React from "react";
export default React.memo((props: any) => {
    return (
        <div className="h-screen grid grid-cols-[200px_1fr] grid-rows-[30px_1fr]">
            <div className="header relative col-span-full border-b-[.5px] border-stone-400 dark:border-stone-800">
                <div className="absolute left-0 h-full w-[30px] flex justify-center items-center">
                    <X className="w-5 h-5" />
                </div>
                <div></div>
            </div>
            <div className="border-r-[.5px] border-stone-400 dark:border-stone-800"></div>
            <div className="flex justify-center items-center">
                <div className="flex flex-col">
                    <div className="text xl font-bold mb-2 text-center">Add Task</div>
                    <div className="flex flex-col">
                        {/*<div className="text-sm opacity-70">Title</div>*/}
                        <div>
                            <input type="text" placeholder="Task Title" className="input text-center h-[30px] border-0 focus:border-0 bg-transparent border-b rounded-0 focus:outline-0" />
                        </div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <div className="text-sm opacity-70 mb-2">Duration</div>
                        <div className="flex space-x-4">
                            <input type="text" placeholder="HH" className="input text-center w-[50px] rounded-0 focus:outline-0 bg-transparent" />
                            <input type="text" placeholder="MM" className="input text-center w-[50px] rounded-0 focus:outline-0 bg-transparent" />
                            <input type="text" placeholder="SS" className="input text-center w-[50px] rounded-0 focus:outline-0 bg-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})