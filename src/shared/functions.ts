export const friendlyTime = (duration: number) => {
    const hour = Math.floor(duration / (60 * 60 * 1000));
    const min = Math.floor(duration - (hour * (60 * 60 * 1000))) / (60*1000);
    const sec = Math.floor((duration - (hour * (60 * 60 * 1000))) - (min * 60 * 1000)) / 1000

    return {
        hour, min, sec
    }

}

export const broadcast_event = (event_name:string, data:any) => {
    const ev = new CustomEvent(event_name, {detail: data})
    window.dispatchEvent(ev)
}